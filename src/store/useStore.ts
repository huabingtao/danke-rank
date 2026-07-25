import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  openId: string;
  wechatName: string;
  avatar: string;
  gameId: string;
  gameNickname: string;
}

export interface Batch {
  id: string;
  date: string;
  time: string;
  targetScore: number;
  maxCapacity: number;
  currentCount: number;
  avatarUrl: string;
  qrCodeUrl: string;
  notice: string;
  status: 'active' | 'invalid';
}

export interface Booking {
  openId: string;
  batchId: string;
  locked: boolean;
  status: 'booked' | 'invalid_unlocked';
  bookedAt: number;
  user?: User;
}

export interface AppState {
  user: User | null;
  isAdmin: boolean;
  batches: Batch[];
  bookings: Record<string, Booking>;
  loading: boolean;
  fetchBatches: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  addBatch: (batch: Batch) => Promise<void>;
  updateBatch: (updated: Batch) => Promise<void>;
  deleteBatch: (batchId: string) => Promise<void>;
  bookBatch: (openId: string, batchId: string, userDetails?: User) => Promise<void>;
  unlockBooking: (openId: string) => Promise<void>;
  markBatchInvalid: (batchId: string) => Promise<void>;
  resetDatabase: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      batches: [],
      bookings: {},
      loading: false,

      fetchBatches: async () => {
        set({ loading: true });
        try {
          const res = await fetch('/api/batches');
          const data = await res.json();
          if (data.success) {
            set({ batches: data.batches || [], loading: false });
          } else {
            set({ loading: false });
          }
        } catch (e) {
          console.error('Error fetching batches:', e);
          set({ loading: false });
        }
      },

      setUser: (newUser) =>
        set((state) => {
          if (!newUser) {
            if (state.user?.openId) {
              const openId = state.user.openId;
              get().unlockBooking(openId);
            }
            return { user: null };
          }
          const persistentOpenId =
            state.user?.openId || newUser.openId || `dev_usr_${Date.now()}`;
          return { user: { ...newUser, openId: persistentOpenId } };
        }),

      setIsAdmin: (isAdmin) => set({ isAdmin }),

      addBatch: async (batch) => {
        // Optimistic update
        set((state) => ({ batches: [batch, ...state.batches] }));
        try {
          const res = await fetch('/api/batches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batch),
          });
          const data = await res.json();
          if (data.success && data.batches) {
            set({ batches: data.batches });
          }
        } catch (e) {
          console.error('Failed to sync addBatch:', e);
        }
      },

      updateBatch: async (updated) => {
        set((state) => ({
          batches: state.batches.map((b) => (b.id === updated.id ? updated : b)),
        }));
        try {
          const res = await fetch(`/api/batches/${updated.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          });
          const data = await res.json();
          if (data.success && data.batches) {
            set({ batches: data.batches });
          }
        } catch (e) {
          console.error('Failed to sync updateBatch:', e);
        }
      },

      deleteBatch: async (batchId) => {
        set((state) => ({
          batches: state.batches.filter((b) => b.id !== batchId),
        }));
        try {
          const res = await fetch(`/api/batches/${batchId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success && data.batches) {
            set({ batches: data.batches });
          }
        } catch (e) {
          console.error('Failed to sync deleteBatch:', e);
        }
      },

      bookBatch: async (openId, batchId, userDetails) => {
        const u = userDetails || get().user;
        set((state) => ({
          bookings: {
            ...state.bookings,
            [openId]: {
              openId,
              batchId,
              locked: true,
              status: 'booked',
              bookedAt: Date.now(),
              user: u || undefined,
            },
          },
          batches: state.batches.map((b) =>
            b.id === batchId ? { ...b, currentCount: b.currentCount + 1 } : b
          ),
        }));

        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              openId,
              batchId,
              userName: u?.gameNickname || u?.wechatName || '特工玩家',
              avatarUrl: u?.avatar || '/avatars/科萌.png',
            }),
          });
          const data = await res.json();
          if (data.success && data.batches) {
            set({ batches: data.batches });
          }
        } catch (e) {
          console.error('Failed to sync bookBatch:', e);
        }
      },

      unlockBooking: async (openId) => {
        set((state) => {
          const booking = state.bookings[openId];
          if (!booking) return state;
          const { batchId } = booking;
          const newBookings = { ...state.bookings };
          delete newBookings[openId];
          return {
            bookings: newBookings,
            batches: state.batches.map((b) =>
              b.id === batchId
                ? { ...b, currentCount: Math.max(0, b.currentCount - 1) }
                : b
            ),
          };
        });

        try {
          const res = await fetch('/api/bookings', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ openId }),
          });
          const data = await res.json();
          if (data.success && data.batches) {
            set({ batches: data.batches });
          }
        } catch (e) {
          console.error('Failed to sync unlockBooking:', e);
        }
      },

      markBatchInvalid: async (batchId) => {
        const batch = get().batches.find((b) => b.id === batchId);
        if (!batch) return;
        const newStatus = batch.status === 'active' ? 'invalid' : 'active';
        await get().updateBatch({ ...batch, status: newStatus });
      },

      resetDatabase: async () => {
        try {
          const res = await fetch('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reset' }),
          });
          const data = await res.json();
          if (data.success) {
            set({ batches: data.batches, bookings: {} });
          }
        } catch (e) {
          console.error('Failed to reset database:', e);
        }
      },

      clearAllData: async () => {
        try {
          const res = await fetch('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'clear' }),
          });
          const data = await res.json();
          if (data.success) {
            set({ batches: [], bookings: {} });
          }
        } catch (e) {
          console.error('Failed to clear database:', e);
        }
      },
    }),
    {
      name: 'danke-rank-store',
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
);

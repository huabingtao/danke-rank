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
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  addBatch: (batch: Batch) => void;
  updateBatch: (updated: Batch) => void;
  deleteBatch: (batchId: string) => void;
  bookBatch: (openId: string, batchId: string, userDetails?: User) => void;
  unlockBooking: (openId: string) => void;
  markBatchInvalid: (batchId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      batches: [
        {
          id: '20260725-0005-66',
          date: '2026-07-25',
          time: '00:05:00',
          targetScore: 66,
          maxCapacity: 200,
          currentCount: 0,
          avatarUrl: '/avatars/科萌.png',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TieGroup66',
          notice: `本群为66精准并列群，非66的朋友请自觉退群。
📢 活动并列第一怎么玩？
• 第一天：进度66，0点前下线。
• 第二天：凌晨看群通知，几百人秒级同步上线。
• 分到一组的人：5人建群，商量好不要动进度。
• 后面几天：继续保持同分，一起拿第一。
• 最后一天定好目标并列分数，也可以一起并列拿第一。`,
          status: 'active',
        },
        {
          id: '20260725-0805-106',
          date: '2026-07-25',
          time: '08:05:00',
          targetScore: 106,
          maxCapacity: 200,
          currentCount: 0,
          avatarUrl: '/avatars/凯蒂斯.png',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TieGroup106',
          notice: `本群为106精准并列群，非106的朋友请自觉退群。
📢 活动并列第一怎么玩？
• 第一天：进度106，0点前下线。
• 第二天：凌晨看群通知，几百人秒级同步上线。
• 分到一组的人：5人建群，商量好不要动进度。
• 后面几天：继续保持同分，一起拿第一。
• 最后一天定好目标并列分数，也可以一起并列拿第一。`,
          status: 'active',
        },
        {
          id: '20260723-0005-66',
          date: '2026-07-23',
          time: '00:05:00',
          targetScore: 66,
          maxCapacity: 200,
          currentCount: 0,
          avatarUrl: '/avatars/沃尔默.png',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TieGroup66Hist',
          notice: `本群为66精准并列历史发车班次战术归档。`,
          status: 'active',
        },
      ],
      bookings: {},
      setUser: (newUser) =>
        set((state) => {
          if (!newUser) {
            // When user clears profile data (清除资料), automatically cancel active booking & decrement batch count
            if (state.user?.openId) {
              const openId = state.user.openId;
              const existingBooking = state.bookings[openId];
              if (existingBooking) {
                const { batchId } = existingBooking;
                const newBookings = { ...state.bookings };
                delete newBookings[openId];
                return {
                  user: null,
                  bookings: newBookings,
                  batches: state.batches.map((b) =>
                    b.id === batchId
                      ? { ...b, currentCount: Math.max(0, b.currentCount - 1) }
                      : b
                  ),
                };
              }
            }
            return { user: null };
          }

          // Preserve persistent openId for this device/user
          const persistentOpenId =
            state.user?.openId || newUser.openId || `dev_usr_${Date.now()}`;
          const updatedUser = { ...newUser, openId: persistentOpenId };

          // Sync nickname and avatar updates to any active booking
          const existingBooking = state.bookings[persistentOpenId];
          const newBookings = existingBooking
            ? {
                ...state.bookings,
                [persistentOpenId]: {
                  ...existingBooking,
                  user: updatedUser,
                },
              }
            : state.bookings;

          return { user: updatedUser, bookings: newBookings };
        }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      addBatch: (batch) => set((state) => ({ batches: [batch, ...state.batches] })),
      updateBatch: (updated) =>
        set((state) => ({
          batches: state.batches.map((b) => (b.id === updated.id ? updated : b)),
        })),
      deleteBatch: (batchId) =>
        set((state) => ({
          batches: state.batches.filter((b) => b.id !== batchId),
        })),
      bookBatch: (openId, batchId, userDetails) =>
        set((state) => ({
          bookings: {
            ...state.bookings,
            [openId]: {
              openId,
              batchId,
              locked: true,
              status: 'booked',
              bookedAt: Date.now(),
              user: userDetails || state.user || undefined,
            },
          },
          batches: state.batches.map((b) =>
            b.id === batchId ? { ...b, currentCount: b.currentCount + 1 } : b
          ),
        })),
      unlockBooking: (openId) =>
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
        }),
      markBatchInvalid: (batchId) =>
        set((state) => ({
          batches: state.batches.map((b) =>
            b.id === batchId
              ? { ...b, status: b.status === 'active' ? 'invalid' : 'active' }
              : b
          ),
        })),
    }),
    { name: 'survivor-tie-next-store' }
  )
);

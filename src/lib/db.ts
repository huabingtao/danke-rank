import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import fs from 'fs';

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
  userName: string;
  avatarUrl: string;
  bookedAt: string;
}

export interface DataSchema {
  batches: Batch[];
  bookings: Record<string, Booking>;
}

export const INITIAL_BATCHES: Batch[] = [
  {
    id: '20260726-0019-66',
    date: '2026-07-26',
    time: '00:19:19',
    targetScore: 66,
    maxCapacity: 200,
    currentCount: 0,
    avatarUrl: '/avatars/老板.png',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TieGroup66_0019',
    notice: `本群为66精准并列群（00:19:19晚班班次），非66的朋友请自觉退群。
📢 活动并列第一怎么玩？
• 第一天：进度66，0点前下线。
• 第二天：凌晨看群通知，几百人秒级同步上线。
• 分到一组的人：5人建群，商量好不要动进度。
• 后面几天：继续保持同分，一起拿第一。`,
    status: 'active',
  },
  {
    id: '20260726-0919-66',
    date: '2026-07-26',
    time: '09:19:19',
    targetScore: 66,
    maxCapacity: 200,
    currentCount: 0,
    avatarUrl: '/avatars/老板.png',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TieGroup66_0919',
    notice: `本群为66精准并列群（09:19:19早班班次），非66的朋友请自觉退群。
📢 活动并列第一怎么玩？
• 第一天：进度66，0点前下线。
• 第二天：早晨看群通知，几百人秒级同步上线。
• 分到一组的人：5人建群，商量好不要动进度。
• 后面几天：继续保持同分，一起拿第一。`,
    status: 'active',
  },
  {
    id: '20260726-0019-106',
    date: '2026-07-26',
    time: '00:19:19',
    targetScore: 106,
    maxCapacity: 200,
    currentCount: 0,
    avatarUrl: '/avatars/老板.png',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TieGroup106_0019',
    notice: `本群为106精准并列群（00:19:19晚班班次），非106的朋友请自觉退群。
📢 活动并列第一怎么玩？
• 第一天：进度106，0点前下线。
• 第二天：凌晨看群通知，几百人秒级同步上线。
• 分到一组的人：5人建群，商量好不要动进度。
• 后面几天：继续保持同分，一起拿第一。`,
    status: 'active',
  },
  {
    id: '20260726-0919-106',
    date: '2026-07-26',
    time: '09:19:19',
    targetScore: 106,
    maxCapacity: 200,
    currentCount: 0,
    avatarUrl: '/avatars/老板.png',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TieGroup106_0919',
    notice: `本群为106精准并列群（09:19:19早班班次），非106的朋友请自觉退群。
📢 活动并列第一怎么玩？
• 第一天：进度106，0点前下线。
• 第二天：早晨看群通知，几百人秒级同步上线。
• 分到一组的人：5人建群，商量好不要动进度。
• 后面几天：继续保持同分，一起拿第一。`,
    status: 'active',
  },
];

const defaultData: DataSchema = {
  batches: INITIAL_BATCHES,
  bookings: {},
};

export async function getDb() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const dbFile = path.join(dir, 'danke-rank.json');
  return await JSONFilePreset<DataSchema>(dbFile, defaultData);
}

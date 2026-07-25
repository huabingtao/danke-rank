'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Info,
  Calendar,
  Target,
  ShieldAlert,
  Filter,
  Flame,
  Gamepad2,
  ChevronRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useStore, Batch } from '../store/useStore';

export interface BatchLobbyProps {
  onEnterCabin?: (batchId: string) => void;
}

export const BatchLobby: React.FC<BatchLobbyProps> = ({ onEnterCabin }) => {
  const { batches } = useStore();

  // Timer refresh ticker (updates state every 1 sec to refresh remaining countdown)
  const [now, setNow] = useState<number>(Date.now());
  const [filter, setFilter] = useState<'today' | 'history'>('today');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set up 1-second interval to update live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show auto-disappearing toast alerts
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Copy notice to clipboard
  const handleCopyNotice = (noticeText: string, batchId: string) => {
    if (noticeText) {
      navigator.clipboard.writeText(noticeText);
      showToast(`📋 已复制班次 [${batchId}] 战术公告至剪贴板`);
    }
  };

  // Helper to format countdown timer for each batch
  const getCountdownString = (dateStr: string, timeStr: string) => {
    try {
      const normalizedTime = timeStr.trim().split(':').length === 2 ? `${timeStr.trim()}:00` : timeStr.trim();
      const targetTime = new Date(`${dateStr.trim()}T${normalizedTime}`).getTime();

      if (isNaN(targetTime)) {
        return { isExpired: false, text: '时间待定' };
      }

      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        return { isExpired: true, text: '已到发车时间' };
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      const pad = (num: number) => String(num).padStart(2, '0');

      if (days > 0) {
        return { isExpired: false, text: `${days}天 ${pad(hours)}:${pad(mins)}:${pad(secs)}` };
      }
      return { isExpired: false, text: `${pad(hours)}:${pad(mins)}:${pad(secs)}` };
    } catch {
      return { isExpired: false, text: '计算中...' };
    }
  };

  // Handle entering cabin
  const handleEnterCabinClick = (batchId: string) => {
    if (onEnterCabin) {
      onEnterCabin(batchId);
    } else {
      showToast(`🚗 正在进入班次车厢 [${batchId}]...`);
    }
  };

  const todayStr = new Date(now).toISOString().split('T')[0];

  // Filtered batch list
  const filteredBatches = batches.filter((b) => {
    const { isExpired } = getCountdownString(b.date, b.time);
    if (filter === 'today') {
      return b.date >= todayStr && !isExpired;
    }
    if (filter === 'history') {
      return b.date < todayStr || isExpired;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900/95 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 animate-spin-slow" />
            <p className="text-xs font-semibold leading-relaxed">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lobby Header & Statistics */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden border border-white/10">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              并列发车大厅
            </h2>
          </div>

          {/* Key Stat Card: Total Batches Only */}
          <div className="shrink-0">
            <div className="glass-card px-6 py-3.5 rounded-xl border border-white/10 text-center min-w-[130px]">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">总班次数</span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                {batches.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout Container (Left 3 cols, Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 并列活动玩法 (lg:col-span-3) */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-white tracking-tight">并列活动玩法指南</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
              稳拿第一
            </span>
          </div>

          {/* Core Principle Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>核心机制：同分共享第 1 名</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              组内 5 人保持相同目标分数，实现<strong className="text-emerald-400 font-bold">全员并列第 1 名</strong>！5天活动最高可拿 <strong className="text-amber-300 font-bold">4 个金配件/金宠物</strong>。
            </p>
          </div>

          {/* 5-Step Process */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>通关 5 步流程：</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="font-bold text-slate-200 text-xs">首日停分下线</div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    第 1 天打到目标分（如 66 分），<strong className="text-amber-300 font-normal">24点前必须下线</strong>。
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="font-bold text-slate-200 text-xs">精确秒级上线</div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    第 2 天看群通知，配合“悬浮时钟”<strong className="text-emerald-300 font-normal">精确到秒同步上线</strong>。
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="font-bold text-slate-200 text-xs">同组 5 人建群</div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    匹配成功后 5 人拉小群，沟通约定<strong className="text-amber-300 font-normal">统一锁定分数不再增加</strong>。
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <div className="font-bold text-slate-200 text-xs">全程保持同分</div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    后续几天继续保持同分锁榜，共同霸榜第一名。
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <div className="font-bold text-slate-200 text-xs">终局并列拿满</div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    最后一天定好目标分齐步走，全员满额领奖！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Section */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1.5 text-xs">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>‼️ 进群必备规则</span>
            </div>
            <ul className="text-slate-300 space-y-1 text-[11px] list-disc list-inside leading-relaxed">
              <li>更换游戏内指定老板头像</li>
              <li>群昵称与游戏内昵称保持一致</li>
              <li>进群发送 66/106 进度截图标记</li>
              <li>iOS/安卓准备好“悬浮时钟”精准发车</li>
            </ul>
          </div>
        </div>

        {/* Right Column: 发车班次列表 (lg:col-span-9) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Filter Tabs (Only 2 Tabs: 今日班次 & 历史班次) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-medium">
              <button
                onClick={() => setFilter('today')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  filter === 'today'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>今日班次</span>
              </button>

              <button
                onClick={() => setFilter('history')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  filter === 'history'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>历史班次</span>
              </button>
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline">
              共找到 <strong className="text-emerald-400">{filteredBatches.length}</strong> 个班次
            </span>
          </div>

          {/* Batches Grid (3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBatches.length === 0 ? (
              <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-400 space-y-3">
                <Info className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold">暂无符合条件的发车班次</p>
                <p className="text-xs text-slate-500">请更改筛选条件或等待发布最新班次。</p>
              </div>
            ) : (
              filteredBatches.map((batch) => {
                const isInvalid = batch.status === 'invalid';
                const countdown = getCountdownString(batch.date, batch.time);
                const isHistorical = batch.date < todayStr;

                return (
                  <div
                    key={batch.id}
                    className={`glass-card rounded-2xl p-5 transition-all duration-300 border relative overflow-hidden flex flex-col justify-between group ${
                      isInvalid
                        ? 'border-rose-500/20 bg-rose-950/10 opacity-75'
                        : isHistorical
                        ? 'border-white/5 bg-slate-950/40 opacity-85'
                        : 'border-white/10 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5'
                    }`}
                  >
                    <div>
                      {/* Top Row: 排行榜进度 66 Badge Only (Right status badge removed) */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-tight flex items-center gap-1.5 shadow-sm">
                          <Target className="w-3.5 h-3.5 text-amber-400" />
                          <span>排行榜进度 {batch.targetScore}</span>
                        </span>

                        {isInvalid && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> 已失效
                          </span>
                        )}
                      </div>

                      {/* HERO BANNER: Departure Time + Giant Countdown */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 mb-3 space-y-2.5 relative overflow-hidden text-center">
                        <span className="text-[10px] text-emerald-400/90 font-bold uppercase tracking-wider block">
                          实时发车倒计时
                        </span>
                        <div className="text-2xl md:text-3xl font-black font-mono tracking-tight text-emerald-300 group-hover:text-emerald-200 transition-colors">
                          {countdown.text}
                        </div>
                      </div>

                      {/* Prominent Single-Line Info Bar: Time, Date & Car ID (No line wraps!) */}
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 mb-3 text-[11px] font-mono space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span className="text-emerald-400 flex items-center gap-1">
                            🚀 {batch.time} 发车
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            📅 {batch.date}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate pt-0.5 border-t border-white/5 flex items-center justify-between">
                          <span>车号:</span>
                          <span className="font-bold text-slate-300">{batch.id}</span>
                        </div>
                      </div>

                      {/* Batch Notice Section with Copy Button */}
                      <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 mb-4 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            📢 班次战术公告
                          </span>
                          {batch.notice && (
                            <button
                              onClick={() => handleCopyNotice(batch.notice, batch.id)}
                              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20"
                            >
                              📋 复制公告
                            </button>
                          )}
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3 whitespace-pre-line font-medium">
                          {batch.notice ? batch.notice : '遵照班次排行榜目标准时发车'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleEnterCabinClick(batch.id)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 group-hover:border-emerald-500/60"
                      >
                        <span>进入车厢</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

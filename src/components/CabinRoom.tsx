'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Shield,
  RefreshCw,
  UserCheck,
  Info,
  Check,
  Megaphone,
  X,
} from 'lucide-react';
import { useStore, Batch } from '../store/useStore';
import { usePrecisionTimer } from '../hooks/usePrecisionTimer';

export interface CabinRoomProps {
  batch: Batch;
  onBackLobby: () => void;
}

export const CabinRoom: React.FC<CabinRoomProps> = ({ batch, onBackLobby }) => {
  const { user, unlockBooking, markBatchInvalid } = useStore();

  // 1. 调用高精度秒/两位数毫秒级跳跃倒计时 Hook (合并日期与时间)
  const targetDateTime = batch.date ? `${batch.date} ${batch.time}` : batch.time;
  const { hours, mins, secs, ms } = usePrecisionTimer(targetDateTime);

  // 状态管理
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ url: string; title?: string } | null>(null);

  // 提示消息淡出
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // 复制公告说明
  const handleCopyNotice = () => {
    if (batch.notice) {
      navigator.clipboard.writeText(batch.notice);
      setCopiedNotice(true);
      triggerToast('已复制战术公告至剪贴板');
      setTimeout(() => setCopiedNotice(false), 2500);
    }
  };

  // 快捷触发班次撤销解绑
  const handleConfirmAutoInvalidAndRequeue = () => {
    setShowConfirmModal(false);
    if (user) {
      unlockBooking(user.openId);
    }
    if (batch.id) {
      markBatchInvalid(batch.id);
    }
    triggerToast('已自动解除锁定，即刻为您返回大厅重新预约排队！');

    setTimeout(() => {
      onBackLobby();
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Toast 提示浮窗 */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/90 text-white font-semibold text-sm shadow-2xl backdrop-blur-md border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 顶部导航与班次概况 Header Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackLobby}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回发车大厅</span>
          </button>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              【{batch.time}】发车车厢
            </h2>
            <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
              #{batch.id}
            </span>
          </div>
        </div>
      </div>

      {/* 动态秒级/毫秒级高精度倒计时 Section */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-cyan-500/40 bg-gradient-to-br from-slate-900/95 via-slate-950/98 to-slate-900/95 shadow-2xl shadow-cyan-500/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-100 tracking-wide flex flex-wrap items-center gap-2">
              <span>距离</span>
              {batch.date && <span className="text-cyan-400 font-mono">{batch.date}</span>}
              <span className="text-cyan-300 font-mono">{batch.time}</span>
              <span>发车倒计时</span>
            </h3>
          </div>

          {/* 搬移至倒计时卡片顶部右上角 */}
          <span className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm sm:text-base md:text-lg font-black shadow-md flex items-center gap-2">
            🎯 排行榜目标积分: <strong className="text-amber-200 text-base sm:text-xl md:text-2xl font-mono">{batch.targetScore}</strong> 分
          </span>
        </div>

        {/* 精致适中字号与高度 HH:MM:SS.ms 动态跳跃展示 */}
        <div className="py-4 my-2 flex items-center justify-center gap-2 sm:gap-4 md:gap-5 font-mono select-none relative z-10">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-18 sm:w-28 md:w-36 h-20 sm:h-28 md:h-32 rounded-2xl bg-black/60 border-2 border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-md">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {hours}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-400 mt-2">时</span>
          </div>

          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-cyan-400 self-center -mt-6">
            :
          </span>

          {/* Mins */}
          <div className="flex flex-col items-center">
            <div className="w-18 sm:w-28 md:w-36 h-20 sm:h-28 md:h-32 rounded-2xl bg-black/60 border-2 border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-md">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {mins}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-400 mt-2">分</span>
          </div>

          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-cyan-400 self-center -mt-6">
            :
          </span>

          {/* Secs */}
          <div className="flex flex-col items-center">
            <div className="w-18 sm:w-28 md:w-36 h-20 sm:h-28 md:h-32 rounded-2xl bg-black/60 border-2 border-cyan-500/50 flex items-center justify-center shadow-2xl backdrop-blur-md bg-cyan-950/30">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-cyan-300 tracking-wider drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                {secs}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-cyan-400 mt-2">秒</span>
          </div>

          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-amber-400 self-center -mt-6">
            .
          </span>

          {/* Milliseconds */}
          <div className="flex flex-col items-center">
            <div className="w-18 sm:w-28 md:w-36 h-20 sm:h-28 md:h-32 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 flex items-center justify-center shadow-2xl backdrop-blur-md">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-400 tracking-wider drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                {ms}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-amber-400 mt-2">毫秒</span>
          </div>
        </div>

        {/* 底部秒针提醒 Banner (完整保留) */}
        <div className="mt-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-cyan-200 text-xs sm:text-sm leading-relaxed relative z-10">
          <Info className="w-5 h-5 shrink-0 text-cyan-400" />
          <span>
            <strong>踩点提示：</strong>发车前3分钟请保持退出游戏账号，倒计时结束后准时点击进入开始游戏
          </span>
        </div>
      </section>

      {/* 战术公告与统一游戏头像更换说明 Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 卡片 1: 班次战术公告 */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border border-white/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">班次战术公告说明</h3>
                  <p className="text-xs text-slate-400">队长发车规则与入场须知</p>
                </div>
              </div>
              <button
                onClick={handleCopyNotice}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="复制公告"
              >
                {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                <span>{copiedNotice ? '已复制' : '一键复制'}</span>
              </button>
            </div>

            {/* QR Codes Display (Placed right above Notice text) */}
            {(() => {
              const qrList = (batch.qrCodes && batch.qrCodes.length > 0)
                ? batch.qrCodes
                : (batch.qrCodeUrl ? [{ url: batch.qrCodeUrl, description: '微信拉群二维码' }] : []);

              if (qrList.length === 0) return null;

              return (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>📱 扫码进群 / 联系队长 ({qrList.length}张)</span>
                    <span className="text-[10px] text-cyan-400 font-mono">点击放大</span>
                  </div>
                  <div className={qrList.length === 1 ? 'flex justify-center' : 'grid grid-cols-2 gap-3'}>
                    {qrList.map((qr, qIdx) => (
                      <div
                        key={qIdx}
                        onClick={() => setZoomImage({ url: qr.url, title: qr.description || `二维码 ${qIdx + 1}` })}
                        className="flex flex-col items-center p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cyan-500/50 cursor-pointer transition-all group/qr"
                      >
                        {/* eslint-disable-next-html-element-suppression */}
                        <img
                          src={qr.url}
                          alt="QR Code"
                          className="w-24 h-24 object-contain rounded-lg border border-cyan-500/30 group-hover/qr:scale-105 transition-transform"
                        />
                        {qr.description && (
                          <span className="text-xs text-cyan-300 font-medium mt-1 truncate max-w-full text-center">
                            {qr.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 min-h-[120px] flex items-start">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {batch.notice || '暂无专属班次公告说明...'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-blue-300/90 leading-relaxed">
            📢 提示：请根据队长公布的规则操作，确保准确跟车！
          </div>
        </div>

        {/* 卡片 2: 统一游戏头像更换说明 */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border border-white/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">统一游戏头像更换说明</h3>
                  <p className="text-xs text-slate-400">防路人混入核心校验暗语</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                必须更换
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-black/30 border border-amber-500/20">
              <div className="relative shrink-0">
                <img
                  src={batch.avatarUrl}
                  alt="统一特工头像"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shadow-amber-500/20"
                />
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow">
                  战队统一头像
                </span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    进入游戏个人主页 &rarr; 点击更换头像 &rarr; 选中左侧对应战队统一头像。
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    匹配成功后核对本组同车玩家，若发现非统一头像玩家即为野生路人。
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    全员确认统一后打到排行榜目标 <strong>{batch.targetScore} 分</strong> 即刻停手并列领奖！
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-300/90 leading-relaxed flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>重要：统一更换头像可确保精准识别同路车友，防止野生路人卷分破坏大局。</span>
          </div>
        </div>
      </div>

      {/* 路人混入作废/重新排队 Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6 md:p-8 relative border border-rose-500/40 space-y-6 text-slate-200">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-7 h-7" />
              <h3 className="text-xl font-extrabold text-white">确认本小队有路人混入？</h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10">
              <p className="font-semibold text-rose-300">系统将执行以下避险解除操作：</p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>自动调用 <code>unlockBooking</code> 解除您当前账号的班次预约锁定</li>
                <li>弹出提示“已自动解除锁定”</li>
                <li>即刻返回发车大厅引导您重新排队预约全新班次</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-medium text-sm transition-all"
              >
                取消操作
              </button>
              <button
                onClick={handleConfirmAutoInvalidAndRequeue}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/40 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>确认解除并重新排队</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Zoom Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel p-6 rounded-3xl border border-cyan-500/40 max-w-sm w-full space-y-4 text-center shadow-2xl relative animate-in zoom-in-95"
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {zoomImage.title && (
              <h3 className="text-sm font-extrabold text-cyan-300 tracking-tight pt-1">
                {zoomImage.title}
              </h3>
            )}
            <div className="p-3 bg-white rounded-2xl shadow-inner flex items-center justify-center">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={zoomImage.url}
                alt="QR Code Enlarged"
                className="w-full h-auto max-h-80 object-contain rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-400">长按或使用微信扫码进群</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabinRoom;

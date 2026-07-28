'use client';

import React, { useState, useEffect } from 'react';
import { Target, Clock, ShieldCheck, Flame, Tv } from 'lucide-react';

export default function DynamicOverlayPage() {
  const [now, setNow] = useState(Date.now());
  const [streamerName, setStreamerName] = useState('呱呱 · 弹壳特攻队');
  const [subtitle, setSubtitle] = useState('66 / 106分 精准并列班次');
  const [guildBadge, setGuildBadge] = useState('⚔️ 公会难度 15 · 招 2 人');

  // Update clock every second for live animation & realtime countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format current clock
  const timeStr = new Date(now).toLocaleTimeString('zh-CN', { hour12: false });
  const dateStr = new Date(now).toISOString().split('T')[0];

  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden relative font-sans select-none flex items-center justify-between p-8 text-slate-100">
      
      {/* CSS Keyframes for dynamic background animations */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.2; }
        }
        .animate-pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }
        .animate-float {
          animation: floatParticle 6s ease-in-out infinite;
        }
      `}</style>

      {/* DYNAMIC BACKGROUND LAYER: Animated Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Floating sci-fi background particles */}
      <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-orange-500/20 rounded-2xl rotate-12 pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/6 w-40 h-40 border border-cyan-500/20 rounded-full pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

      {/* LEFT PANEL: Live Stream Info & Guild Details */}
      <div className="w-[28%] h-full rounded-3xl bg-slate-900/80 border border-white/15 p-6 flex flex-col justify-between backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden">
        <div className="space-y-4">
          
          {/* Streamer Title Badge */}
          <div className="space-y-1 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>LIVE BROADCASTING</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 tracking-tight">
              {streamerName}
            </h1>
            <p className="text-xs lg:text-sm font-bold text-slate-300">
              {subtitle}
            </p>
          </div>

          {/* Dynamic Badges */}
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs lg:text-sm font-bold flex items-center gap-2.5 shadow-lg">
            <Flame className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <span>{guildBadge}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/35 text-cyan-200 text-xs lg:text-sm font-bold flex items-center gap-2.5 shadow-lg">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>🔒 今晚 00:10 自动解密发车时间</span>
          </div>

          {/* Bullet Rules */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2 text-xs text-slate-300">
            <div className="font-black text-emerald-400 flex items-center gap-1.5 border-b border-white/10 pb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>战队精准并列保障</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside leading-relaxed">
              <li>66 / 106 分精准班次保障</li>
              <li>每天 00:10 准时解锁秒级发车</li>
              <li>锁定进度防护，共赢第一</li>
            </ul>
          </div>
        </div>

        {/* Bottom Platform Domain & Live Clock */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-sky-400 font-bold">🌐 发车排班平台</div>
            <div className="text-xs font-mono font-bold text-slate-200">dankerank.guaguahub.cn</div>
          </div>
          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-400">{dateStr}</div>
            <div className="text-sm font-black text-orange-400">{timeStr}</div>
          </div>
        </div>
      </div>

      {/* CENTER 9:16 MOBILE GAME SCREEN FRAME (Translucent Frame for OBS Capture) */}
      <div className="h-full aspect-[9/16] rounded-3xl border-2 border-cyan-400/80 bg-slate-950/30 relative z-10 flex flex-col items-center justify-center p-4 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
        
        {/* Corner Neon Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-2xl" />

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/40 text-slate-200 space-y-1 backdrop-blur-md">
          <div className="text-sm lg:text-base font-black text-cyan-300 flex items-center justify-center gap-2">
            <Tv className="w-5 h-5 text-cyan-400" />
            <span>9:16 手机游戏捕获区域</span>
          </div>
          <p className="text-xs text-slate-400">
            (在 OBS 中将《弹壳特攻队》游戏投屏置于此框内)
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: QR Codes & WeChat Join Group Cards */}
      <div className="w-[28%] h-full rounded-3xl bg-slate-900/80 border border-white/15 p-6 flex flex-col justify-between backdrop-blur-xl shadow-2xl relative z-10">
        
        <div className="text-center space-y-1 border-b border-white/10 pb-3">
          <h2 className="text-lg font-black text-slate-100 flex items-center justify-center gap-2">
            <span>📱 扫码加入并列战队</span>
          </h2>
          <p className="text-xs text-slate-400">关注直播间 · 准时同步发车</p>
        </div>

        <div className="space-y-4 my-auto">
          {/* QR 1 Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2 hover:border-emerald-500/40 transition-all">
            <img
              src="/uploads/qr_group_66.png"
              alt="微信群二维码"
              className="w-28 h-28 mx-auto rounded-xl bg-white p-1 shadow-md object-contain"
            />
            <div className="text-xs lg:text-sm font-bold text-slate-100">
              微信群 (扫码进群)
            </div>
            <div className="text-[10px] text-slate-400">
              扫码直接加入并发车
            </div>
          </div>

          {/* QR 2 Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2 hover:border-emerald-500/40 transition-all">
            <img
              src="/uploads/qr_personal_guagua.png"
              alt="队长个人微信"
              className="w-28 h-28 mx-auto rounded-xl bg-white p-1 shadow-md object-contain"
            />
            <div className="text-xs lg:text-sm font-bold text-slate-100">
              队长微信 (并列咨询)
            </div>
            <div className="text-[10px] text-slate-400">
              队长一对一答疑与拉群
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 font-bold border-t border-white/10 pt-3 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>实时同步解密 · 准时起飞</span>
        </div>

      </div>

    </div>
  );
}

'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="glass-header sticky top-0 z-40 py-3.5 mb-6 transition-all duration-300">
      <div className="app-container flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              弹
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-black tracking-tight text-gradient">
                弹壳特工队 · 并列发车平台
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>每日测试班次实时展示大厅</span>
        </div>
      </div>
    </header>
  );
};


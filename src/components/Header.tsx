'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="glass-header sticky top-0 z-40 py-3.5 mb-6 transition-all duration-300">
      <div className="app-container flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src="/brand/bing-mark.svg"
            alt="并列发车"
            width={40}
            height={40}
            className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-full"
          />

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


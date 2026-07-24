'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Sparkles,
  Gamepad2,
  AlertCircle,
  User as UserIcon,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    name: '科萌',
    url: '/avatars/科萌.png',
  },
  {
    name: '凯蒂斯',
    url: '/avatars/凯蒂斯.png',
  },
  {
    name: '沃尔默',
    url: '/avatars/沃尔默.png',
  },
  {
    name: '金',
    url: '/avatars/金.png',
  },
  {
    name: '月咏',
    url: '/avatars/月咏.png',
  },
  {
    name: '杨大师',
    url: '/avatars/杨大师.png',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useStore();

  const [gameNickname, setGameNickname] = useState('');
  const [gameId, setGameId] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setGameNickname(user.gameNickname || '');
      setGameId(user.gameId || '');
      setAvatar(user.avatar || PRESET_AVATARS[0].url);
    } else {
      setGameNickname('');
      setGameId('');
      setAvatar(PRESET_AVATARS[0].url);
    }
    setErrorMsg('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameNickname.trim()) {
      setErrorMsg('特工游戏昵称为必填项，请输入您的游戏昵称');
      return;
    }

    const openId = user?.openId || `player_${Math.random().toString(36).substring(2, 10)}`;

    setUser({
      openId,
      wechatName: gameNickname.trim(),
      avatar,
      gameId: gameId.trim() || '9582014',
      gameNickname: gameNickname.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card Container */}
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden z-10 space-y-6">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>设置游戏玩家资料</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                用于发车预约、班次名额锁定与队员识别
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              选择特工形象头像
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((item) => {
                const isSelected = avatar === item.url;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setAvatar(item.url)}
                    className={`relative p-1 rounded-xl border transition-all flex flex-col items-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/20 scale-105 shadow-md shadow-emerald-500/20'
                        : 'border-white/10 bg-slate-900/40 hover:border-white/30'
                    }`}
                  >
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="text-[10px] text-slate-300 mt-1 truncate max-w-full">
                      {item.name}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Game Nickname Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>特工游戏昵称</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={gameNickname}
              onChange={(e) => setGameNickname(e.target.value)}
              placeholder="例如: 极速发车-阿猫"
              maxLength={20}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-semibold"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              请填写您在《弹壳特工队》游戏内的准确游戏昵称
            </p>
          </div>

          {/* Game ID (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              游戏 ID (选填)
            </label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="例如: 9582014"
              maxLength={15}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>保存个人资料</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { DatePicker, TimePicker, ConfigProvider, theme } from 'antd';
import dayjs from 'dayjs';
import {
  Calendar,
  Clock,
  Target,
  Image as ImageIcon,
  Megaphone,
  PlusCircle,
  Edit3,
  Ban,
  Trash2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Filter,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useStore, Batch } from '../store/useStore';

const pickerTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#3b82f6',
    colorBgContainer: 'rgba(15, 23, 42, 0.6)',
    colorBgElevated: '#1e293b',
    colorText: '#f8fafc',
    colorTextPlaceholder: '#64748b',
    colorBorder: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
};

// Preset Avatars for quick selection (Official Survivor.io Agents)
const PRESET_AVATARS = [
  {
    name: '老板',
    url: '/avatars/老板.png',
  },
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
  {
    name: '凛音',
    url: '/avatars/凛音.png',
  },
  {
    name: '乔伊',
    url: '/avatars/乔伊.png',
  },
];

export const AdminPanel: React.FC = () => {
  const { batches, addBatch, updateBatch, deleteBatch, markBatchInvalid, resetDatabase, clearAllData, fetchBatches } =
    useStore();

  // Form State with specified defaults: targetScore = 66, notice = ''
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '20:00:00',
    targetScore: 66,
    avatarUrl: PRESET_AVATARS[0].url,
    notice: '',
  });

  // UI States
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'invalid'>('all');
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Handle new batch submission
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      showNotification('error', '请填写发车日期与发车时间');
      return;
    }

    const formattedDate = formData.date.replace(/-/g, '');
    const formattedTime = formData.time.substring(0, 5).replace(':', '');
    const targetScore = Number(formData.targetScore) || 66;
    const generatedId = `${formattedDate}-${formattedTime}-${targetScore}`;

    const newBatch: Batch = {
      id: generatedId,
      date: formData.date,
      time: formData.time,
      targetScore,
      maxCapacity: 200,
      currentCount: 0,
      avatarUrl: formData.avatarUrl.trim(),
      qrCodeUrl: '',
      notice: formData.notice.trim(),
      status: 'active',
    };

    addBatch(newBatch);
    showNotification('success', `成功发布发车班次 #${newBatch.id}！`);

    // Reset optional notice field while keeping useful defaults
    setFormData((prev) => ({
      ...prev,
      time: '21:00:00',
      notice: '',
    }));
  };

  // Handle edit batch submit
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    updateBatch(editingBatch);
    showNotification('info', `班次 #${editingBatch.id} 已成功修改`);
    setEditingBatch(null);
  };

  // Handle delete execution
  const handleDeleteBatch = (id: string) => {
    deleteBatch(id);
    setDeleteConfirmId(null);
    showNotification('info', `班次 #${id} 已安全删除`);
  };

  // Filtered batches logic
  const filteredBatches = batches.filter((b) => {
    if (filterStatus === 'active') return b.status === 'active';
    if (filterStatus === 'invalid') return b.status === 'invalid';
    return true;
  });

  // Calculate summary metrics
  const totalActive = batches.filter((b) => b.status === 'active').length;
  const totalInvalid = batches.filter((b) => b.status === 'invalid').length;
  const totalRecruiting = batches.reduce((acc, b) => acc + b.maxCapacity, 0);
  const totalBooked = batches.reduce((acc, b) => acc + b.currentCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-semibold backdrop-blur-md transition-all animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-blue-950/90 border-blue-500/50 text-blue-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden border border-amber-500/20">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              发车班次管理与控制中心
            </h1>
            <p className="text-xs text-slate-400">
              发布新发车班次、配置战队统一头像及查看管理已发布车次。
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid grid-cols-2 gap-3 min-w-[220px]">
              <div className="glass-card p-3 rounded-xl border border-white/5 text-center">
                <div className="text-[10px] text-slate-400">总发车班次</div>
                <div className="text-lg font-extrabold text-slate-100">{batches.length}</div>
              </div>
              <div className="glass-card p-3 rounded-xl border border-emerald-500/20 text-center bg-emerald-500/5">
                <div className="text-[10px] text-emerald-400 font-medium">进行中车次</div>
                <div className="text-lg font-extrabold text-emerald-300">{totalActive}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  if (window.confirm('确认要清空数据库中所有发车班次和预约数据吗？此操作不可撤销。')) {
                    await clearAllData();
                    showNotification('info', '数据库已成功清空所有发车班次及预约！');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                title="清空所有班次与预约"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>清空所有数据</span>
              </button>

              <button
                onClick={async () => {
                  if (window.confirm('确认要重置数据库并恢复 7月26日 4 个预设发车班次吗？')) {
                    await resetDatabase();
                    showNotification('success', '已重新生成 7月26日 4 个标准预设发车班次！');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                title="重置为 7月26日 4 个发车班次"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>恢复 4 个预设班次</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Publish Form (Left) & Batches List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Publish Form Section */}
        <section className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">发布新发车班次</h2>
                  <p className="text-[11px] text-slate-400">填写班次参数后一键发布至大厅</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              {/* Row 1: Date & Time */}
              <ConfigProvider theme={pickerTheme}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>发车日期</span>
                    </label>
                    <DatePicker
                      className="w-full glass-input text-slate-100 text-xs font-mono h-9"
                      value={formData.date ? dayjs(formData.date, 'YYYY-MM-DD') : null}
                      onChange={(_, dateString) => {
                        if (!dateString) return;
                        const val = Array.isArray(dateString) ? dateString[0] : dateString;
                        if (val) setFormData({ ...formData, date: val });
                      }}
                      placeholder="选择发车日期"
                      format="YYYY-MM-DD"
                      allowClear={false}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>发车时间</span>
                    </label>
                    <TimePicker
                      className="w-full glass-input text-slate-100 text-xs font-mono h-9"
                      value={formData.time ? dayjs(formData.time, 'HH:mm:ss') : null}
                      onChange={(_, timeString) => {
                        if (!timeString) return;
                        const val = Array.isArray(timeString) ? timeString[0] : timeString;
                        if (val) setFormData({ ...formData, time: val });
                      }}
                      placeholder="选择发车时间"
                      format="HH:mm:ss"
                      allowClear={false}
                    />
                  </div>
                </div>
              </ConfigProvider>

              {/* Row 2: Target Score */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>排行榜目标积分</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">默认 66 分</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={1}
                    max={999}
                    value={formData.targetScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetScore: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full glass-input px-3 py-2 rounded-xl text-slate-100 text-xs font-mono pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400">分</span>
                </div>
              </div>

              {/* Row 3: Unified Avatar Selection */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                    <span>选择战队统一特工头像</span>
                  </span>
                  {formData.avatarUrl && (
                    <span className="text-[10px] text-teal-300 font-mono">已选中头像</span>
                  )}
                </label>

                {/* Preset Avatars Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((item) => {
                    const isSelected = formData.avatarUrl === item.url;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarUrl: item.url })}
                        className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-teal-500/20 border-teal-400 ring-2 ring-teal-500/30 scale-105'
                            : 'bg-slate-900/50 border-white/10 hover:border-slate-500 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-html-element-suppression */}
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="text-[10px] text-slate-300 mt-1 truncate w-full text-center">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Shift Announcement */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>班次公告说明</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.notice}
                  onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                  placeholder="可选：可在此填写班次入场说明与规则..."
                  className="w-full glass-input p-3 rounded-xl text-slate-100 text-xs leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full glass-button py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>立即发布该班次</span>
              </button>
            </form>
          </div>
        </section>

        {/* Batches List & Management Section */}
        <section className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">已发布班次列表</h2>
                  <p className="text-[11px] text-slate-400">
                    管理已发布的班次卡片（修改 / 作废 / 删除）
                  </p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/5 text-[11px]">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    filterStatus === 'all'
                      ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  <span>全部 ({batches.length})</span>
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    filterStatus === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>发车中 ({totalActive})</span>
                </button>
                <button
                  onClick={() => setFilterStatus('invalid')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    filterStatus === 'invalid'
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Ban className="w-3 h-3" />
                  <span>已作废 ({totalInvalid})</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredBatches.length === 0 ? (
              <div className="py-12 text-center space-y-3 glass-card rounded-xl border border-white/5">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                <p className="text-xs text-slate-400">暂无符合筛选条件的发车班次</p>
              </div>
            ) : (
              /* Batch Cards List */
              <div className="space-y-4">
                {filteredBatches.map((batch) => {
                  return (
                    <div
                      key={batch.id}
                      className={`glass-card p-5 rounded-2xl space-y-4 border transition-all ${
                        batch.status === 'invalid'
                          ? 'border-rose-500/30 bg-rose-950/10 opacity-75'
                          : 'border-white/10 hover:border-blue-500/40'
                      }`}
                    >
                      {/* Top Bar: ID, Status, Date/Time */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                            #{batch.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              batch.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {batch.status === 'active' ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                正常发车中
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3" />
                                已标记作废
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            {batch.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            {batch.time}
                          </span>
                        </div>
                      </div>

                      {/* Main Card Content */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        {/* Avatar Thumbnail */}
                        <div className="sm:col-span-3 flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            {/* eslint-disable-next-html-element-suppression */}
                            <img
                              src={batch.avatarUrl}
                              alt="Avatar"
                              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40 shadow-md"
                            />
                            <span className="text-[9px] text-slate-400 mt-1">统一头像</span>
                          </div>
                        </div>

                        {/* Details & Notice */}
                        <div className="sm:col-span-9 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300 flex items-center gap-1">
                              <Target className="w-3.5 h-3.5 text-amber-400" />
                              排行榜目标: {batch.targetScore} 分
                            </span>
                          </div>

                          {/* Notice snippet */}
                          <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-950/40 p-2 rounded-lg border border-white/5 leading-relaxed">
                            {batch.notice || '未填写公告'}
                          </p>
                        </div>
                      </div>

                      {/* Card Action Controls: 修改 / 作废 / 删除 */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingBatch({ ...batch })}
                          className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>修改</span>
                        </button>

                        {/* Invalidate / Reactivate Button */}
                        <button
                          onClick={() => {
                            markBatchInvalid(batch.id);
                            showNotification(
                              'info',
                              batch.status === 'active'
                                ? `班次 #${batch.id} 已标记作废`
                                : `班次 #${batch.id} 已恢复正常`
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            batch.status === 'active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {batch.status === 'active' ? (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>作废班次</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>恢复班次</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button with Confirmation Inline UI */}
                        {deleteConfirmId === batch.id ? (
                          <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-500/50 p-1 rounded-xl animate-in fade-in">
                            <span className="text-[10px] text-rose-200 px-1 font-bold">确认删除?</span>
                            <button
                              onClick={() => handleDeleteBatch(batch.id)}
                              className="p-1 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                              title="确认删除"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                              title="取消"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(batch.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>删除</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-white/20 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-slate-100">
                  修改发车班次 #{editingBatch.id}
                </h3>
              </div>
              <button
                onClick={() => setEditingBatch(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <ConfigProvider theme={pickerTheme}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold mb-1 block">发车日期</label>
                    <DatePicker
                      className="w-full glass-input text-slate-100 font-mono text-xs h-9"
                      value={editingBatch.date ? dayjs(editingBatch.date, 'YYYY-MM-DD') : null}
                      onChange={(_, dateString) => {
                        if (!dateString) return;
                        const val = Array.isArray(dateString) ? dateString[0] : dateString;
                        if (val) setEditingBatch({ ...editingBatch, date: val });
                      }}
                      placeholder="选择发车日期"
                      format="YYYY-MM-DD"
                      allowClear={false}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold mb-1 block">发车时间</label>
                    <TimePicker
                      className="w-full glass-input text-slate-100 font-mono text-xs h-9"
                      value={editingBatch.time ? dayjs(editingBatch.time, 'HH:mm:ss') : null}
                      onChange={(_, timeString) => {
                        if (!timeString) return;
                        const val = Array.isArray(timeString) ? timeString[0] : timeString;
                        if (val) setEditingBatch({ ...editingBatch, time: val });
                      }}
                      placeholder="选择发车时间"
                      format="HH:mm:ss"
                      allowClear={false}
                    />
                  </div>
                </div>
              </ConfigProvider>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold mb-1 block">排行榜目标积分</label>
                <input
                  type="number"
                  required
                  value={editingBatch.targetScore}
                  onChange={(e) =>
                    setEditingBatch({
                      ...editingBatch,
                      targetScore: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full glass-input px-3 py-2 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold mb-1 block">
                  统一头像图片 URL
                </label>
                <input
                  type="text"
                  value={editingBatch.avatarUrl}
                  onChange={(e) =>
                    setEditingBatch({ ...editingBatch, avatarUrl: e.target.value })
                  }
                  className="w-full glass-input px-3 py-2 rounded-xl text-slate-100 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold mb-1 block">
                  班次公告
                </label>
                <textarea
                  rows={3}
                  value={editingBatch.notice}
                  onChange={(e) =>
                    setEditingBatch({ ...editingBatch, notice: e.target.value })
                  }
                  className="w-full glass-input p-3 rounded-xl text-slate-100 leading-relaxed text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl glass-button text-white text-xs font-bold shadow-lg shadow-blue-500/20"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

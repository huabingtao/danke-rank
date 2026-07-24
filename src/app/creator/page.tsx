'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { AdminPanel } from '../../components/AdminPanel';
import { AuthModal } from '../../components/AuthModal';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function CreatorPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header Navigation Bar */}
      <Header />

      {/* Main Container Area for Creator Panel */}
      <main className="flex-1 app-container pb-12 pt-6">
        {!mounted ? (
          <div className="py-20 text-center text-slate-400 animate-pulse">
            加载创作者后台中...
          </div>
        ) : (
          <AdminPanel />
        )}
      </main>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

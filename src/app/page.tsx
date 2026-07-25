'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BatchLobby } from '../components/BatchLobby';
import { CabinRoom } from '../components/CabinRoom';
import { useStore } from '../store/useStore';

export default function Home() {
  const { batches, fetchBatches } = useStore();
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<'lobby' | 'cabin'>('lobby');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchBatches();

    // Auto poll database every 5 seconds for real-time multi-device sync
    const interval = setInterval(() => {
      fetchBatches();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchBatches]);

  // Global custom event listener for enterCabin
  useEffect(() => {
    const handleEnterCabinEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const batchId =
        typeof customEvent.detail === 'string'
          ? customEvent.detail
          : customEvent.detail?.batchId;
      if (batchId) {
        setSelectedBatchId(batchId);
        setCurrentView('cabin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('enterCabin', handleEnterCabinEvent);

    return () => {
      window.removeEventListener('enterCabin', handleEnterCabinEvent);
    };
  }, []);

  const handleEnterCabin = (batchId: string) => {
    setSelectedBatchId(batchId);
    setCurrentView('cabin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackLobby = () => {
    setSelectedBatchId(null);
    setCurrentView('lobby');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find the selected batch for CabinRoom
  const selectedBatch =
    batches.find((b) => b.id === selectedBatchId) || batches[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation Bar */}
      <Header />

      {/* Main Container Area */}
      <main className="flex-1 app-container pb-12">
        {!mounted ? (
          /* Hydration loading fallback */
          <div className="py-20 text-center text-slate-400 animate-pulse">
            加载发车大厅中...
          </div>
        ) : currentView === 'cabin' && selectedBatch ? (
          /* Cabin Room View */
          <CabinRoom batch={selectedBatch} onBackLobby={handleBackLobby} />
        ) : (
          /* Player / Batch Lobby View */
          <BatchLobby onEnterCabin={handleEnterCabin} />
        )}
      </main>
    </div>
  );
}

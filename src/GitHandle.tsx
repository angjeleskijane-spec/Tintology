import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  GitBranch,
  Download,
  Upload,
  ArrowDownLeft,
  X,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import GitStudio, { GitStatusData } from './GitStudio';

export default function GitHandle() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [status, setStatus] = useState<GitStatusData | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [quickNotification, setQuickNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setQuickNotification(msg);
    setTimeout(() => setQuickNotification(null), 3500);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/git/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickFetch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading('fetch');
    try {
      const token = localStorage.getItem('tintology_gh_token') || undefined;
      const res = await fetch('/api/git/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        notify('Origin Fetch успешен!');
        fetchStatus();
      } else {
        notify(`Грешка: ${data.error}`);
      }
    } catch (err: any) {
      notify(`Грешка: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickPull = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading('pull');
    try {
      const token = localStorage.getItem('tintology_gh_token') || undefined;
      const res = await fetch('/api/git/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: status?.branch || 'main', token }),
      });
      const data = await res.json();
      if (data.success) {
        notify('Pull успешен!');
        fetchStatus();
      } else {
        notify(`Грешка: ${data.error}`);
      }
    } catch (err: any) {
      notify(`Грешка: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickPush = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading('push');
    try {
      const token = localStorage.getItem('tintology_gh_token') || undefined;
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: status?.branch || 'main', token }),
      });
      const data = await res.json();
      if (data.success) {
        notify('Push успешен!');
        fetchStatus();
      } else {
        notify(`Push: ${data.error || 'Потребен е GitHub токен'}`);
        setIsOpen(true); // open modal so user can configure token
      }
    } catch (err: any) {
      notify(`Грешка: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {quickNotification && (
        <div className="fixed bottom-20 right-6 z-[9999] rounded-xl bg-slate-900/95 border border-slate-700 px-4 py-2.5 text-xs text-white shadow-2xl backdrop-blur flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <FolderGit2 className="h-4 w-4 text-red-400" />
          <span>{quickNotification}</span>
        </div>
      )}

      {/* Floating Git Widget Handle (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-[9000] font-sans">
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            title="Отвори Git лента"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0e1422] text-red-400 border border-red-500/40 shadow-2xl hover:scale-105 transition"
          >
            <FolderGit2 className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full bg-[#0e1422]/95 backdrop-blur-md border border-slate-700/80 px-2.5 py-1.5 shadow-2xl shadow-black/80">
            {/* Main trigger button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-800/80 transition text-left"
              title="Отвори Git Studio"
            >
              <div className="relative">
                <FolderGit2 className="h-4 w-4 text-red-500" />
                <span
                  className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${
                    status?.isClean ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-semibold text-slate-200">{status?.branch || 'main'}</span>
                {status && (status.ahead > 0 || status.behind > 0) && (
                  <span className="text-[10px] text-amber-400">
                    {status.ahead > 0 && `↑${status.ahead}`}
                    {status.behind > 0 && `↓${status.behind}`}
                  </span>
                )}
                {status && !status.isClean && (
                  <span className="text-[10px] text-amber-300 font-bold">
                    ({status.files.length}*)
                  </span>
                )}
              </div>
            </button>

            {/* Divider */}
            <div className="h-4 w-px bg-slate-700/60 mx-0.5" />

            {/* Quick Fetch */}
            <button
              onClick={handleQuickFetch}
              disabled={actionLoading !== null}
              title="Quick Fetch (git fetch origin)"
              className="rounded-full bg-slate-800/80 hover:bg-slate-700 p-1.5 text-blue-400 transition disabled:opacity-50"
            >
              <Download className={`h-3.5 w-3.5 ${actionLoading === 'fetch' ? 'animate-bounce' : ''}`} />
            </button>

            {/* Quick Pull */}
            <button
              onClick={handleQuickPull}
              disabled={actionLoading !== null}
              title="Quick Pull (git pull origin)"
              className="rounded-full bg-slate-800/80 hover:bg-slate-700 p-1.5 text-emerald-400 transition disabled:opacity-50"
            >
              <ArrowDownLeft className={`h-3.5 w-3.5 ${actionLoading === 'pull' ? 'animate-spin' : ''}`} />
            </button>

            {/* Quick Push */}
            <button
              onClick={handleQuickPush}
              disabled={actionLoading !== null}
              title="Quick Push (git push origin)"
              className="rounded-full bg-red-600 hover:bg-red-500 p-1.5 text-white transition disabled:opacity-50"
            >
              <Upload className={`h-3.5 w-3.5 ${actionLoading === 'push' ? 'animate-pulse' : ''}`} />
            </button>

            {/* Expand Full Modal */}
            <button
              onClick={() => setIsOpen(true)}
              title="Отвори комплетно Git Студио"
              className="rounded-full bg-slate-800/60 hover:bg-slate-700 p-1.5 text-slate-300 transition"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>

            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(true)}
              title="Минимизирај"
              className="rounded-full hover:bg-slate-800 p-1 text-slate-400 hover:text-white transition"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Full Git Studio Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <GitStudio onClose={() => setIsOpen(false)} isModal={true} />
        </div>
      )}
    </>
  );
}

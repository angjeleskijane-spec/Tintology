import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  FilePlus,
  FileMinus,
  FileDiff,
  Terminal,
  ExternalLink,
  Key,
  Shield,
  Layers,
  ChevronRight,
  FolderGit2,
  Copy,
  Check,
  Eye,
  Plus,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Sparkles,
  Search,
  Sliders,
  Trash2,
} from 'lucide-react';

export interface GitFile {
  path: string;
  code: string;
  staged: boolean;
  isUntracked: boolean;
  isModified: boolean;
  isDeleted: boolean;
  isAdded: boolean;
}

export interface GitCommitItem {
  hash: string;
  author: string;
  dateRel: string;
  message: string;
  dateFull?: string;
}

export interface GitStatusData {
  branch: string;
  header: string;
  ahead: number;
  behind: number;
  isClean: boolean;
  files: GitFile[];
  lastCommit: {
    hash: string;
    author: string;
    date: string;
    message: string;
  } | null;
  remoteUrl: string;
  hasServerToken?: boolean;
}

interface GitStudioProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function GitStudio({ onClose, isModal = false }: GitStudioProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'changes' | 'branches' | 'history' | 'terminal'>('dashboard');
  const [status, setStatus] = useState<GitStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ id: string; time: string; type: 'info' | 'success' | 'error' | 'cmd'; text: string }>>([]);
  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('tintology_gh_token') || '');
  const [rememberToken, setRememberToken] = useState<boolean>(true);
  const [pushBranch, setPushBranch] = useState<string>('main');
  const [forcePush, setForcePush] = useState<boolean>(false);
  
  // Staging & Commit state
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [pushAfterCommit, setPushAfterCommit] = useState<boolean>(true);
  const [selectedFileForDiff, setSelectedFileForDiff] = useState<string | null>(null);
  const [diffContent, setDiffContent] = useState<string>('');
  const [diffLoading, setDiffLoading] = useState<boolean>(false);

  // Branches state
  const [branches, setBranches] = useState<{ current: string; branches: string[] }>({ current: 'main', branches: ['main'] });
  const [newBranchName, setNewBranchName] = useState<string>('');
  const [isCreatingBranch, setIsCreatingBranch] = useState<boolean>(false);

  // History state
  const [commits, setCommits] = useState<GitCommitItem[]>([]);
  const [historySearch, setHistorySearch] = useState<string>('');

  // Terminal state
  const [customCmd, setCustomCmd] = useState<string>('git status -s');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const log = useCallback((text: string, type: 'info' | 'success' | 'error' | 'cmd' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev.slice(-200), { id: Math.random().toString(), time, type, text }]);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const fetchStatus = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/git/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: GitStatusData = await res.json();
      setStatus(data);
      if (data.branch) setPushBranch(data.branch);
      if (!silent) log(`Ажуриран git статус за гранка [${data.branch}]`, 'info');
    } catch (err: any) {
      log(`Грешка при читање статус: ${err.message}`, 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [log]);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/git/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/git/log');
      if (res.ok) {
        const data = await res.json();
        setCommits(data.commits || []);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStatus();
    fetchBranches();
    fetchHistory();
  }, [fetchStatus, fetchBranches, fetchHistory]);

  // Save/clear token in localStorage
  const handleTokenChange = (tok: string) => {
    setGithubToken(tok);
    if (rememberToken) {
      if (tok) localStorage.setItem('tintology_gh_token', tok);
      else localStorage.removeItem('tintology_gh_token');
    }
  };

  // FETCH action
  const handleFetch = async () => {
    setActionLoading('fetch');
    log('Извршување: git fetch origin ...', 'cmd');
    try {
      const res = await fetch('/api/git/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Fetch грешка');
      }
      log(`Fetch успешен! ${data.stdout || ''} ${data.stderr || ''}`, 'success');
      await fetchStatus(true);
      await fetchHistory();
    } catch (err: any) {
      log(`Грешка при Fetch: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // PULL action
  const handlePull = async () => {
    setActionLoading('pull');
    log(`Извршување: git pull origin ${status?.branch || 'main'} ...`, 'cmd');
    try {
      const res = await fetch('/api/git/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: status?.branch || 'main', token: githubToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Pull грешка');
      }
      log(`Pull успешен! ${data.stdout || ''} ${data.stderr || ''}`, 'success');
      await fetchStatus(true);
      await fetchHistory();
    } catch (err: any) {
      log(`Грешка при Pull: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // PUSH action
  const handlePush = async () => {
    setActionLoading('push');
    const targetBranch = pushBranch || status?.branch || 'main';
    log(`Извршување: git push origin ${targetBranch} ${forcePush ? '(FORCE)' : ''} ...`, 'cmd');
    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: targetBranch,
          token: githubToken,
          force: forcePush,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Push грешка');
      }
      log(`Push успешен! ${data.stdout || ''} ${data.stderr || ''}`, 'success');
      await fetchStatus(true);
      await fetchHistory();
    } catch (err: any) {
      log(`Грешка при Push: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // STAGE action
  const handleStage = async (files: string[] | 'all') => {
    setActionLoading('stage');
    log(`Додавање во staging: ${files === 'all' ? 'сите датотеки' : files.join(', ')} ...`, 'cmd');
    try {
      const res = await fetch('/api/git/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Stage грешка');
      log(data.message, 'success');
      await fetchStatus(true);
    } catch (err: any) {
      log(`Грешка при stage: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // UNSTAGE action
  const handleUnstage = async (files: string[] | 'all') => {
    setActionLoading('unstage');
    log(`Отстранување од staging: ${files === 'all' ? 'сите датотеки' : files.join(', ')} ...`, 'cmd');
    try {
      const res = await fetch('/api/git/unstage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Unstage грешка');
      log(data.message, 'success');
      await fetchStatus(true);
    } catch (err: any) {
      log(`Грешка при unstage: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // COMMIT action
  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      log('Ве молиме внесете commit порака.', 'error');
      return;
    }
    setActionLoading('commit');
    log(`Креирање commit: "${commitMessage}" ...`, 'cmd');
    try {
      const res = await fetch('/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: commitMessage,
          stageAll: false, // user can stage before or check box
          pushAfter: pushAfterCommit,
          token: githubToken,
          branch: status?.branch || 'main',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Commit грешка');
      log(`Commit креиран! ${data.commitOutput || ''}`, 'success');
      if (data.pushOutput) {
        log(`Автоматски Push: ${data.pushOutput}`, 'success');
      }
      setCommitMessage('');
      await fetchStatus(true);
      await fetchHistory();
    } catch (err: any) {
      log(`Грешка при commit: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // VIEW DIFF
  const handleViewDiff = async (filePath: string, staged: boolean = false) => {
    setSelectedFileForDiff(filePath);
    setDiffLoading(true);
    try {
      const res = await fetch(`/api/git/diff?file=${encodeURIComponent(filePath)}&staged=${staged ? 'true' : 'false'}`);
      if (res.ok) {
        const data = await res.json();
        setDiffContent(data.diff || 'Нема видливи разлики за оваа датотека.');
      } else {
        setDiffContent('Неуспешно вчитување на diff.');
      }
    } catch (err: any) {
      setDiffContent(`Грешка: ${err.message}`);
    } finally {
      setDiffLoading(false);
    }
  };

  // SWITCH BRANCH
  const handleSwitchBranch = async (branchName: string) => {
    setActionLoading(`checkout-${branchName}`);
    log(`Префрлање на гранка: ${branchName} ...`, 'cmd');
    try {
      const res = await fetch('/api/git/branch/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: branchName }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Checkout грешка');
      log(data.message, 'success');
      await fetchStatus(true);
      await fetchBranches();
    } catch (err: any) {
      log(`Грешка: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // CREATE BRANCH
  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;
    setActionLoading('create-branch');
    log(`Креирање нова гранка: ${newBranchName} ...`, 'cmd');
    try {
      const res = await fetch('/api/git/branch/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: newBranchName.trim(), createNew: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Креирањето неуспешно');
      log(data.message, 'success');
      setNewBranchName('');
      setIsCreatingBranch(false);
      await fetchStatus(true);
      await fetchBranches();
    } catch (err: any) {
      log(`Грешка: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // RUN CUSTOM GIT COMMAND
  const handleRunCommand = async (cmdToRun?: string) => {
    const cmd = cmdToRun || customCmd;
    if (!cmd.trim()) return;
    log(`$ ${cmd}`, 'cmd');
    try {
      const res = await fetch('/api/git/cmd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      if (data.stdout) log(data.stdout, 'info');
      if (data.stderr) log(data.stderr, data.success ? 'info' : 'error');
      if (!data.success && data.error) log(data.error, 'error');
      if (cmd.includes('commit') || cmd.includes('checkout') || cmd.includes('add') || cmd.includes('push') || cmd.includes('pull')) {
        await fetchStatus(true);
      }
    } catch (err: any) {
      log(`Грешка: ${err.message}`, 'error');
    }
  };

  const stagedFiles = status?.files.filter(f => f.staged) || [];
  const unstagedFiles = status?.files.filter(f => !f.staged) || [];

  return (
    <div className={`flex flex-col bg-[#0b0f17] text-slate-100 ${isModal ? 'h-[90vh] max-h-[850px] w-full max-w-6xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden' : 'min-h-screen'}`}>
      
      {/* Top Header / Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#0e1422] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-lg tracking-tight">Tintology Git Studio</span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-300 border border-slate-700">
                v1.0
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status?.isClean ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status?.isClean ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {status?.isClean ? 'Чисто (Clean)' : `${status?.files.length || 0} изменети датотеки`}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Репозиториум:</span>
              <a
                href={status?.remoteUrl || 'https://github.com/angjeleskijane-spec/Tintology'}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 underline inline-flex items-center gap-1"
              >
                angjeleskijane-spec/Tintology
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>

        {/* Quick Actions (Fetch / Pull / Push) */}
        <div className="flex items-center gap-2">
          {/* Branch Badge */}
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs font-mono text-slate-300 border border-slate-700">
            <GitBranch className="h-3.5 w-3.5 text-red-400" />
            <span className="font-semibold text-white">{status?.branch || 'main'}</span>
            {status && (status.ahead > 0 || status.behind > 0) && (
              <span className="ml-1 text-[11px] text-amber-400">
                {status.ahead > 0 && `↑${status.ahead}`} {status.behind > 0 && `↓${status.behind}`}
              </span>
            )}
          </div>

          {/* Quick Fetch Button */}
          <button
            onClick={handleFetch}
            disabled={actionLoading !== null}
            title="Преземи ги најновите промени од GitHub без спојување"
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 transition disabled:opacity-50"
          >
            <Download className={`h-3.5 w-3.5 text-blue-400 ${actionLoading === 'fetch' ? 'animate-bounce' : ''}`} />
            <span>Fetch</span>
          </button>

          {/* Quick Pull Button */}
          <button
            onClick={handlePull}
            disabled={actionLoading !== null}
            title="Повлечи ги и спој ги најновите промени од GitHub"
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 transition disabled:opacity-50"
          >
            <ArrowDownLeft className={`h-3.5 w-3.5 text-emerald-400 ${actionLoading === 'pull' ? 'animate-spin' : ''}`} />
            <span>Pull</span>
          </button>

          {/* Quick Push Button */}
          <button
            onClick={handlePush}
            disabled={actionLoading !== null}
            title="Испрати ги локалните commits кон GitHub репозиториумот"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-red-600/20 transition disabled:opacity-50"
          >
            <Upload className={`h-3.5 w-3.5 ${actionLoading === 'push' ? 'animate-pulse' : ''}`} />
            <span>Push</span>
          </button>

          {/* Refresh Status */}
          <button
            onClick={() => fetchStatus()}
            disabled={loading}
            title="Освежи статус"
            className="rounded-lg bg-slate-800/80 p-1.5 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-[#0a0e17] px-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'dashboard'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Контролна табла</span>
        </button>

        <button
          onClick={() => setActiveTab('changes')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'changes'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileDiff className="h-4 w-4" />
          <span>Измени & Commit</span>
          {(status?.files.length || 0) > 0 && (
            <span className="rounded-full bg-red-600/30 px-2 py-0.2 text-[11px] font-bold text-red-300">
              {status?.files.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'branches'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          <span>Гранки (Branches)</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'history'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Историја (Log)</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'terminal'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>Git Конзола</span>
          {consoleLogs.length > 0 && (
            <span className="rounded-full bg-slate-800 px-2 py-0.2 text-[10px] text-slate-400">
              {consoleLogs.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Card: Git Hub Remote & Sync Control */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Primary Sync Card */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 border border-blue-500/20">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">GitHub Синхронизација (Push & Fetch)</h3>
                      <p className="text-xs text-slate-400">Управување со синхронизација помеѓу локалниот код и GitHub</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Гранка:</span>
                    <select
                      value={pushBranch}
                      onChange={e => setPushBranch(e.target.value)}
                      className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs text-slate-200 font-mono focus:border-red-500 focus:outline-none"
                    >
                      {branches.branches.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  
                  {/* FETCH Handle */}
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">1. Fetch Origin</span>
                        <Download className="h-4 w-4 text-blue-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        Ги презема сите нови гранки и commits од GitHub репозиториумот без да ги менува вашите локални датотеки.
                      </p>
                    </div>
                    <button
                      onClick={handleFetch}
                      disabled={actionLoading !== null}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 py-2 text-xs font-semibold transition disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{actionLoading === 'fetch' ? 'Се презема...' : 'Изврши Fetch'}</span>
                    </button>
                  </div>

                  {/* PULL Handle */}
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">2. Pull Latest</span>
                        <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        Повлекува и директно ги спојува (merge) најновите промени од GitHub во тековната гранка.
                      </p>
                    </div>
                    <button
                      onClick={handlePull}
                      disabled={actionLoading !== null}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 py-2 text-xs font-semibold transition disabled:opacity-50"
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      <span>{actionLoading === 'pull' ? 'Се повлекува...' : 'Изврши Pull'}</span>
                    </button>
                  </div>

                  {/* PUSH Handle */}
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">3. Push to GitHub</span>
                        <Upload className="h-4 w-4 text-red-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        Ги испраќа сите локални commits кон оддалечениот GitHub репозиториум (<span className="text-red-300 font-mono">{pushBranch}</span>).
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={handlePush}
                        disabled={actionLoading !== null}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 py-2 text-xs font-semibold transition disabled:opacity-50"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>{actionLoading === 'push' ? 'Се испраќа...' : `Push кон ${pushBranch}`}</span>
                      </button>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={forcePush}
                          onChange={e => setForcePush(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-red-500"
                        />
                        <span>Force push (--force)</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* GitHub Credentials & Personal Access Token Card */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">GitHub Автентикација (Personal Access Token)</h4>
                      <p className="text-xs text-slate-400">
                        За извршување Push кон приватно/заштитено GitHub репозиториум, внесете GitHub Token.
                      </p>
                    </div>
                  </div>
                  {status?.hasServerToken ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400 border border-blue-500/20">
                      <Check className="h-3 w-3" /> GITHUB_TOKEN на сервер
                    </span>
                  ) : githubToken ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 border border-emerald-500/20">
                      <Check className="h-3 w-3" /> Токен зачуван во прелистувач
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400/80 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Потребен за Push
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="password"
                      value={githubToken}
                      onChange={e => handleTokenChange(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx или fine-grained токен..."
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-red-500 focus:outline-none"
                    />
                    {githubToken && (
                      <button
                        onClick={() => handleTokenChange('')}
                        title="Избриши токен"
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberToken}
                        onChange={e => setRememberToken(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-red-500"
                      />
                      <span>Зачувај локално во прелистувачот (localStorage)</span>
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo"
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-400 hover:underline inline-flex items-center gap-1"
                    >
                      Креирај нов токен на GitHub (scopes: repo)
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Last Commit Card */}
              {status?.lastCommit && (
                <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-4 w-4 text-red-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Последен Commit во репозиториумот</span>
                    </div>
                    <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {status.lastCommit.hash}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-3.5 border border-slate-800">
                    <p className="text-sm font-medium text-slate-100">{status.lastCommit.message}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Автор: <strong className="text-slate-300">{status.lastCommit.author}</strong></span>
                      <span>{status.lastCommit.date}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Card: Quick Health & File Summary */}
            <div className="space-y-6">
              
              {/* Working Tree Card */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-red-400" />
                  <span>Статус на проектни датотеки</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Staged за commit</span>
                    <span className="text-xl font-bold text-emerald-400">{stagedFiles.length}</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Изменети / Unstaged</span>
                    <span className="text-xl font-bold text-amber-400">{unstagedFiles.length}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('changes')}
                    className="flex w-full items-center justify-between rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-medium text-slate-200 transition"
                  >
                    <span>Отвори ги измените и staging</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dev Environment Info */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Развојно окружување</span>
                </h4>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Node Порт:</span>
                    <span className="text-emerald-400 font-semibold">3000 (Express & Vite)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Git верзија:</span>
                    <span className="text-slate-200">2.34.1 (Linux)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Корисник:</span>
                    <span className="text-slate-200">angjeleskijane</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-200">angjeleskijane@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Quick CLI Shortcuts */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>Брзи команди</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRunCommand('git status -s')}
                    className="rounded bg-slate-900 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-500"
                  >
                    git status
                  </button>
                  <button
                    onClick={() => handleRunCommand('git remote -v')}
                    className="rounded bg-slate-900 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-500"
                  >
                    git remote -v
                  </button>
                  <button
                    onClick={() => handleRunCommand('git log -5 --oneline')}
                    className="rounded bg-slate-900 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-500"
                  >
                    git log -5
                  </button>
                  <button
                    onClick={() => handleRunCommand('git branch -a')}
                    className="rounded bg-slate-900 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-500"
                  >
                    git branch -a
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CHANGES & COMMIT STUDIO */}
        {activeTab === 'changes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left list: Modified files (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-red-400" />
                  <span>Променети датотеки ({status?.files.length || 0})</span>
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStage('all')}
                    disabled={actionLoading !== null || unstagedFiles.length === 0}
                    className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/30 transition disabled:opacity-40"
                  >
                    Stage All (+)
                  </button>
                  <button
                    onClick={() => handleUnstage('all')}
                    disabled={actionLoading !== null || stagedFiles.length === 0}
                    className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-amber-300 border border-amber-500/30 transition disabled:opacity-40"
                  >
                    Unstage All (-)
                  </button>
                </div>
              </div>

              {status?.files.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">Нема промени во работниот директориум!</p>
                  <p className="text-xs text-slate-400 mt-1">Сите датотеки се синхронизирани со тековниот commit.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  
                  {/* Staged Section */}
                  {stagedFiles.length > 0 && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3 space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block px-1">
                        Staged за commit ({stagedFiles.length})
                      </span>
                      {stagedFiles.map(file => (
                        <div
                          key={file.path}
                          className="flex items-center justify-between rounded-lg bg-slate-900/90 px-3 py-2 text-xs border border-slate-800 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {file.code}
                            </span>
                            <span className="font-mono text-slate-200 truncate" title={file.path}>
                              {file.path}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleViewDiff(file.path, true)}
                              title="Прегледај diff"
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleUnstage([file.path])}
                              title="Отстрани од staging"
                              className="p-1 text-amber-400 hover:text-amber-300"
                            >
                              <FileMinus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Unstaged Section */}
                  {unstagedFiles.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-3 space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block px-1">
                        Не-staged измени ({unstagedFiles.length})
                      </span>
                      {unstagedFiles.map(file => (
                        <div
                          key={file.path}
                          className="flex items-center justify-between rounded-lg bg-slate-900/90 px-3 py-2 text-xs border border-slate-800 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              file.isUntracked ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {file.code}
                            </span>
                            <span className="font-mono text-slate-200 truncate" title={file.path}>
                              {file.path}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleViewDiff(file.path, false)}
                              title="Прегледај diff"
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleStage([file.path])}
                              title="Додај во staging"
                              className="p-1 text-emerald-400 hover:text-emerald-300"
                            >
                              <FilePlus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* Commit Box */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <GitCommit className="h-4 w-4 text-red-400" />
                    <span>Креирај Commit</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Гранка: <strong className="text-white font-mono">{status?.branch || 'main'}</strong></span>
                </div>

                {/* Preset chips */}
                <div className="flex flex-wrap gap-1.5">
                  {['feat:', 'fix:', 'style:', 'chore:', 'perf:', 'docs:'].map(prefix => (
                    <button
                      key={prefix}
                      onClick={() => setCommitMessage(prev => prev.startsWith(prefix) ? prev : `${prefix} ${prev.replace(/^[a-z]+:\s*/, '')}`)}
                      className="rounded bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white hover:border-slate-500"
                    >
                      {prefix}
                    </button>
                  ))}
                </div>

                <textarea
                  value={commitMessage}
                  onChange={e => setCommitMessage(e.target.value)}
                  placeholder="Внесете опис на commit-от (пр. feat: додадени git handles за push и fetch)..."
                  rows={3}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushAfterCommit}
                      onChange={e => setPushAfterCommit(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-red-500"
                    />
                    <span>Веднаш изврши Push кон GitHub</span>
                  </label>
                  <button
                    onClick={() => handleStage('all')}
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    Stage сите промени пред commit
                  </button>
                </div>

                <button
                  onClick={handleCommit}
                  disabled={actionLoading !== null || (!commitMessage.trim())}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 text-xs shadow-lg shadow-red-600/30 transition disabled:opacity-50"
                >
                  <GitCommit className="h-4 w-4" />
                  <span>
                    {actionLoading === 'commit'
                      ? 'Се зачувува...'
                      : pushAfterCommit
                      ? 'Commit & Push кон GitHub'
                      : 'Commit во локално репозиториум'}
                  </span>
                </button>
              </div>

            </div>

            {/* Right preview: Diff Viewer (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0e1422] p-4 flex flex-col h-[600px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileDiff className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-semibold text-white font-mono">
                    {selectedFileForDiff ? `Diff: ${selectedFileForDiff}` : 'Изберете датотека за преглед на измени (Diff)'}
                  </span>
                </div>
                {selectedFileForDiff && (
                  <button
                    onClick={() => setSelectedFileForDiff(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Затвори
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-auto mt-3 rounded-lg bg-[#080c14] p-3 font-mono text-[11px] leading-relaxed">
                {diffLoading ? (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    <span>Се генерира git diff...</span>
                  </div>
                ) : !selectedFileForDiff ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 p-6">
                    <Eye className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs">Кликнете на иконата за око (Eye) до било која изменета датотека за да ги видите точните линии што се додадени или избришани.</p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">
                    {diffContent.split('\n').map((line, idx) => {
                      let color = 'text-slate-300';
                      let bg = '';
                      if (line.startsWith('+') && !line.startsWith('+++')) {
                        color = 'text-emerald-400';
                        bg = 'bg-emerald-950/30';
                      } else if (line.startsWith('-') && !line.startsWith('---')) {
                        color = 'text-red-400';
                        bg = 'bg-red-950/30';
                      } else if (line.startsWith('@@')) {
                        color = 'text-cyan-400';
                      }
                      return (
                        <div key={idx} className={`${color} ${bg} px-1 rounded`}>
                          {line}
                        </div>
                      );
                    })}
                  </pre>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: BRANCHES */}
        {activeTab === 'branches' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Управување со Гранки (Branches)</h3>
                <p className="text-xs text-slate-400">Прегледајте ги локалните и оддалечените гранки или креирајте нова развојна гранка.</p>
              </div>
              <button
                onClick={() => setIsCreatingBranch(!isCreatingBranch)}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Нова гранка</span>
              </button>
            </div>

            {isCreatingBranch && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-4 space-y-3">
                <h4 className="text-xs font-semibold text-red-300 uppercase tracking-wider">Креирај и префрли се на нова гранка</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={e => setNewBranchName(e.target.value)}
                    placeholder="пр. feature/nov-cenovnik или dev-kichevo..."
                    className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 focus:border-red-500 focus:outline-none"
                  />
                  <button
                    onClick={handleCreateBranch}
                    disabled={actionLoading !== null || !newBranchName.trim()}
                    className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
                  >
                    Креирај гранка
                  </button>
                  <button
                    onClick={() => setIsCreatingBranch(false)}
                    className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Откажи
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-[#0e1422] divide-y divide-slate-800 overflow-hidden">
              {branches.branches.map(b => {
                const isCurrent = b === status?.branch;
                const isRemote = b.startsWith('remotes/');
                return (
                  <div key={b} className="flex items-center justify-between p-4 hover:bg-slate-900/50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCurrent ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                        <GitBranch className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-200">{b}</span>
                          {isCurrent && (
                            <span className="rounded-full bg-red-600/20 border border-red-500/30 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                              Тековна (Active)
                            </span>
                          )}
                          {isRemote && (
                            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300">
                              Remote (GitHub)
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {isCurrent ? 'Работите директно на оваа гранка' : 'Кликнете за префрлање со git checkout'}
                        </span>
                      </div>
                    </div>

                    {!isCurrent && !isRemote && (
                      <button
                        onClick={() => handleSwitchBranch(b)}
                        disabled={actionLoading !== null}
                        className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition"
                      >
                        {actionLoading === `checkout-${b}` ? 'Се префрла...' : 'Префрли се (Checkout)'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: COMMIT HISTORY */}
        {activeTab === 'history' && (
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">Историја на Commits (git log)</h3>
                <p className="text-xs text-slate-400">Хронолошки преглед на сите промени направени во репозиториумот.</p>
              </div>
              <div className="relative w-64">
                <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  placeholder="Барај commits..."
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0e1422] divide-y divide-slate-800 overflow-hidden">
              {commits
                .filter(c => !historySearch || c.message.toLowerCase().includes(historySearch.toLowerCase()) || c.hash.includes(historySearch))
                .map((c, index) => (
                  <div key={c.hash + index} className="p-4 hover:bg-slate-900/40 transition flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-400 mt-0.5">
                        <GitCommit className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-100">{c.message}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Автор: <strong className="text-slate-300">{c.author}</strong></span>
                          <span>•</span>
                          <span>{c.dateRel}</span>
                          {c.dateFull && <span className="text-slate-500">({c.dateFull})</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(c.hash, c.hash)}
                        className="flex items-center gap-1 rounded bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white"
                      >
                        {copiedText === c.hash ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{c.hash}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: GIT TERMINAL CONSOLE */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>Интерактивна Git Конзола</span>
                </h3>
                <p className="text-xs text-slate-400">Преглед на сите извршени git активности и слободно извршување на безбедни git команди.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleLogs([])}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Исчисти дневник
                </button>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="rounded-xl border border-slate-800 bg-[#080c14] overflow-hidden flex flex-col h-[500px]">
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-slate-400 ml-2">bash ~ /app/applet (git)</span>
                </div>
              </div>

              {/* Logs */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 leading-relaxed">
                {consoleLogs.length === 0 ? (
                  <p className="text-slate-500">Подготвен. Извршете Fetch, Pull, Push или внесете команда подолу.</p>
                ) : (
                  consoleLogs.map(l => (
                    <div key={l.id} className="flex items-start gap-2">
                      <span className="text-slate-500 select-none text-[10px] mt-0.5">[{l.time}]</span>
                      <span className={`whitespace-pre-wrap ${
                        l.type === 'cmd' ? 'text-cyan-400 font-bold' :
                        l.type === 'success' ? 'text-emerald-400' :
                        l.type === 'error' ? 'text-red-400' : 'text-slate-300'
                      }`}>
                        {l.text}
                      </span>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>

              {/* Command Input Bar */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleRunCommand();
                }}
                className="flex items-center border-t border-slate-800 bg-slate-950 p-2 gap-2"
              >
                <span className="text-emerald-400 font-mono text-xs pl-2 font-bold">$</span>
                <input
                  type="text"
                  value={customCmd}
                  onChange={e => setCustomCmd(e.target.value)}
                  placeholder="пр. git status -s, git log -3, git remote -v..."
                  className="flex-1 bg-transparent border-none text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-mono text-slate-200 transition"
                >
                  Изврши
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

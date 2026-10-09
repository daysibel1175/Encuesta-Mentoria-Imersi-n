import { useEffect, useState, useCallback } from 'react';
import { PollState } from './types/poll';
import { Header } from './components/Header';
import { VotingCard } from './components/VotingCard';
import { ResultsChart } from './components/ResultsChart';
import { VotesLedger } from './components/VotesLedger';
import { TeacherControlBar } from './components/TeacherControlBar';
import { ShareModal } from './components/ShareModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ProjectorView } from './components/ProjectorView';
import { BarChart3, Vote as VoteIcon, Users } from 'lucide-react';

const DEFAULT_POLL: PollState = {
  question: '¿En qué clase te trabaste más?',
  options: [
    {
      id: 'aula-1',
      title: 'Clase 1 (Google Opal)',
      subtitle: 'Interacciones iniciales y flujos con Google Opal',
      color: '#2563EB',
      accentClass: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'aula-2',
      title: 'Clase 2 (ChatGPT Work)',
      subtitle: 'Estructuración de prompts y flujos de trabajo en ChatGPT',
      color: '#059669',
      accentClass: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'aula-3',
      title: 'Clase 3 (Make.com)',
      subtitle: 'Conexión de módulos, lógica de datos y automatización',
      color: '#7C3AED',
      accentClass: 'from-purple-500 to-violet-600',
    },
    {
      id: 'aula-all-ok',
      title: 'Concluí las 3 sin problemas',
      subtitle: 'Completé todas las lecciones y prácticas sin trabas',
      color: '#D97706',
      accentClass: 'from-amber-500 to-orange-600',
    },
  ],
  totalVotes: 0,
  breakdown: {
    'aula-1': {
      count: 0,
      percentage: 0,
      option: {
        id: 'aula-1',
        title: 'Clase 1 (Google Opal)',
        subtitle: 'Interacciones iniciales y flujos con Google Opal',
        color: '#2563EB',
        accentClass: 'from-blue-500 to-indigo-600',
      },
    },
    'aula-2': {
      count: 0,
      percentage: 0,
      option: {
        id: 'aula-2',
        title: 'Clase 2 (ChatGPT Work)',
        subtitle: 'Estructuración de prompts y flujos de trabajo en ChatGPT',
        color: '#059669',
        accentClass: 'from-emerald-500 to-teal-600',
      },
    },
    'aula-3': {
      count: 0,
      percentage: 0,
      option: {
        id: 'aula-3',
        title: 'Clase 3 (Make.com)',
        subtitle: 'Conexión de módulos, lógica de datos y automatización',
        color: '#7C3AED',
        accentClass: 'from-purple-500 to-violet-600',
      },
    },
    'aula-all-ok': {
      count: 0,
      percentage: 0,
      option: {
        id: 'aula-all-ok',
        title: 'Concluí las 3 sin problemas',
        subtitle: 'Completé todas las lecciones y prácticas sin trabas',
        color: '#D97706',
        accentClass: 'from-amber-500 to-orange-600',
      },
    },
  },
  topFriction: null,
  votes: [],
  lastResetAt: Date.now(),
};

export default function App() {
  const [poll, setPoll] = useState<PollState>(DEFAULT_POLL);
  const [currentTab, setCurrentTab] = useState<'vote' | 'results' | 'ledger'>('vote');
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Modals & Projector states
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);
  const [isProjectorOpen, setIsProjectorOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch current poll status
  const fetchPoll = useCallback(async (quiet = false) => {
    if (!quiet) setIsRefreshing(true);
    try {
      const res = await fetch('/api/poll');
      if (res.ok) {
        const data: PollState = await res.json();
        setPoll(data);

        // Check if server was reset after user voted
        const storedReset = localStorage.getItem('poll_last_reset');
        if (storedReset && Number(storedReset) < data.lastResetAt) {
          // Poll was cleared by teacher, reset user local vote state
          localStorage.removeItem('poll_user_voted_id');
          localStorage.setItem('poll_last_reset', String(data.lastResetAt));
          setHasVoted(false);
          setSelectedOptionId(null);
        }
      }
    } catch (err) {
      console.warn('Could not fetch poll from server:', err);
    } finally {
      if (!quiet) setIsRefreshing(false);
    }
  }, []);

  // Initial load & Polling interval
  useEffect(() => {
    fetchPoll(false);

    // Read local vote cache
    const savedOptionId = localStorage.getItem('poll_user_voted_id');
    if (savedOptionId) {
      setHasVoted(true);
      setSelectedOptionId(savedOptionId);
    }

    // Auto-poll every 2.5 seconds for live multi-student sync
    const interval = setInterval(() => {
      fetchPoll(true);
    }, 2500);

    return () => clearInterval(interval);
  }, [fetchPoll]);

  // Handle vote submission
  const handleVote = async (optionId: string, studentName: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, studentName }),
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.poll) {
          setPoll(responseData.poll);
        }
        setHasVoted(true);
        setSelectedOptionId(optionId);
        localStorage.setItem('poll_user_voted_id', optionId);
        localStorage.setItem('poll_last_reset', String(responseData.poll?.lastResetAt || Date.now()));
        showToast('¡Tu voto ha sido registrado con éxito!');
        return true;
      }
    } catch (err) {
      console.error('Error recording vote:', err);
      // Fallback local voting
      const opt = poll.options.find((o) => o.id === optionId);
      if (opt) {
        const newTotal = poll.totalVotes + 1;
        const currentCount = poll.breakdown[optionId]?.count || 0;
        const newBreakdown = { ...poll.breakdown };
        newBreakdown[optionId] = {
          ...newBreakdown[optionId],
          count: currentCount + 1,
          percentage: Math.round(((currentCount + 1) / newTotal) * 100),
          option: opt,
        };
        setPoll((prev) => ({
          ...prev,
          totalVotes: newTotal,
          breakdown: newBreakdown,
        }));
        setHasVoted(true);
        setSelectedOptionId(optionId);
        showToast('¡Tu voto ha sido registrado!');
        return true;
      }
    }
    return false;
  };

  // Reset poll (teacher action)
  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/poll/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setPoll(data.poll);
        // Clear local vote as well
        localStorage.removeItem('poll_user_voted_id');
        localStorage.setItem('poll_last_reset', String(data.poll.lastResetAt));
        setHasVoted(false);
        setSelectedOptionId(null);
        setIsResetOpen(false);
        showToast('✅ Encuesta limpia. Lista para comenzar en vivo.');
      }
    } catch (err) {
      console.error('Error resetting poll:', err);
    } finally {
      setIsResetting(false);
    }
  };

  // Seed sample mock data (for testing)
  const handleSeedMock = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/poll/seed-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setPoll(data.poll);
        showToast('✨ 12 votos de prueba cargados. Revisa los gráficos.');
        setCurrentTab('results');
      }
    } catch (err) {
      console.error('Error seeding mock data:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('🔗 Enlace copiado al portapapeles');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleResetUserVote = () => {
    setHasVoted(false);
    localStorage.removeItem('poll_user_voted_id');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenProjector={() => setIsProjectorOpen(true)}
        totalVotes={poll.totalVotes}
      />

      {/* Hero context bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Encuesta de Aula:</span>
            <span>¿En qué clase te trabaste más?</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-mono">
              {poll.totalVotes} {poll.totalVotes === 1 ? 'voto registrado' : 'votos registrados'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('vote')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentTab === 'vote' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <VoteIcon className="w-3.5 h-3.5" />
              <span>Pestaña Votar</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setCurrentTab('results')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentTab === 'results' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ver Resultados</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setCurrentTab('ledger')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentTab === 'ledger' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Registro Detallado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Active Tab View */}
        {currentTab === 'vote' && (
          <VotingCard
            options={poll.options}
            onVote={handleVote}
            onShowResults={() => setCurrentTab('results')}
            hasVoted={hasVoted}
            selectedOptionId={selectedOptionId}
            onResetUserVote={handleResetUserVote}
          />
        )}

        {currentTab === 'results' && (
          <ResultsChart
            poll={poll}
            onRefresh={() => fetchPoll(false)}
            isRefreshing={isRefreshing}
            onGoToVote={() => setCurrentTab('vote')}
          />
        )}

        {currentTab === 'ledger' && (
          <VotesLedger
            votes={poll.votes}
            options={poll.options}
            onGoToVote={() => setCurrentTab('vote')}
          />
        )}

        {/* Teacher Control Panel (Clean and always accessible at the bottom) */}
        <section className="pt-4">
          <TeacherControlBar
            totalVotes={poll.totalVotes}
            onOpenResetModal={() => setIsResetOpen(true)}
            onSeedMockData={handleSeedMock}
            onOpenShareModal={() => setIsShareOpen(true)}
            isSeeding={isSeeding}
            copiedLink={copiedLink}
            onCopyLink={handleCopyLink}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>Encuesta de Diagnóstico Pedagógico</span>
            <span className="mx-2">·</span>
            <span>Español Latino</span>
          </div>
          <div>
            <span>Google Opal · ChatGPT Work · Make.com</span>
          </div>
        </div>
      </footer>

      {/* Modals and Overlays */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        copiedLink={copiedLink}
        onCopyLink={handleCopyLink}
      />

      <ResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleConfirmReset}
        isResetting={isResetting}
        totalVotes={poll.totalVotes}
      />

      {isProjectorOpen && (
        <ProjectorView
          poll={poll}
          onClose={() => setIsProjectorOpen(false)}
          onRefresh={() => fetchPoll(false)}
          isRefreshing={isRefreshing}
        />
      )}
    </div>
  );
}

import React from 'react';
import { BarChart3, QrCode, MonitorPlay, Vote, Users } from 'lucide-react';

interface HeaderProps {
  currentTab: 'vote' | 'results' | 'ledger';
  onSelectTab: (tab: 'vote' | 'results' | 'ledger') => void;
  onOpenShare: () => void;
  onOpenProjector: () => void;
  totalVotes: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenShare,
  onOpenProjector,
  totalVotes,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            VF
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Votación de Clase
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Tab selector */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => onSelectTab('vote')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'vote'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Votar</span>
          </button>

          <button
            onClick={() => onSelectTab('results')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'results'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Resultados</span>
            {totalVotes > 0 && (
              <span className="ml-1 text-[11px] font-mono tabular-nums text-slate-500">
                ({totalVotes})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('ledger')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'ledger'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registro de Votos</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenShare}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Compartir enlace o código QR con alumnos"
          >
            <QrCode className="w-4 h-4 text-slate-600" />
            <span>Código QR</span>
          </button>

          <button
            onClick={onOpenProjector}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Modo Proyector</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex border-t border-slate-200 bg-slate-50 px-2 py-1.5 justify-around">
        <button
          onClick={() => onSelectTab('vote')}
          className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${
            currentTab === 'vote' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Vote className="w-3.5 h-3.5" />
          <span>Votar</span>
        </button>
        <button
          onClick={() => onSelectTab('results')}
          className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${
            currentTab === 'results' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Resultados ({totalVotes})</span>
        </button>
        <button
          onClick={() => onSelectTab('ledger')}
          className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${
            currentTab === 'ledger' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Votos</span>
        </button>
      </div>
    </header>
  );
};

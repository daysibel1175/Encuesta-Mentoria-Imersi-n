import React, { useState, useMemo } from 'react';
import { VoteRecord, PollOption } from '../types/poll';
import { Search, UserCheck, Clock, Filter } from 'lucide-react';

interface VotesLedgerProps {
  votes: VoteRecord[];
  options: PollOption[];
  onGoToVote: () => void;
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 15) return 'Hace unos segundos';
  if (diffSec < 60) return `Hace ${diffSec} segundos`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  return `Hace ${diffHours} h`;
}

export const VotesLedger: React.FC<VotesLedgerProps> = ({
  votes,
  options,
  onGoToVote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptionId, setFilterOptionId] = useState<string>('all');

  const filteredVotes = useMemo(() => {
    return votes.filter((v) => {
      const matchSearch =
        v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.optionTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter =
        filterOptionId === 'all' || v.optionId === filterOptionId;
      return matchSearch && matchFilter;
    });
  }, [votes, searchTerm, filterOptionId]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Registro de Todos los Votos
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Visualiza en detalle cada respuesta registrada por los alumnos en la sesión.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>
              Total: <strong className="font-mono">{votes.length}</strong> votos
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o clase..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Filter options tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterOptionId('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterOptionId === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilterOptionId(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filterOptionId === opt.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List / Table of votes */}
      {votes.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Filter className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Aún no se han registrado votos
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Cuando los alumnos respondan o cargues votos de prueba, aparecerán listados aquí en orden cronológico.
          </p>
          <button
            onClick={onGoToVote}
            className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            Emitir un voto ahora
          </button>
        </div>
      ) : filteredVotes.length === 0 ? (
        <div className="text-center py-12 px-4 text-xs text-slate-500">
          No se encontraron votos que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {filteredVotes.map((vote, index) => {
            const option = options.find((o) => o.id === vote.optionId);
            const timeDate = new Date(vote.timestamp);
            const formattedClock = timeDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={vote.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {vote.studentName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {vote.studentName}
                      </span>
                      <span className="text-slate-300 text-xs">·</span>
                      <span className="text-xs text-slate-400 font-mono">
                        #{votes.length - index}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: option?.color || '#94A3B8' }}
                      />
                      <span className="font-medium text-slate-800">
                        {vote.optionTitle}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500 flex items-center justify-end gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatRelativeTime(vote.timestamp)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {formattedClock}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

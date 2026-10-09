import React from 'react';
import { Trash2, FlaskConical, Share2, Copy, Check, ShieldCheck } from 'lucide-react';

interface TeacherControlBarProps {
  totalVotes: number;
  onOpenResetModal: () => void;
  onSeedMockData: () => void;
  onOpenShareModal: () => void;
  isSeeding: boolean;
  copiedLink: boolean;
  onCopyLink: () => void;
}

export const TeacherControlBar: React.FC<TeacherControlBarProps> = ({
  totalVotes,
  onOpenResetModal,
  onSeedMockData,
  onOpenShareModal,
  isSeeding,
  copiedLink,
  onCopyLink,
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-md p-4 sm:p-5 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side: Context badge & instructions */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                Panel del Docente
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-mono">
                {totalVotes} {totalVotes === 1 ? 'voto registrado' : 'votos registrados'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Puedes cargar votos de prueba para ensayar la dinámica y luego limpiarlos antes de iniciar tu clase en vivo.
            </p>
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seed demo data button */}
          <button
            onClick={onSeedMockData}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700 cursor-pointer disabled:opacity-50"
            title="Carga 12 votos de ejemplo para probar los gráficos"
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSeeding ? 'Cargando demo...' : 'Cargar prueba'}</span>
          </button>

          {/* Reset / Clear votes button */}
          <button
            onClick={onOpenResetModal}
            disabled={totalVotes === 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors border ${
              totalVotes > 0
                ? 'bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border-red-500/40 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
            }`}
            title="Borrar todos los votos para comenzar desde cero en la clase"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar votos</span>
          </button>

          {/* Copy direct link */}
          <button
            onClick={onCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700 cursor-pointer"
            title="Copiar enlace para los alumnos"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar enlace</span>
              </>
            )}
          </button>

          {/* Share / QR Modal */}
          <button
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Mostrar QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

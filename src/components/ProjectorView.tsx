import React, { useEffect, useState } from 'react';
import { PollState } from '../types/poll';
import QRCode from 'qrcode';
import { X, Users, RefreshCw } from 'lucide-react';

interface ProjectorViewProps {
  poll: PollState;
  onClose: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ProjectorView: React.FC<ProjectorViewProps> = ({
  poll,
  onClose,
  onRefresh,
  isRefreshing,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (currentUrl) {
      QRCode.toDataURL(currentUrl, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating projector QR:', err));
    }
  }, [currentUrl]);

  const { question, totalVotes, breakdown, options, topFriction } = poll;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
      {/* Top Bar in Projector Mode */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Votación en Vivo · Aula de Clases
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-semibold">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">Respuestas:</span>
            <span className="font-mono text-white text-base font-bold tabular-nums">
              {totalVotes}
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refrescar"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            <span>Salir de Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Question & Dynamic Chart */}
      <div className="my-auto py-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            {question}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Escanea el código QR en pantalla o abre el enlace en tu navegador para votar.
          </p>
        </div>

        {/* Big Bars */}
        <div className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {options.map((option) => {
            const data = breakdown[option.id] || { count: 0, percentage: 0 };
            const isTop = topFriction?.option.id === option.id && data.count > 0;

            return (
              <div key={option.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {option.title}
                    </span>
                    {isTop && (
                      <span className="text-xs font-semibold text-amber-300 bg-amber-950/80 border border-amber-700/50 px-2.5 py-0.5 rounded-md">
                        Mayor Dificultad
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm sm:text-base text-slate-400 font-mono tabular-nums">
                      {data.count} {data.count === 1 ? 'voto' : 'votos'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white min-w-[70px] text-right">
                      {data.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-6 sm:h-7 bg-slate-950/80 rounded-xl overflow-hidden p-1 border border-slate-800 relative">
                  <div
                    className="h-full rounded-lg transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.max(data.percentage, data.count > 0 ? 3 : 0)}%`,
                      backgroundColor: option.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Strip with Live QR Code on Bottom Right */}
      <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          Resultados actualizados automáticamente en vivo · Presiona Esc o Salir para volver al panel.
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR para votar"
              className="w-16 h-16 rounded-lg bg-white p-1"
            />
          )}
          <div className="text-left pr-2">
            <div className="text-xs font-bold text-white">¡Vota ahora!</div>
            <div className="text-[11px] text-slate-400">Apunta tu cámara al QR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

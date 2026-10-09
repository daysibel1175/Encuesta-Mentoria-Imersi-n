import React, { useState } from 'react';
import { PollState } from '../types/poll';
import {
  BarChart2,
  PieChart,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

interface ResultsChartProps {
  poll: PollState;
  onRefresh: () => void;
  isRefreshing: boolean;
  onGoToVote: () => void;
}

export const ResultsChart: React.FC<ResultsChartProps> = ({
  poll,
  onRefresh,
  isRefreshing,
  onGoToVote,
}) => {
  const [chartType, setChartType] = useState<'bars' | 'donut'>('bars');
  const { totalVotes, breakdown, topFriction, options } = poll;

  // Calculate donut slices for SVG
  const calculateDonutSegments = () => {
    if (totalVotes === 0) return [];
    let cumulative = 0;
    return options.map((opt) => {
      const data = breakdown[opt.id] || { count: 0, percentage: 0, option: opt };
      const startAngle = (cumulative / totalVotes) * 360;
      cumulative += data.count;
      const endAngle = (cumulative / totalVotes) * 360;
      return {
        id: opt.id,
        title: opt.title,
        color: opt.color,
        count: data.count,
        percentage: data.percentage,
        startAngle,
        endAngle,
      };
    });
  };

  const donutSegments = calculateDonutSegments();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Resultados en Tiempo Real
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Actualizado en vivo
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ¿En qué clase te trabaste más?
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart mode toggle */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center">
              <button
                onClick={() => setChartType('bars')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  chartType === 'bars'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Gráfico de barras"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('donut')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  chartType === 'donut'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Gráfico circular"
              >
                <PieChart className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Refrescar votos"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Highlight Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Total de Respuestas</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalVotes}
              <span className="text-xs font-sans text-slate-500 ml-1.5 font-normal">
                {totalVotes === 1 ? 'voto' : 'votos'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Mayor Dificultad</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-base font-bold text-slate-900 truncate">
              {topFriction ? (
                <span>
                  {topFriction.option.title.split('(')[0].trim()}
                  <span className="text-xs font-mono text-slate-500 ml-1">
                    ({topFriction.percentage}%)
                  </span>
                </span>
              ) : (
                <span className="text-slate-400 font-normal text-sm">Sin votos aún</span>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Completaron Sin Trabas</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {breakdown['aula-all-ok'] ? breakdown['aula-all-ok'].percentage : 0}%
              <span className="text-xs font-sans text-slate-500 ml-1.5 font-normal">
                ({breakdown['aula-all-ok'] ? breakdown['aula-all-ok'].count : 0} alumnos)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Visualization Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        {totalVotes === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Aún no hay votos registrados
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
              Comparte el enlace o código QR con tus alumnos para que comiencen a responder, o carga votos de prueba.
            </p>
            <button
              onClick={onGoToVote}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              Emitir el primer voto
            </button>
          </div>
        ) : chartType === 'bars' ? (
          /* Dynamic Bar Chart */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Opción de la clase</span>
              <span>Proporción y Total</span>
            </div>

            {options.map((option) => {
              const data = breakdown[option.id] || { count: 0, percentage: 0 };
              const isTop = topFriction?.option.id === option.id;

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="font-semibold text-slate-900">
                        {option.title}
                      </span>
                      {isTop && (
                        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                          Mayor fricción
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono tabular-nums">
                        {data.count} {data.count === 1 ? 'voto' : 'votos'}
                      </span>
                      <span className="text-sm font-bold font-mono tabular-nums text-slate-900 min-w-[42px] text-right">
                        {data.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar container */}
                  <div className="h-5 bg-slate-100 rounded-lg overflow-hidden p-0.5 relative">
                    <div
                      className="h-full rounded-md transition-all duration-700 ease-out"
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
        ) : (
          /* Dynamic Circular / Donut SVG Chart */
          <div className="py-4 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {donutSegments.map((seg) => {
                  if (seg.percentage === 0) return null;
                  const radius = 38;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((seg.startAngle / 360) * circumference);

                  return (
                    <circle
                      key={seg.id}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-700 ease-out"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                  {totalVotes}
                </span>
                <span className="text-xs text-slate-500 font-medium">Votos Totales</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 w-full max-w-xs">
              {options.map((opt) => {
                const data = breakdown[opt.id] || { count: 0, percentage: 0 };
                return (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-sm shrink-0"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        {opt.title}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono tabular-nums text-slate-900">
                        {data.percentage}%
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono ml-1.5">
                        ({data.count})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Didactic Teacher Insight */}
        {totalVotes > 0 && topFriction && (
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-600 bg-blue-50/50 p-4 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-900">
                Orientación para el docente:
              </span>{' '}
              El {topFriction.percentage}% de tus alumnos identificó mayor fricción en{' '}
              <strong>{topFriction.option.title}</strong>. Es el momento ideal para resolver dudas
              sobre esa clase antes de avanzar al siguiente tema.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PollOption } from '../types/poll';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Bot,
  Workflow,
  CheckCircle2,
  Send,
  User,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface VotingCardProps {
  options: PollOption[];
  onVote: (optionId: string, studentName: string) => Promise<boolean>;
  onShowResults: () => void;
  hasVoted: boolean;
  selectedOptionId: string | null;
  onResetUserVote: () => void;
}

const getOptionIcon = (id: string) => {
  switch (id) {
    case 'aula-1':
      return <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />;
    case 'aula-2':
      return <Bot className="w-5 h-5 text-emerald-600 shrink-0" />;
    case 'aula-3':
      return <Workflow className="w-5 h-5 text-purple-600 shrink-0" />;
    case 'aula-all-ok':
      return <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />;
    default:
      return <Sparkles className="w-5 h-5 text-slate-600 shrink-0" />;
  }
};

export const VotingCard: React.FC<VotingCardProps> = ({
  options,
  onVote,
  onShowResults,
  hasVoted,
  selectedOptionId,
  onResetUserVote,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(selectedOptionId);
  const [name, setName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || submitting) return;

    setSubmitting(true);
    const ok = await onVote(selectedId, name.trim());
    setSubmitting(false);

    if (ok) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const selectedOptionObj = options.find((o) => o.id === selectedOptionId);

  if (hasVoted && selectedOptionObj) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-2xl mx-auto text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          ¡Tu voto fue registrado!
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Gracias por responder. Tu opinión ayuda a enfocar el repaso de la clase en vivo.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 inline-flex items-center gap-3 text-left max-w-md w-full">
          <div className="p-2 bg-white rounded-md shadow-2xs">
            {getOptionIcon(selectedOptionObj.id)}
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Tu respuesta:</div>
            <div className="text-base font-semibold text-slate-900">
              {selectedOptionObj.title}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onShowResults}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <span>Ver resultados de la encuesta</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onResetUserVote}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Votar de nuevo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-2xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          ¿En qué clase te trabaste más?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
          Selecciona la clase donde tuviste mayor dificultad para enfocar nuestra explicación de hoy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Tu nombre o apodo (opcional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Sofía, Mateo o dejar vacío para anónimo"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all"
            maxLength={40}
          />
        </div>

        {/* Options Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Elige una opción:
          </label>

          {options.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedId(option.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div
                  className={`mt-0.5 p-2 rounded-lg ${
                    isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'
                  }`}
                >
                  {getOptionIcon(option.id)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-base font-semibold ${
                        isSelected ? 'text-blue-950' : 'text-slate-900'
                      }`}
                    >
                      {option.title}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {option.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={!selectedId || submitting}
            className={`w-full sm:flex-1 py-3 px-6 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
              selectedId && !submitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Enviando voto...' : 'Registrar mi voto'}</span>
          </button>

          <button
            type="button"
            onClick={onShowResults}
            className="w-full sm:w-auto py-3 px-4 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            Ver resultados actuales
          </button>
        </div>
      </form>
    </div>
  );
};

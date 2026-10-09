import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode as QrIcon, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  copiedLink: boolean;
  onCopyLink: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  copiedLink,
  onCopyLink,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (isOpen && currentUrl) {
      QRCode.toDataURL(currentUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR Code:', err));
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <QrIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Compartir con los Alumnos
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            Muestra este código QR en la pantalla de tu proyector o comparte el enlace en el chat de Meet/Zoom para que tus alumnos voten desde sus teléfonos móviles.
          </p>

          {/* QR Code Canvas/Image */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center mb-5">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR de la encuesta"
                className="w-52 h-52 rounded-lg shadow-2xs bg-white p-2"
              />
            ) : (
              <div className="w-52 h-52 bg-slate-200 rounded-lg animate-pulse flex items-center justify-center text-xs text-slate-400">
                Generando código QR...
              </div>
            )}
            <span className="text-[11px] text-slate-500 font-medium mt-3">
              Escanea con la cámara del celular
            </span>
          </div>

          {/* Link box */}
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs text-slate-700 flex-1 px-2 font-mono outline-hidden select-all"
            />
            <button
              onClick={onCopyLink}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Los votos se actualizan automáticamente en pantalla.</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

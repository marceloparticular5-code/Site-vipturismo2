import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  Sparkles,
  Trash2,
  Eye,
  Star,
} from 'lucide-react';
import {
  compressAndResizeImage,
  uploadImagesToServer,
  validateImageFile,
  ProcessedImage,
} from '../lib/imageUploadUtils';

interface PhotoUploaderProps {
  currentImageUrl?: string;
  galleryImages?: string[];
  onMainImageChange: (url: string) => void;
  onGalleryChange?: (urls: string[]) => void;
  label?: string;
  allowMultiple?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentImageUrl,
  galleryImages = [],
  onMainImageChange,
  onGalleryChange,
  label = 'Fotos do Passeio VIP',
  allowMultiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gather current images (main + gallery)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (currentImageUrl && currentImageUrl.trim()) {
      list.push(currentImageUrl.trim());
    }
    galleryImages.forEach((img) => {
      if (img && img.trim() && !list.includes(img.trim())) {
        list.push(img.trim());
      }
    });
    return list;
  }, [currentImageUrl, galleryImages]);

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setErrorMessage(null);
      setSuccessNotice(null);
      const files = Array.from(fileList);

      if (files.length === 0) return;

      // Validate each file first
      for (const file of files) {
        const val = validateImageFile(file);
        if (!val.valid) {
          setErrorMessage(val.error || 'Arquivo selecionado inválido.');
          return;
        }
      }

      setIsProcessing(true);
      setUploadProgress(10);
      setUploadStage('Validando e preparando imagens...');

      try {
        const processedList: ProcessedImage[] = [];
        const totalFiles = files.length;

        for (let i = 0; i < totalFiles; i++) {
          const file = files[i];
          setUploadStage(`Otimizando foto ${i + 1} de ${totalFiles} (máx 1200px)...`);
          setUploadProgress(10 + Math.round(((i + 1) / totalFiles) * 40));
          const processed = await compressAndResizeImage(file, 1200, 0.85);
          processedList.push(processed);
        }

        // Upload to server with real-time XHR progress tracking
        setUploadStage('Gravando no servidor e gerando URLs internas...');
        const uploadedUrls = await uploadImagesToServer(
          processedList.map((p) => ({ filename: p.name, dataUrl: p.dataUrl })),
          (percent) => {
            setUploadProgress(50 + Math.round((percent / 100) * 50));
          }
        );

        setUploadProgress(100);
        setUploadStage('Concluído com sucesso!');

        if (uploadedUrls.length > 0) {
          const newMain = uploadedUrls[0];
          const remainingNew = uploadedUrls.slice(1);

          if (!currentImageUrl || currentImageUrl.trim() === '') {
            onMainImageChange(newMain);
            if (onGalleryChange && remainingNew.length > 0) {
              onGalleryChange([...galleryImages, ...remainingNew]);
            }
          } else {
            // Already has main image; if multiple, add to gallery or replace
            if (allowMultiple && onGalleryChange) {
              onGalleryChange([...galleryImages, ...uploadedUrls]);
            } else {
              onMainImageChange(newMain);
            }
          }

          setSuccessNotice(
            `${uploadedUrls.length} foto(s) carregada(s), comprimida(s) a 1200px e salvas com sucesso!`
          );
          setTimeout(() => setSuccessNotice(null), 4000);
        }
      } catch (err: any) {
        console.error('[Upload Error]:', err);
        setErrorMessage(err?.message || 'Falha ao processar e salvar a imagem.');
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [currentImageUrl, galleryImages, allowMultiple, onMainImageChange, onGalleryChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    if (urlToRemove === currentImageUrl) {
      // If we remove the main image, make the first gallery image the main, or empty
      if (galleryImages.length > 0) {
        const nextMain = galleryImages[0];
        const nextGallery = galleryImages.slice(1);
        onMainImageChange(nextMain);
        if (onGalleryChange) onGalleryChange(nextGallery);
      } else {
        onMainImageChange('');
      }
    } else {
      if (onGalleryChange) {
        onGalleryChange(galleryImages.filter((u) => u !== urlToRemove));
      }
    }
  };

  const handleSetAsMain = (url: string) => {
    if (url === currentImageUrl) return;
    const oldMain = currentImageUrl;
    onMainImageChange(url);
    if (onGalleryChange) {
      const filtered = galleryImages.filter((u) => u !== url);
      if (oldMain && oldMain.trim()) {
        filtered.unshift(oldMain);
      }
      onGalleryChange(filtered);
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (!currentImageUrl) {
      onMainImageChange(manualUrl.trim());
    } else if (onGalleryChange) {
      onGalleryChange([...galleryImages, manualUrl.trim()]);
    }
    setManualUrl('');
    setShowManualUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{label}</span>
          <span className="text-slate-400 font-normal lowercase">(JPG, JPEG, PNG · máx. 5MB)</span>
        </label>

        <button
          type="button"
          onClick={() => setShowManualUrlInput(!showManualUrlInput)}
          className="text-[10px] text-slate-400 hover:text-amber-300 underline transition-colors cursor-pointer"
        >
          {showManualUrlInput ? 'Ocultar inserção por URL' : 'Colar link externo (opcional)'}
        </button>
      </div>

      {/* Manual URL input fallback for full backwards compatibility */}
      {showManualUrlInput && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 flex gap-2 animate-fadeIn">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
          >
            Adicionar URL
          </button>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Success Notice */}
      {successNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Real-time Upload & Optimization Progress Bar */}
      {isProcessing && (
        <div className="p-3.5 rounded-2xl bg-[#09172B] border border-amber-500/40 shadow-xl space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>{uploadStage || 'Processando arquivos...'}</span>
            </span>
            <span className="font-mono font-extrabold text-white text-xs">{uploadProgress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-700 hover:border-amber-400/60 bg-[#07111F]/70 hover:bg-[#07111F]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple={allowMultiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-2.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${
              isDragging ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
            }`}
          >
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {isProcessing
                ? 'Comprimindo e enviando fotos...'
                : 'Arraste e solte fotos aqui ou clique para enviar arquivos'}
            </p>
            <p className="text-xs text-slate-400">
              Formatos aceitos: <strong className="text-amber-300">JPG, JPEG, PNG e WEBP</strong> até 5 MB.
              Redimensionamento automático para máx. 1200 px.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow hover:scale-105 transition-all mt-1">
            <FileImage className="w-4 h-4" />
            <span>Enviar arquivo(s) / Escolher fotos</span>
          </div>
        </div>
      </div>

      {/* Image Gallery & Previews */}
      {allImages.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Fotos anexadas ({allImages.length})</span>
            <span className="text-[11px] text-amber-300/80">
              ★ Primeira foto é a Principal do card
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allImages.map((imgUrl, index) => {
              const isMain = imgUrl === currentImageUrl;
              return (
                <div
                  key={`${imgUrl}-${index}`}
                  className={`group relative rounded-xl overflow-hidden border bg-slate-900 aspect-video sm:aspect-4/3 transition-all ${
                    isMain
                      ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-amber-400'
                      : 'border-slate-700/80 hover:border-slate-500'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback broken image indicator
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
                    {isMain && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] uppercase shadow">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Principal
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModalUrl(imgUrl);
                        }}
                        className="p-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                        title="Ver foto em tela cheia"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(imgUrl);
                        }}
                        className="p-1 rounded-md bg-rose-900/80 hover:bg-rose-700 text-rose-200 hover:text-white transition-colors cursor-pointer"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-1">
                      {!isMain && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsMain(imgUrl);
                          }}
                          className="w-full text-center py-1 rounded bg-amber-400/90 hover:bg-amber-300 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow"
                        >
                          Definir Principal
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewModalUrl && (
        <div
          role="dialog"
          aria-label="Prévia da foto ampliada"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">Prévia da Foto em Alta Definição</span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center max-h-[80vh]">
              <img
                src={previewModalUrl}
                alt="Foto em alta resolução"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

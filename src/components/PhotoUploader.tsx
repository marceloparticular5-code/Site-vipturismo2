import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Film,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  Sparkles,
  Trash2,
  Eye,
  Star,
  Play,
  FolderOpen,
  ArrowLeft,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  compressAndResizeImage,
  processVideoFile,
  uploadMediaToServer,
  validateImageFile,
  validateVideoFile,
  ProcessedImage,
} from '../lib/imageUploadUtils';
import { MediaLibraryModal } from './MediaLibraryModal';

interface PhotoUploaderProps {
  currentImageUrl?: string;
  galleryImages?: string[];
  videoUrl?: string;
  onMainImageChange: (url: string) => void;
  onGalleryChange?: (urls: string[]) => void;
  onVideoChange?: (url: string) => void;
  label?: string;
  allowMultiple?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentImageUrl,
  galleryImages = [],
  videoUrl,
  onMainImageChange,
  onGalleryChange,
  onVideoChange,
  label = 'Fotos e Vídeos do Passeio VIP',
  allowMultiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  // Handle Image Uploads
  const handleImageFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setErrorMessage(null);
      setSuccessNotice(null);
      const files = Array.from(fileList);
      if (files.length === 0) return;

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
          setUploadStage(`Otimizando foto ${i + 1} de ${totalFiles} (máx 1200px / WEBP)...`);
          setUploadProgress(10 + Math.round(((i + 1) / totalFiles) * 40));
          const processed = await compressAndResizeImage(file, 1200, 0.85);
          processedList.push(processed);
        }

        setUploadStage('Gravando no servidor e gerando URLs internas...');
        const uploadedMedia = await uploadMediaToServer(
          processedList.map((p) => ({
            filename: p.name,
            dataUrl: p.dataUrl,
            type: 'image',
            category: 'tours',
          })),
          (percent) => {
            setUploadProgress(50 + Math.round((percent / 100) * 50));
          }
        );

        const uploadedUrls = uploadedMedia.map((m) => m.url);

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
            if (allowMultiple && onGalleryChange) {
              onGalleryChange([...galleryImages, ...uploadedUrls]);
            } else {
              onMainImageChange(newMain);
            }
          }

          setSuccessNotice(
            `${uploadedUrls.length} imagem(ns) otimizada(s) e adicionada(s) ao passeio!`
          );
          setTimeout(() => setSuccessNotice(null), 4000);
        }
      } catch (err: any) {
        console.error('[Upload Error]:', err);
        setErrorMessage(err?.message || 'Falha ao processar e salvar a imagem.');
      } finally {
        setIsProcessing(false);
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
    },
    [currentImageUrl, galleryImages, allowMultiple, onMainImageChange, onGalleryChange]
  );

  // Handle Video Upload
  const handleVideoFile = useCallback(
    async (fileList: FileList | File[]) => {
      setErrorMessage(null);
      setSuccessNotice(null);
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const file = files[0];
      const val = validateVideoFile(file);
      if (!val.valid) {
        setErrorMessage(val.error || 'Arquivo de vídeo inválido.');
        return;
      }

      setIsProcessing(true);
      setUploadProgress(10);
      setUploadStage('Gerando miniatura e processando vídeo...');

      try {
        const processed = await processVideoFile(file);
        setUploadProgress(40);
        setUploadStage('Enviando vídeo para o servidor (MP4/WEBM)...');

        const uploadedMedia = await uploadMediaToServer(
          [
            {
              filename: processed.name,
              dataUrl: processed.dataUrl,
              type: 'video',
              category: 'videos',
              thumbnailUrl: processed.thumbnailUrl,
            },
          ],
          (percent) => {
            setUploadProgress(40 + Math.round((percent / 100) * 60));
          }
        );

        if (uploadedMedia.length > 0 && uploadedMedia[0].url) {
          const videoUrlResult = uploadedMedia[0].url;
          onVideoChange?.(videoUrlResult);
          setSuccessNotice('Vídeo enviado com sucesso e vinculado ao passeio!');
          setTimeout(() => setSuccessNotice(null), 4000);
        }
      } catch (err: any) {
        console.error('[Video Upload Error]:', err);
        setErrorMessage(err?.message || 'Falha ao processar o vídeo.');
      } finally {
        setIsProcessing(false);
        if (videoInputRef.current) videoInputRef.current.value = '';
      }
    },
    [onVideoChange]
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
      const files = Array.from(e.dataTransfer.files);
      const hasVideos = files.some((f) => f.type.startsWith('video/'));
      if (hasVideos) {
        handleVideoFile(files);
      } else {
        handleImageFiles(files);
      }
    }
  };

  const handleSetAsMain = (url: string) => {
    if (url === currentImageUrl) return;
    const oldMain = currentImageUrl;
    onMainImageChange(url);

    if (onGalleryChange && oldMain && oldMain.trim() !== '') {
      const updatedGallery = galleryImages.filter((img) => img !== url);
      if (!updatedGallery.includes(oldMain)) {
        updatedGallery.unshift(oldMain);
      }
      onGalleryChange(updatedGallery);
    }
    setSuccessNotice('Imagem definida como Capa Principal!');
    setTimeout(() => setSuccessNotice(null), 2500);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    if (urlToRemove === currentImageUrl) {
      if (galleryImages.length > 0) {
        const [newMain, ...remaining] = galleryImages;
        onMainImageChange(newMain);
        onGalleryChange?.(remaining);
      } else {
        onMainImageChange('');
      }
    } else {
      onGalleryChange?.(galleryImages.filter((img) => img !== urlToRemove));
    }
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    if (!onGalleryChange) return;
    const newGallery = [...galleryImages];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newGallery.length) return;

    const temp = newGallery[index];
    newGallery[index] = newGallery[targetIdx];
    newGallery[targetIdx] = temp;
    onGalleryChange(newGallery);
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();

    if (!currentImageUrl || currentImageUrl.trim() === '') {
      onMainImageChange(url);
    } else if (allowMultiple && onGalleryChange) {
      onGalleryChange([...galleryImages, url]);
    } else {
      onMainImageChange(url);
    }
    setManualUrl('');
    setShowManualUrlInput(false);
  };

  return (
    <div className="space-y-4">
      {/* Header and Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>{label}</span>
          <span className="text-amber-300 font-mono text-[11px] ml-1">
            ({allImages.length} fotos {videoUrl ? '+ 1 vídeo' : ''})
          </span>
        </label>

        <div className="flex items-center gap-2">
          {/* Media Library Button */}
          <button
            type="button"
            onClick={() => setIsMediaLibraryOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Biblioteca de Mídia</span>
          </button>

          <button
            type="button"
            onClick={() => setShowManualUrlInput(!showManualUrlInput)}
            className="text-[11px] text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
          >
            {showManualUrlInput ? 'Ocultar URL' : 'Colar link URL'}
          </button>
        </div>
      </div>

      {/* Manual URL Input Bar */}
      {showManualUrlInput && (
        <div className="flex gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-700 animate-fadeIn">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Cole o link da imagem (https://...)..."
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

      {/* Real-time Upload Progress Bar */}
      {isProcessing && (
        <div className="p-3.5 rounded-2xl bg-[#09172B] border border-amber-500/40 shadow-xl space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>{uploadStage || 'Processando arquivo...'}</span>
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

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group border-2 border-dashed rounded-2xl p-5 sm:p-7 text-center transition-all duration-200 ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-700 hover:border-amber-400/60 bg-[#07111F]/70 hover:bg-[#07111F]'
        }`}
      >
        {/* Hidden Input for Images */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          multiple={allowMultiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleImageFiles(e.target.files);
            }
          }}
        />

        {/* Hidden Input for Videos */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleVideoFile(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-3">
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
              Arraste e solte fotos ou vídeos aqui
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Selecione diretamente da <strong>galeria do celular</strong>, <strong>arquivos</strong> ou <strong>câmera</strong>.
            </p>
          </div>

          {/* Action Upload Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>+ Adicionar Imagem</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 hover:text-white font-bold text-xs uppercase tracking-wider shadow hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
            >
              <Film className="w-4 h-4" />
              <span>+ Adicionar Vídeo</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Formatos aceitos: <strong className="text-amber-300">JPG, PNG, WEBP</strong> (até 10 MB) e <strong className="text-cyan-300">MP4, WEBM, MOV</strong> (até 50 MB)
          </p>
        </div>
      </div>

      {/* Video Preview Card if present */}
      {videoUrl && (
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Vídeo do Passeio Vinculado</span>
            </span>

            <button
              type="button"
              onClick={() => onVideoChange?.('')}
              className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remover vídeo</span>
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-black max-h-48 flex items-center justify-center">
            <video src={videoUrl} controls className="max-h-48 max-w-full rounded-lg" />
          </div>
        </div>
      )}

      {/* Images Grid with Management Actions */}
      {allImages.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs text-slate-400 font-semibold">
            Galeria do Passeio ({allImages.length} fotos) · A primeira foto com estrela dourada é a <strong>Capa Principal</strong>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allImages.map((imgUrl, index) => {
              const isMain = imgUrl === currentImageUrl;

              return (
                <div
                  key={`${imgUrl}-${index}`}
                  className={`group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border-2 transition-all duration-200 shadow-md ${
                    isMain
                      ? 'border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Main Cover Badge */}
                  {isMain && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>Capa Principal</span>
                    </div>
                  )}

                  {/* Quick Action Overlay on Hover / Mobile */}
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      {/* Set as main button */}
                      {!isMain ? (
                        <button
                          type="button"
                          onClick={() => handleSetAsMain(imgUrl)}
                          className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow"
                          title="Definir como foto de capa"
                        >
                          <Star className="w-3 h-3" />
                          <span>Definir Capa</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-300">Capa do Card</span>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imgUrl)}
                        className="p-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-colors"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Fullscreen Preview */}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewModalUrl(imgUrl);
                          setPreviewIsVideo(false);
                        }}
                        className="p-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white cursor-pointer"
                        title="Ver foto ampliada"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Order shift */}
                      {onGalleryChange && galleryImages.length > 1 && !isMain && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index - 1, 'left')}
                            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                            title="Mover para esquerda"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index - 1, 'right')}
                            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                            title="Mover para direita"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="Prévia ampliada"
              className="max-h-[80vh] w-auto mx-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Media Library Modal Picker */}
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        selectionMode={true}
        onSelectMedia={(url, type) => {
          if (type === 'video') {
            onVideoChange?.(url);
          } else {
            if (!currentImageUrl || currentImageUrl.trim() === '') {
              onMainImageChange(url);
            } else if (onGalleryChange) {
              onGalleryChange([...galleryImages, url]);
            }
          }
        }}
      />
    </div>
  );
};

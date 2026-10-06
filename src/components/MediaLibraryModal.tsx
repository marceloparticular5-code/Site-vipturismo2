import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  UploadCloud,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  Film,
  Camera,
  FolderOpen,
  Plus,
  Sparkles,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import {
  MediaItem,
  validateImageFile,
  validateVideoFile,
  compressAndResizeImage,
  processVideoFile,
  uploadMediaToServer,
} from '../lib/imageUploadUtils';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (mediaUrl: string, type: 'image' | 'video') => void;
  selectionMode?: boolean;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  selectionMode = false,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleCopyUrl = (url: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(url);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2500);
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/media', window.location.origin);
      if (selectedCategory !== 'all') {
        url.searchParams.set('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        url.searchParams.set('search', searchQuery.trim());
      }
      const response = await fetch(url.toString());
      const data = await response.json();
      if (data.success && Array.isArray(data.media)) {
        setMediaList(data.media);
      }
    } catch (err: any) {
      console.warn('Erro ao carregar Biblioteca de Mídia:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  const handleImageUpload = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setStatusNotice(null);
    setIsUploading(true);
    setUploadProgress(10);
    setUploadStage('Otimizando imagem(ns) no navegador...');

    try {
      const uploadPayloads: Array<{ filename: string; dataUrl: string; type: 'image'; category: any }> = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStage(`Comprimindo imagem ${i + 1} de ${files.length} (máx 1200px / WEBP)...`);
        setUploadProgress(10 + Math.round(((i + 1) / files.length) * 40));

        const processed = await compressAndResizeImage(file, 1200, 0.85);
        uploadPayloads.push({
          filename: file.name,
          dataUrl: processed.dataUrl,
          type: 'image',
          category: selectedCategory === 'all' ? 'images' : selectedCategory,
        });
      }

      setUploadStage('Enviando para o servidor...');
      await uploadMediaToServer(uploadPayloads, (pct) => {
        setUploadProgress(50 + Math.round((pct / 100) * 50));
      });

      setStatusNotice({
        type: 'success',
        message: `${files.length} imagem(ns) enviada(s) com sucesso para a Biblioteca!`,
      });
      fetchMedia();
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        message: err?.message || 'Falha ao enviar imagem.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage('');
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setStatusNotice(null);
    setIsUploading(true);
    setUploadProgress(10);
    setUploadStage('Gerando miniatura e preparando vídeo...');

    try {
      const uploadPayloads: Array<{ filename: string; dataUrl: string; type: 'video'; category: any; thumbnailUrl?: string }> = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStage(`Processando vídeo ${i + 1} de ${files.length} (MP4 / WEBM)...`);
        setUploadProgress(10 + Math.round(((i + 1) / files.length) * 35));

        const processed = await processVideoFile(file);
        uploadPayloads.push({
          filename: file.name,
          dataUrl: processed.dataUrl,
          type: 'video',
          category: 'videos',
          thumbnailUrl: processed.thumbnailUrl,
        });
      }

      setUploadStage('Enviando vídeo para o servidor...');
      await uploadMediaToServer(uploadPayloads, (pct) => {
        setUploadProgress(45 + Math.round((pct / 100) * 55));
      });

      setStatusNotice({
        type: 'success',
        message: `${files.length} vídeo(s) enviado(s) com sucesso para a Biblioteca de Mídia!`,
      });
      fetchMedia();
    } catch (err: any) {
      setStatusNotice({
        type: 'error',
        message: err?.message || 'Falha ao enviar vídeo.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage('');
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleDeleteMedia = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente excluir este arquivo da Biblioteca de Mídia?')) return;

    try {
      const res = await fetch(`/api/media/${encodeURIComponent(filename)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMediaList((prev) => prev.filter((m) => m.name !== filename));
        if (previewMedia?.name === filename) setPreviewMedia(null);
      }
    } catch (err: any) {
      alert('Erro ao excluir: ' + err?.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return Math.round(bytes / 1024) + ' KB';
  };

  return (
    <div
      role="dialog"
      aria-label="Biblioteca de Mídia"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] bg-[#07111F] border border-amber-500/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#071F2E] via-[#093245] to-[#0B2538] border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white font-['Cinzel',serif]">
                  Biblioteca de Mídia
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-[10px] uppercase">
                  {mediaList.length} arquivos
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Gerencie fotos, vídeos dos passeios, capas e banners com upload direto do celular ou computador.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Category Pills */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Todos os Arquivos' },
              { id: 'images', label: 'Imagens' },
              { id: 'videos', label: 'Vídeos' },
              { id: 'covers', label: 'Capas' },
              { id: 'tours', label: 'Passeios/Roteiros' },
              { id: 'banners', label: 'Banners' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Upload Buttons */}
          <div className="flex items-center gap-2">
            {/* Hidden image input with camera/gallery support */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImageUpload(e.target.files);
                }
              }}
            />

            {/* Hidden video input with gallery/recording support */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleVideoUpload(e.target.files);
                }
              }}
            />

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar imagem</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
            >
              <Film className="w-3.5 h-3.5" />
              <span>+ Adicionar vídeo</span>
            </button>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        {isUploading && (
          <div className="p-4 bg-slate-900 border-b border-amber-500/40 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>{uploadStage || 'Processando arquivo...'}</span>
              </span>
              <span className="font-mono text-white">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Notice */}
        {statusNotice && (
          <div
            className={`p-3 text-xs flex items-center justify-between border-b ${
              statusNotice.type === 'success'
                ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
                : 'bg-rose-950/70 text-rose-200 border-rose-500/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              )}
              <span>{statusNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Carregando mídias salvas...</p>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="py-20 text-center space-y-3 border-2 border-dashed border-slate-800 rounded-3xl p-8">
              <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mx-auto">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Nenhum arquivo encontrado nesta categoria</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Toque em <strong>+ Adicionar imagem</strong> ou <strong>+ Adicionar vídeo</strong> para enviar arquivos da sua galeria ou câmera.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {mediaList.map((item) => {
                const isVideo = item.type === 'video';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (selectionMode && onSelectMedia) {
                        onSelectMedia(item.url, item.type);
                        onClose();
                      } else {
                        setPreviewMedia(item);
                      }
                    }}
                    className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 overflow-hidden shadow-lg aspect-square flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative w-full h-full bg-black">
                      {isVideo ? (
                        item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.originalName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-950">
                            <VideoIcon className="w-10 h-10 text-cyan-400" />
                          </div>
                        )
                      ) : (
                        <img
                          src={item.url}
                          alt={item.originalName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {/* Video Badge */}
                      {isVideo && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-white text-white" />
                          <span>Vídeo</span>
                        </div>
                      )}

                      {/* Size Badge */}
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-slate-300 font-mono">
                        {formatFileSize(item.size)}
                      </span>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleCopyUrl(item.url, item.name, e)}
                            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-white transition-colors cursor-pointer"
                            title="Copiar link"
                          >
                            {copiedName === item.name ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteMedia(item.name, e)}
                            className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                            title="Excluir arquivo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-white truncate">{item.originalName}</p>
                          <p className="text-[9px] text-amber-300">
                            {new Date(item.uploadedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Formatos aceitos: JPG, PNG, WEBP (até 10 MB) · Vídeos: MP4, WEBM, MOV (até 50 MB)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Preview Lightbox Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-950 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{previewMedia.originalName}</h4>
                <p className="text-xs text-slate-400">
                  {formatFileSize(previewMedia.size)} · Enviado em {new Date(previewMedia.uploadedAt).toLocaleString('pt-BR')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-black rounded-2xl overflow-hidden max-h-[60vh]">
              {previewMedia.type === 'video' ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[58vh] max-w-full rounded-xl"
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.originalName}
                  className="max-h-[58vh] max-w-full object-contain rounded-xl"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs text-amber-300 font-mono truncate max-w-xs sm:max-w-md">{previewMedia.url}</span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewMedia.url, previewMedia.name)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedName === previewMedia.name ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>

              {selectionMode && onSelectMedia && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectMedia(previewMedia.url, previewMedia.type);
                    setPreviewMedia(null);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Selecionar Este Arquivo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

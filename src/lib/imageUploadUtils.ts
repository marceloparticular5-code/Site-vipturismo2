/**
 * Media upload, validation, compression, thumbnailing and server-storage utility
 * for Natal Vip Turismo.
 * Supports Images (JPG, JPEG, PNG, WEBP) & Videos (MP4, WEBM, MOV)
 */

export interface ProcessedImage {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  dataUrl: string;
  serverUrl?: string;
  width: number;
  height: number;
}

export interface ProcessedVideo {
  id: string;
  name: string;
  originalSize: number;
  dataUrl: string;
  serverUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
}

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  category: 'images' | 'videos' | 'covers' | 'tours' | 'banners';
  size: number;
  uploadedAt: string;
  thumbnailUrl?: string;
  tourId?: string;
}

const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10 MB input
const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_IMAGE_DIMENSION_PX = 1200; // max 1200px width/height

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export function validateImageFile(file: File): MediaValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado.' };
  }

  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  const hasAllowedExt =
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.webp');

  if (!ALLOWED_IMAGE_TYPES.includes(fileType) && !hasAllowedExt) {
    return {
      valid: false,
      error: `Formato de imagem inválido (${file.name}). Formatos aceitos: JPG, JPEG, PNG e WEBP.`,
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `A imagem "${file.name}" tem ${sizeMb} MB e ultrapassa o limite de 10 MB.`,
    };
  }

  return { valid: true };
}

export function validateVideoFile(file: File): MediaValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum vídeo selecionado.' };
  }

  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  const hasAllowedExt =
    fileName.endsWith('.mp4') ||
    fileName.endsWith('.webm') ||
    fileName.endsWith('.mov') ||
    fileName.endsWith('.m4v');

  if (!ALLOWED_VIDEO_TYPES.includes(fileType) && !hasAllowedExt) {
    return {
      valid: false,
      error: `Formato de vídeo inválido (${file.name}). Formatos aceitos: MP4, WEBM e MOV.`,
    };
  }

  if (file.size > MAX_VIDEO_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `O vídeo "${file.name}" tem ${sizeMb} MB e ultrapassa o limite de 50 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Resizes an image file to max 1200px width/height and compresses it using HTML5 Canvas.
 */
export async function compressAndResizeImage(
  file: File,
  maxWidth = MAX_IMAGE_DIMENSION_PX,
  quality = 0.85
): Promise<ProcessedImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo selecionado.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () =>
        reject(new Error('Erro ao processar imagem. Verifique se o arquivo está corrompido.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Contexto gráfico não disponível para compressão.'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const head = 'data:image/jpeg;base64,';
        const compressedSize = Math.round(((dataUrl.length - head.length) * 3) / 4);

        resolve({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          originalSize: file.size,
          compressedSize,
          dataUrl,
          width,
          height,
        });
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Reads a video file as base64 dataUrl and generates a thumbnail frame via canvas.
 */
export async function processVideoFile(file: File): Promise<ProcessedVideo> {
  const validation = validateVideoFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    let thumbnailGenerated = false;

    video.onloadeddata = () => {
      video.currentTime = Math.min(1.0, (video.duration || 2) / 2);
    };

    video.onseeked = () => {
      if (thumbnailGenerated) return;
      thumbnailGenerated = true;

      try {
        const canvas = document.createElement('canvas');
        const aspect = video.videoWidth / (video.videoHeight || 1);
        canvas.width = Math.min(800, video.videoWidth || 640);
        canvas.height = Math.round(canvas.width / aspect);

        const ctx = canvas.getContext('2d');
        let thumbDataUrl: string | undefined = undefined;
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          thumbDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        }

        URL.revokeObjectURL(objectUrl);

        // Read base64
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Erro ao ler arquivo de vídeo.'));
        reader.onload = () => {
          resolve({
            id: `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            originalSize: file.size,
            dataUrl: reader.result as string,
            thumbnailUrl: thumbDataUrl,
            duration: video.duration || 0,
          });
        };
        reader.readAsDataURL(file);
      } catch {
        URL.revokeObjectURL(objectUrl);
        // Fallback without thumbnail
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            originalSize: file.size,
            dataUrl: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // If thumbnail fails, read file directly
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          originalSize: file.size,
          dataUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    };
  });
}

/**
 * Uploads processed base64 media files to server /api/upload with real-time XHR progress
 */
export async function uploadMediaToServer(
  items: Array<{
    filename: string;
    dataUrl: string;
    type?: 'image' | 'video';
    category?: 'images' | 'videos' | 'covers' | 'tours' | 'banners';
    thumbnailUrl?: string;
  }>,
  onProgress?: (percent: number) => void
): Promise<Array<{ url: string; name: string; type: 'image' | 'video'; thumbnailUrl?: string }>> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.setRequestHeader('Content-Type', 'application/json');

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          if (result.success && Array.isArray(result.files)) {
            if (onProgress) onProgress(100);
            resolve(result.files);
            return;
          }
          if (result.url) {
            if (onProgress) onProgress(100);
            resolve([{ url: result.url, name: items[0]?.filename || 'file', type: items[0]?.type || 'image' }]);
            return;
          }
        } catch (e) {
          console.warn('[Upload parse error]:', e);
        }
      }
      // Fallback
      resolve(items.map((i) => ({ url: i.dataUrl, name: i.filename, type: i.type || 'image' })));
    };

    xhr.onerror = () => {
      console.warn('[Upload XHR error, fallback to dataUrl]');
      resolve(items.map((i) => ({ url: i.dataUrl, name: i.filename, type: i.type || 'image' })));
    };

    xhr.send(JSON.stringify({ files: items }));
  });
}

// Backwards compatibility alias
export const uploadImagesToServer = async (
  images: Array<{ filename: string; dataUrl: string }>,
  onProgress?: (percent: number) => void
): Promise<string[]> => {
  const result = await uploadMediaToServer(images, onProgress);
  return result.map((r) => r.url);
};

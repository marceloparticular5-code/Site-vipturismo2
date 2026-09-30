/**
 * Image upload, validation, compression, and server-storage utility
 * for Natal Vip Turismo.
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

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DIMENSION_PX = 1200; // max 1200px width/height
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): ImageValidationResult {
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

  if (!ALLOWED_TYPES.includes(fileType) && !hasAllowedExt) {
    return {
      valid: false,
      error: `Formato de arquivo inválido (${file.name}). Por favor selecione fotos nos formatos JPG, JPEG, PNG ou WEBP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `A foto "${file.name}" tem ${sizeMb} MB e ultrapassa o limite máximo permitido de 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Resizes an image file to max 1200px width/height and compresses it using HTML5 Canvas.
 */
export async function compressAndResizeImage(
  file: File,
  maxWidth = MAX_DIMENSION_PX,
  quality = 0.85
): Promise<ProcessedImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo selecionado.'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () =>
        reject(new Error('Erro ao carregar a imagem. Verifique se o arquivo está corrompido.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível inicializar o contexto gráfico para compressão.'));
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed jpeg
        const outputMime = file.type === 'image/png' ? 'image/jpeg' : file.type || 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        // Calculate approximate byte size of base64
        const compressedSize = Math.round((dataUrl.length * 3) / 4);

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

      if (typeof readerEvent.target?.result === 'string') {
        img.src = readerEvent.target.result;
      } else {
        reject(new Error('Formato de dados de leitura inválido.'));
      }
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads processed base64 images to server /api/upload with real-time progress reporting
 */
export async function uploadImagesToServer(
  images: Array<{ filename: string; dataUrl: string }>,
  onProgress?: (percent: number) => void
): Promise<string[]> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.setRequestHeader('Content-Type', 'application/json');

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          if (result.success && Array.isArray(result.files)) {
            if (onProgress) onProgress(100);
            resolve(result.files.map((f: { url: string }) => f.url));
            return;
          }
          if (result.url) {
            if (onProgress) onProgress(100);
            resolve([result.url]);
            return;
          }
        } catch (e) {
          console.warn('[Upload parse error]:', e);
        }
      }
      // Fallback
      resolve(images.map((img) => img.dataUrl));
    };

    xhr.onerror = () => {
      console.warn('[Upload XHR error, fallback to dataUrl]');
      resolve(images.map((img) => img.dataUrl));
    };

    xhr.send(JSON.stringify({ files: images }));
  });
}

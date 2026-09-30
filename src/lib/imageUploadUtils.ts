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
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado.' };
  }

  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  const hasAllowedExt =
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.png');

  if (!ALLOWED_TYPES.includes(fileType) && !hasAllowedExt) {
    return {
      valid: false,
      error: `Formato de arquivo inválido (${file.name}). Por favor selecione fotos nos formatos JPG, JPEG ou PNG.`,
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
 * Uploads processed base64 images to server /api/upload
 */
export async function uploadImagesToServer(
  images: Array<{ filename: string; dataUrl: string }>
): Promise<string[]> {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files: images }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro de upload no servidor (Status ${response.status})`);
    }

    const result = await response.json();
    if (result.success && Array.isArray(result.files)) {
      return result.files.map((f: { url: string }) => f.url);
    }
    if (result.url) {
      return [result.url];
    }
  } catch (err: any) {
    console.warn('[Server Upload Fallback]:', err?.message);
  }

  // Graceful standalone fallback: return compressed base64 data URLs
  return images.map((img) => img.dataUrl);
}

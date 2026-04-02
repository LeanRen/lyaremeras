/**
 * Convierte un archivo de imagen a formato WebP en el cliente.
 * @param {File} file - El archivo original (jpg, png, etc.)
 * @param {number} quality - Calidad de 0 a 1 (recomendado 0.8)
 * @returns {Promise<Blob>} - El archivo convertido a WebP
 */
export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Creamos un nuevo archivo a partir del blob
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp",
              });
              resolve(webpFile);
            } else {
              reject(new Error("Error al convertir a WebP"));
            }
          },
          'image/webp',
          quality
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};
export async function convertToWebP(file: File): Promise<File> {
  // Bỏ qua chuyển đổi nếu file là ảnh động GIF hoặc vector SVG
  if (file.type === "image/gif" || file.type === "image/svg+xml" || file.type === "image/webp") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Failed to get canvas context"));
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Failed to convert image to WebP"));
          }
          
          // Đổi đuôi file sang .webp
          const newName = file.name.replace(/\.[^/.]+$/, ".webp");
          const webpFile = new File([blob], newName, {
            type: "image/webp",
            lastModified: Date.now(),
          });
          
          resolve(webpFile);
        },
        "image/webp",
        0.85 // Quality: 85% là mức cân bằng tốt giữa chất lượng và dung lượng
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion"));
    };
    
    img.src = url;
  });
}

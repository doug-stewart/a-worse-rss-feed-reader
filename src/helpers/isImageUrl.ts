const formats = ["jpeg", "jpg", "png", "webp", "gif", "svg", "avif"];

export const isImageUrl = (url: string): boolean =>
  formats.some((format) => url.toLowerCase().includes(format));

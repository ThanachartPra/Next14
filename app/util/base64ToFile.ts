export const base64ToFile = (
  base64: string,
  fileName: string,
  mimeType: string
): File => {
  const byteString = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteString.length)
  
    .fill(0)
    .map((_, i) => byteString.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: mimeType });

  return new File([blob], fileName, { type: mimeType });
};

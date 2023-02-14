export const I_codeFile =
  '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V10.8125V8.625M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 12L8 14L10 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 12L16 14L14 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function base64toFile(base_data: any, filename: string) {
  var arr = base_data.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

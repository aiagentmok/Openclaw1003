/** 站台層級設定：basePath 供靜態輸出時組出正確的絕對路徑。 */
export const BASE_PATH = "/Openclaw1003";

/** 將以 / 開頭的站內路徑加上 basePath（用於 <img>、檔案下載等非 next/link 情境）。 */
export function asset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}

/** 產生訂單編號（置於模組層，避免在元件 render 期直接呼叫不純函式）。 */
export function makeOrderId(): string {
  return `JJ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export declare global {
  interface Window {
    oauth2Callback: (uri: string) => void
  }
}

import Store from '@/store';// path to store file

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store;
    $loading: (...args: any[]) => any
    $message: ((...args: unknown[]) => unknown) & {error: (...args: unknown[]) => unknown}
    $notify: (...args: unknown[]) => unknown
  }
}

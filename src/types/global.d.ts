export {}

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly VITE_AI_URL?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface Window {
    cpMentor?: {
      isDesktop: boolean
      platform: string
      notify: (title: string, body: string, silent?: boolean) => Promise<boolean>
      getVersion: () => Promise<string>
    }
  }
}

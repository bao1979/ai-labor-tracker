/// <reference types="vite/client" />

declare namespace chrome {
  export const runtime: typeof import('chrome').runtime;
  export const storage: typeof import('chrome').storage;
  export const tabs: typeof import('chrome').tabs;
}

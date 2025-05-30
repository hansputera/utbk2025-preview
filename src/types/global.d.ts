// Google Analytics gtag.js types
type GtagEvent = {
  event: string;
  page_title?: string;
  page_path?: string;
  non_interaction?: boolean;
  [key: string]: any;
};

declare global {
  interface Window {
    gtag: (command: 'config' | 'event' | 'set', ...args: any[]) => void;
  }
}

export {};

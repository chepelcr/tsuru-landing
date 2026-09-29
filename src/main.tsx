import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { LanguageProvider } from './contexts/LanguageContext';
import { loadPublishedContent } from './repositories/content.repository';
import './index.css';

// Initialize Amplify
import './lib/amplify';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const route = new URLSearchParams(window.location.search).get('route');
if (route?.startsWith('/') && !route.startsWith('//')) {
  window.history.replaceState(null, '', route);
}

async function start() {
  root.render(<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Cargando Tsuru…</div>);
  try {
    await loadPublishedContent();
    const [{ default: App }, { initBrand }] = await Promise.all([import('./App'), import('./lib/brand-theme')]);
    initBrand();
    root.render(<React.StrictMode><LanguageProvider><QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider></LanguageProvider></React.StrictMode>);
  } catch {
    root.render(<div className="min-h-screen bg-background flex flex-col gap-4 items-center justify-center p-6 text-center">
      <h1 className="font-serif text-3xl">Tsuru</h1>
      <p>No pudimos cargar el contenido. We could not load the site content.</p>
      <button className="rounded-full bg-primary px-5 py-2 text-primary-foreground" onClick={() => void start()}>
        Reintentar / Retry
      </button>
    </div>);
  }
}

void start();

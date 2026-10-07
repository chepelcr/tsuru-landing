import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { LanguageProvider } from './contexts/LanguageContext';
import { loadPublishedContent } from './repositories/content.repository';
import './index.css';
import { Router as LocationRouter } from 'wouter';

// Initialize Amplify
import './lib/amplify';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const route = new URLSearchParams(window.location.search).get('route');
if (route?.startsWith('/') && !route.startsWith('//')) {
  window.history.replaceState(null, '', route);
}

async function start() {
  if (!document.getElementById('root')!.hasChildNodes()) root.render(<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Cargando Tsuru…</div>);
  try {
    await loadPublishedContent();
    const [{ default: App }, { initBrand }] = await Promise.all([import('./App'), import('./lib/brand-theme')]);
    initBrand();
    const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');
    const routePath = window.location.pathname.slice(siteBase.length);
    const languageBase = /^\/(en|es)(?=\/|$)/.exec(routePath)?.[0] || '';
    root.render(<React.StrictMode><LocationRouter base={siteBase + languageBase}><LanguageProvider><QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider></LanguageProvider></LocationRouter></React.StrictMode>);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown startup error';
    if (import.meta.env.DEV) console.error('Tsuru startup failed:', detail);
    // Keep the generated public document readable if the live API is unavailable.
    // Its ordinary links still work without client-side handlers.
    if (document.querySelector('#root article, #root h1')) return;
    root.render(<div className="min-h-screen bg-background flex flex-col gap-4 items-center justify-center p-6 text-center">
      <h1 className="font-serif text-3xl">Tsuru</h1>
      <p>No pudimos cargar el contenido. We could not load the site content.</p>
      {import.meta.env.DEV && <p className="max-w-xl text-sm text-muted-foreground">{detail}</p>}
      <button className="rounded-full bg-primary px-5 py-2 text-primary-foreground" onClick={() => void start()}>
        Reintentar / Retry
      </button>
    </div>);
  }
}

void start();

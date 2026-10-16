import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { DemoShell } from './components/DemoShell';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Pointer-tracked sheen on interactive cards (see .folio-sheen in index.css)
document.addEventListener('pointermove', (e) => {
  const el = (e.target as HTMLElement | null)?.closest?.('.folio-sheen') as HTMLElement | null;
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}, { passive: true });

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <DemoShell>
        <App />
      </DemoShell>
    </MotionConfig>
  </React.StrictMode>
);

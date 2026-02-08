import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process'. 
  // Casting process to any to access the Node.js cwd() method in the Vite configuration environment.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: env.VITE_BASE || '/',
    // Removed invalid server.historyApiFallback as Vite dev server handles SPA routing by default.
    // If custom SPA fallback logic is needed, it's typically handled via middleware or specific plugins.
  };
});

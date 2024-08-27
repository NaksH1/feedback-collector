import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const EnviornmentKeys = [
  "REACT_APP_BACKEND_URL",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv = {};
  EnviornmentKeys.forEach(key => processEnv[key] = env[key]);

  return {
    define: {
      'process.env': processEnv
    },
    plugins: [react()],
  }
})

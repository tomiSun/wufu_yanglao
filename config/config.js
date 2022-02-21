// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
import routes from './routes';
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // mfsu: {},
  webpack5: {},
  // mfsu: { production: { output: '.mfsu-production' } },
  history: {
    type: 'browser',
  },
  locale: {
    antd: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // esbuild: {},
});

// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
console.log('process.env: ', process.env.NODE_ENV === 'production');
import routes from './routes';
const otherConfig =
  process.env.NODE_ENV === 'production'
    ? {
        nodeModulesTransform: {
          type: 'none',
          exclude: [],
        },
        chunks: ['vendors', 'umi'],
        chainWebpack: function (config, { webpack }) {
          config.merge({
            optimization: {
              minimize: true,
              splitChunks: {
                chunks: 'all',
                minSize: 30000,
                minChunks: 3,
                automaticNameDelimiter: '.',
                cacheGroups: {
                  vendor: {
                    name: 'vendors',
                    test({ resource }) {
                      return /[\\/]node_modules[\\/]/.test(resource);
                    },
                    priority: 10,
                  },
                },
              },
            },
          });
        },
      }
    : { fastRefresh: {} };
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // mfsu: {},
  // webpack5: {},
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
  ...otherConfig,
  // esbuild: {},
});

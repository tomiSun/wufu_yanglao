/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
//  http://120.27.222.210:8081/swagger-ui.html
export default {
  dev: {
    '/api/': {
      // target: 'https://918e91.39nat.com',
      target: 'http://120.27.222.210:8081',
      // target: 'https://xuchaojie.39nat.com',
      // target: 'http://192.168.1.60:8081',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '/api': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};

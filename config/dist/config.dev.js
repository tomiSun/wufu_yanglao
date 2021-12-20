"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _umi = require("umi");

var _defaultSettings = _interopRequireDefault(require("./defaultSettings"));

var _proxy = _interopRequireDefault(require("./proxy"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// https://umijs.org/config/
var REACT_APP_ENV = process.env.REACT_APP_ENV;

var _default = (0, _umi.defineConfig)({
  hash: true,
  antd: {},
  dva: {
    hmr: true
  },
  // mfsu: {},
  webpack5: {},
  // mfsu: { production: { output: '.mfsu-production' } },
  history: {
    type: 'browser'
  },
  locale: {
    // default zh-CN
    "default": 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index'
  },
  targets: {
    ie: 11
  },
  // umi routes: https://umijs.org/docs/routing
  routes: _routes["default"],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': _defaultSettings["default"].primaryColor
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: _proxy["default"][REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/'
  } // esbuild: {},

});

exports["default"] = _default;
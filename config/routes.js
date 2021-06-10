export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user/login',
            name: 'login',
            component: './User/login',
          },
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: 'register-result',
            icon: 'smile',
            path: '/user/register-result',
            component: './user/register-result',
          },
          {
            name: 'register',
            icon: 'smile',
            path: '/user/register',
            component: './user/register',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/dashboard/analysis',
          },
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: 'dashboard',
            routes: [
              {
                path: '/',
                redirect: '/dashboard/analysis',
              },
              {
                name: 'analysis',
                icon: 'smile',
                path: '/dashboard/analysis',
                component: './dashboard/analysis',
              },
              {
                name: 'monitor',
                icon: 'smile',
                path: '/dashboard/monitor',
                component: './dashboard/monitor',
              },
              {
                name: 'workplace',
                icon: 'smile',
                path: '/dashboard/workplace',
                component: './dashboard/workplace',
              },
            ],
          },
          {
            path: '/form',
            icon: 'form',
            name: 'form',
            routes: [
              {
                path: '/',
                redirect: '/form/basic-form',
              },
              {
                name: 'basic-form',
                icon: 'smile',
                path: '/form/basic-form',
                component: './form/basic-form',
              },
              {
                name: 'step-form',
                icon: 'smile',
                path: '/form/step-form',
                component: './form/step-form',
              },
              {
                name: 'advanced-form',
                icon: 'smile',
                path: '/form/advanced-form',
                component: './form/advanced-form',
              },
            ],
          },
          {
            path: '/list',
            icon: 'table',
            name: 'list',
            routes: [
              {
                path: '/list/search',
                name: 'search-list',
                component: './list/search',
                routes: [
                  {
                    path: '/list/search',
                    redirect: '/list/search/articles',
                  },
                  {
                    name: 'articles',
                    icon: 'smile',
                    path: '/list/search/articles',
                    component: './list/search/articles',
                  },
                  {
                    name: 'projects',
                    icon: 'smile',
                    path: '/list/search/projects',
                    component: './list/search/projects',
                  },
                  {
                    name: 'applications',
                    icon: 'smile',
                    path: '/list/search/applications',
                    component: './list/search/applications',
                  },
                ],
              },
              {
                path: '/',
                redirect: '/list/table-list',
              },
              {
                name: 'table-list',
                icon: 'smile',
                path: '/list/table-list',
                component: './list/table-list',
              },
              {
                name: 'basic-list',
                icon: 'smile',
                path: '/list/basic-list',
                component: './list/basic-list',
              },
              {
                name: 'card-list',
                icon: 'smile',
                path: '/list/card-list',
                component: './list/card-list',
              },
            ],
          },
          {
            path: '/profile',
            name: 'profile',
            icon: 'profile',
            routes: [
              {
                path: '/',
                redirect: '/profile/basic',
              },
              {
                name: 'basic',
                icon: 'smile',
                path: '/profile/basic',
                component: './profile/basic',
              },
              {
                name: 'advanced',
                icon: 'smile',
                path: '/profile/advanced',
                component: './profile/advanced',
              },
            ],
          },
          {
            name: 'result',
            icon: 'CheckCircleOutlined',
            path: '/result',
            routes: [
              {
                path: '/',
                redirect: '/result/success',
              },
              {
                name: 'success',
                icon: 'smile',
                path: '/result/success',
                component: './result/success',
              },
              {
                name: 'fail',
                icon: 'smile',
                path: '/result/fail',
                component: './result/fail',
              },
            ],
          },
          {
            name: 'exception',
            icon: 'warning',
            path: '/exception',
            routes: [
              {
                path: '/',
                redirect: '/exception/403',
              },
              {
                name: '403',
                icon: 'smile',
                path: '/exception/403',
                component: './exception/403',
              },
              {
                name: '404',
                icon: 'smile',
                path: '/exception/404',
                component: './exception/404',
              },
              {
                name: '500',
                icon: 'smile',
                path: '/exception/500',
                component: './exception/500',
              },
            ],
          },
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            routes: [
              {
                path: '/',
                redirect: '/account/center',
              },
              {
                name: 'center',
                icon: 'smile',
                path: '/account/center',
                component: './account/center',
              },
              {
                name: 'settings',
                icon: 'smile',
                path: '/account/settings',
                component: './account/settings',
              },
            ],
          },
          {
            name: 'editor',
            icon: 'highlight',
            path: '/editor',
            routes: [
              {
                path: '/',
                redirect: '/editor/flow',
              },
              {
                name: 'flow',
                icon: 'smile',
                path: '/editor/flow',
                component: './editor/flow',
              },
              {
                name: 'mind',
                icon: 'smile',
                path: '/editor/mind',
                component: './editor/mind',
              },
              {
                name: 'koni',
                icon: 'smile',
                path: '/editor/koni',
                component: './editor/koni',
              },
            ],
          },
          //从这里开始是我们的路由
          {
            name: 'laorendangan',
            icon: 'highlight',
            path: '/laorendangan',
            routes: [
              {
                name: 'jichudangan',
                icon: 'smile',
                path: '/laorendangan/jichudangan/index',
                component: './laorendangan/jichudangan',
              },
              {
                name: 'tijiandangan',
                icon: 'smile',
                path: '/laorendangan/tijiandangan',
                component: './laorendangan/tijiandangan',
              },
              {
                name: 'hetong',
                icon: 'smile',
                path: '/laorendangan/hetong/index',
                component: './laorendangan/hetong/index',
              },
            ],
          },
          //评估管理
          // {
          //   name: 'pingguguanli',
          //   icon: 'highlight',
          //   path: '/pingguguanli',
          //   routes: [
          //     {
          //       name: 'pinggubiao',
          //       icon: 'smile',
          //       path: '/pingguguanli/ruzhulaoren/index',
          //       component: './pingguguanli/ruzhulaoren',
          //     },
          //     {
          //       name: 'shizhuqi',
          //       icon: 'smile',
          //       path: '/pingguguanli/shizhuqi/index',
          //       component: './pingguguanli/shizhuqi',
          //     },
          //   ],
          // },
          //护理管理
          // {
          //   name: 'huliguanli',
          //   icon: 'highlight',
          //   path: '/huliguanli',
          //   routes: [
          //     {
          //       name: 'fengxiangaozhishu',
          //       icon: 'smile',
          //       path: '/huliguanli/fengxiangaozhishu/index',
          //       component: './huliguanli/fengxiangaozhishu',
          //     },
          //     {
          //       name: 'shizhuqi',
          //       icon: 'smile',
          //       path: '/pingguguanli/shizhuqi/index',
          //       component: './pingguguanli/shizhuqi',
          //     },
          //   ],
          // },
          {
            name: '基础设置',
            icon: 'highlight',
            path: '/basicSetting',
            routes: [
              {
                name: '基础字典',
                icon: 'smile',
                path: '/basicSetting/dictionary',
                component: './basicSetting/dictionary',
              },
              {
                name: '员工信息',
                icon: 'smile',
                path: '/basicSetting/staffInfo',
                component: './basicSetting/staffInfo',
              },
              {
                name: '护工信息',
                icon: 'smile',
                path: '/basicSetting/nursingInfo',
                component: './basicSetting/nursingInfo',
              },
            ],
          },
          {
            name: '综合模块',
            icon: 'highlight',
            path: '/syntheticModule',
            routes: [
              {
                name: '食谱',
                icon: 'smile',
                path: '/syntheticModule/cookbook',
                component: './syntheticModule/cookbook',
              },
              {
                name: '满意度测评',
                icon: 'smile',
                path: '/syntheticModule/satisficing',
                component: './syntheticModule/satisficing',
              },
            ],
          },
          {
            component: '404',
          },
        ],
      },
    ],
  },
];

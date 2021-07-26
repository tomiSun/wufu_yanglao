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
          //从这里开始是我们的路由
          {
            name: '基础档案',
            icon: 'highlight',
            path: '/archivesManage',
            routes: [
              {
                name: '老人档案',
                icon: 'smile',
                path: '/archivesManage/archives/index',
                component: './archivesManage/archives/index',
              },
              // {
              //   name: 'physicalExamination',
              //   icon: 'smile',
              //   path: '/archivesManage/physicalExamination/index',
              //   component: './archivesManage/physicalExamination/index',
              // },
              // {
              //   name: 'agreement',
              //   icon: 'smile',
              //   path: '/archivesManage/agreement/index',
              //   component: './archivesManage/agreement/index',
              // },
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
          {
            name: '护理管理',
            icon: 'highlight',
            path: '/nursingManagement',
            routes: [
              {
                name: '风险告知书',//风险告知书
                icon: 'smile',
                path: '/nursingManagement/riskNotification/index',
                component: './nursingManagement/riskNotification',
              },
              {
                name: '护理批量录入',//护理记录
                icon: 'smile',
                path: '/nursingManagement/nursingAddRecord/index',
                component: './nursingManagement/nursingAddRecord/index',
              },
              {
                name: '血糖记录表',//血糖记录表
                icon: 'smile',
                path: '/nursingManagement/bloodGlucoseRecord/index',
                component: './nursingManagement/bloodGlucoseRecord',
              },
              {
                name: '护理记录',//护理记录
                icon: 'smile',
                path: '/nursingManagement/nursingRecord/index',
                component: './nursingManagement/nursingRecord',
              },
              {
                name: '特级护理',//特级护理
                icon: 'smile',
                path: '/nursingManagement/specialNursingRecord/index',
                component: './nursingManagement/specialNursingRecord',
              },
              {
                name: '三测单',//三测单
                icon: 'smile',
                path: '/nursingManagement/threeVolumeList/index',
                component: './nursingManagement/threeVolumeList',
              },
              {
                name: '药品管理',//药品管理
                icon: 'smile',
                path: '/nursingManagement/drugManage/index',
                component: './nursingManagement/drugManage',
              },
              {
                name: '服药记录',//服药记录
                icon: 'smile',
                path: '/nursingManagement/drugRecord/index',
                component: './nursingManagement/drugRecord',
              },
              {
                name: '请假管理',//请假管理
                icon: 'smile',
                path: '/nursingManagement/leaveManagement/index',
                component: './nursingManagement/leaveManagement',
              },
            ],
          },
          {
            name: '流程管理',
            icon: 'highlight',
            path: '/registration',
            routes: [
              {
                name: '入院办理',
                icon: 'smile',
                path: '/registration/inHospitalRegister/index',
                component: './registration/inHospitalRegister/index',
              },
              {
                name: '出院办理',
                icon: 'smile',
                path: '/registration/outHospitalRegister/index',
                component: './registration/outHospitalRegister/index',
              },
            ],
          },
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
              {
                name: '床位信息',
                icon: 'smile',
                path: '/basicSetting/bedInfo',
                component: './basicSetting/bedInfo',
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
              {
                name: '兴趣小组活动记录',
                icon: 'smile',
                path: '/syntheticModule/amusement',
                component: './syntheticModule/amusement',
              },
              {
                name: '捐款记录',
                icon: 'smile',
                path: '/syntheticModule/record',
                component: './syntheticModule/record',
              },
              {
                name: '民管委员会（投诉）记录',
                icon: 'smile',
                path: '/syntheticModule/complain',
                component: './syntheticModule/complain',
              },
              {
                name: '交接班',
                icon: 'smile',
                path: '/syntheticModule/shiftchange',
                component: './syntheticModule/shiftchange',
              },
              {
                name: '行政查房记录',
                icon: 'smile',
                path: '/syntheticModule/wardround',
                component: './syntheticModule/wardround',
              },
              {
                name: '护工考核',
                icon: 'smile',
                path: '/syntheticModule/examine',
                component: './syntheticModule/examine',
              },
            ],
          },
          {
            name: '统计管理',
            icon: 'highlight',
            path: '/countPage',
            routes: [
              {
                name: '统计信息',
                icon: 'smile',
                path: 'countPage/countChart/index',
                component: './countPage/countChart/index',
              }
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

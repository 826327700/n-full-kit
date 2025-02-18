import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

let nav=[
      {
        text: '命令行工具',
        items: [
          { 
            text: 'N-Full-Cli', 
            link: '/md/cli/intro.md'
          },
        ]
      },
      {
        text: '后端',
        items: [
          { 
            text: 'NestJs后端模板', 
            items:[
              { text: '快速开始', link: '/md/backend/nestjs-starter/getting-started.md' },
              { text: '基础配置', link: '/md/backend/nestjs-starter/configuration.md' },
              { text: '业务端点', link: '/md/backend/nestjs-starter/endpoints.md' },
              { text: '身份认证', link: '/md/backend/nestjs-starter/auth.md' },
              { text: 'RBAC权限', link: '/md/backend/nestjs-starter/rbac.md' },
              { text: '统一响应结构', link: '/md/backend/nestjs-starter/response.md' },
              { text: 'Swagger文档', link: '/md/backend/nestjs-starter/swagger.md' },
              { text: '日志输出', link: '/md/backend/nestjs-starter/logger.md' },
              { text: 'redis应用', link: '/md/backend/nestjs-starter/redis.md' },
              { text: '缓存和限流', link: '/md/backend/nestjs-starter/cache-ratelimit.md' },
              { text: '字典自动收集', link: '/md/backend/nestjs-starter/dict.md' },
              { text: 'docker部署', link: '/md/backend/nestjs-starter/docker.md' },
            ]
          },
        ]
      },
      {
        text: '前端',
        items: [
          { 
            text: 'Admin管理模板', 
            items:[
              { text: '快速开始', link: '/md/frontend/arco-admin-starter/getting-started.md' },
              { text: '菜单配置', link: '/md/frontend/arco-admin-starter/menus.md' },
              { text: 'RBAC权限', link: '/md/frontend/arco-admin-starter/rbac.md' },
              { text: '生成请求代码', link: '/md/frontend/arco-admin-starter/swagger-api.md' },
            ]
          },
          { 
            text: 'Flutter+GetX', 
            items:[
              { text: '快速开始', link: '/md/frontend/flutter_starter/getting-started.md' },
              { text: 'get_cli使用', link: '/md/frontend/flutter_starter/get_cli.md' },
              { text: '主题和多语言', link: '/md/frontend/flutter_starter/theme-locale.md' },
            ]
          },
          { 
            text: 'Uniapp+NutUI', 
            items:[
              { text: '快速开始', link: '/md/frontend/uniapp-nutui-starter/getting-started.md' },
              { text: '生成请求代码', link: '/md/frontend/uniapp-nutui-starter/swagger-api.md' },
            ]
          },
          { 
            text: 'Electron+Vue+Nest', 
            items:[
              { text: '快速开始', link: '/md/frontend/electron-vue-starter/getting-started.md' },
              { text: '主进程相关', link: '/md/frontend/electron-vue-starter/main-process.md' },
              { text: '生成请求代码', link: '/md/frontend/electron-vue-starter/swagger-api.md' },
            ]
          },
        ]
      },
      {
        text: '其他',
        items: [
          { 
            text: '环境搭建', 
            items:[
              { text: 'docker', link: '/md/docker/docker.md' },
              { text: 'MongoDB', link: '/md/docker/mongodb.md' },
              { text: 'MySQL', link: '/md/docker/mysql.md' },
              { text: 'Redis', link: '/md/docker/redis.md' },
              { text: 'Traefik suite', link: '/md/docker/traefik.md' },
            ]
          },
        ]
      }
    ]

// https://vitepress.yiov.top/
// https://vitepress.dev/reference/site-config
export default defineConfig({
  appearance:'dark', 
  title: "N-Full-Kit",
  description: "n-full-kit是一个基于nodejs的全栈开发套件，它可以帮助开发者快速的创建从后端到前端的项目工程模板，前端涉及Web、App、小程序、桌面客户端等多端多平台，以及创建和启动一些全栈架构中常用的开源程序，以用于部署和上线",
  head:[
    ['meta', { name: 'keywords', content: 'n-full-kit,全栈开发,NodeJS,后端,前端,桌面客户端,小程序,App,开源程序,部署,上线' }],
    ['meta', { name: 'author', content:"nfull.xbzweb.com"}],
  ],
  // markdown:{
  //   theme: {
  //     light: 'vitesse-light',
  //     dark: 'vitesse-dark'
  //   }
  // },
   //markdown配置
  markdown: {
    //行号显示
    lineNumbers: true,

    // 使用 `!!code` 防止转换
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ],

    // 开启图片懒加载
    image: {
      lazyLoading: true
    },

    // 组件插入h1标题下
    config: (md) => {
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`
        return htmlResult
      },


        md.use(groupIconMdPlugin) //代码组图标

    }

  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ts: localIconLoader(import.meta.url, '../public/svg/typescript.svg'), //本地ts图标导入
          md: localIconLoader(import.meta.url, '../public/svg/md.svg'), //markdown图标
          css: localIconLoader(import.meta.url, '../public/svg/css.svg'), //css图标
          js: 'logos:javascript', //js图标
        },
      })
    ],
  },

  lastUpdated: true, //此配置不会立即生效，需git提交后爬取时间戳，没有安装git本地报错可以先注释
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/md/cli/intro.md' },
    ],

    sidebar: nav,
  
    socialLinks: [
      { icon: 'github', link: 'https://github.com/826327700/n-full-kit' }
    ],

    //本地搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                },
              },
            },
          },
        },
      },
    },

    //手机端深浅模式文字修改
    darkModeSwitchLabel: '深浅模式',

    //页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2024-${new Date().getFullYear()} nfull.xbzweb.com`,
    },

    //侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    //返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',


    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '当前页大纲'
    },

    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  }
})

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "N-Full-Kit",
  description: "n-full-kit是一个基于nodejs的全栈开发套件,它可以帮助开发者快速的创建基于NestJs的后端项目初始化模板,基于Vue3+Arco Desgin的后台管理系统项目模板,以及创建和启动一些全栈架构中常用的开源程序,以用于部署和上线",
  markdown:{
    theme: {
      light: 'catppuccin-frappe',
      dark: 'vitesse-dark'
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '后端',
        items: [
          { 
            text: 'NestJs后端模板', 
            items:[
              { text: '快速开始', link: '/md/backend/nestjs-starter.md' },
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
              { text: '快速开始', link: '/md/frontend/vue3-arco-design-starter.md' },
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
              { text: 'MongoDB', link: '/md/frontend/vue3-arco-design-starter.md' },
              { text: 'MySQL', link: '/md/frontend/vue3-arco-design-starter.md' },
              { text: 'Redis', link: '/md/frontend/vue3-arco-design-starter.md' },
            ]
          },
        ]
      }
    ],
    outline: {
      label: '目录'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

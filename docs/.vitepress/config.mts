import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Emoji Fusion',
  description: '将两个表情符号融合成一个全新的创意表情！',
  lang: 'zh-CN',
  lastUpdated: true,
  base: '/emoji-fusion/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  themeConfig: {
    logo: '/favicon.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '部署', link: '/deployment/' },
      { text: '贡献', link: '/contributing/' },
      { text: 'GitHub', link: 'https://github.com/USYDShawnTan/emoji-fusion' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/structure' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: '概述', link: '/api/' },

          ]
        }
      ],
      '/deployment/': [
        {
          text: '部署',
          items: [
            { text: '概述', link: '/deployment/' },
            { text: 'Docker', link: '/deployment/docker' },
          ]
        }
      ],
      '/contributing/': [
        {
          text: '贡献',
          items: [
            { text: '贡献指南', link: '/contributing/' },
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/USYDShawnTan/emoji-fusion' }
    ],
    
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2023-2025 Xiaotan'
    },
    
    search: {
      provider: 'local'
    }
  }
})

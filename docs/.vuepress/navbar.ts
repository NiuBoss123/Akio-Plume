import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '归档', link: '/blog/archives/' },
  { text: '关于我', link: '/about/' },
  {
    text: '其他页面',
    items: [
      { text: '关于 Development', link: '/development/' },
      { text: '个人账号', link: '/account/' },
      { text: '拥有的设备', link: '/equipment/' },
      { text: '各项开销及赞助事宜', link: '/bill-and-sponsor/' }
    ]
  },
  /*{
    text: '个人总结',
    items: [{ text: '示例', link: '/notes/demo/README.md' }]
  },*/
  { text: '友链', link: '/friends/' },
  { text: '前往主站', link: 'https://www.akio.top' },
])

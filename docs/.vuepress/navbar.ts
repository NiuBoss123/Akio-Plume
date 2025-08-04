import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/', icon: 'mdi:home' },
  { text: '博客', link: '/blog/', icon: 'mdi:blog-outline' },
  { text: '归档', link: '/blog/archives/', icon: 'mdi:access-time' },
  { text: '关于我', link: '/about/', icon: 'mdi:about-circle-outline' },
  {
    text: '其他页面',
    icon: 'mdi:format-list-bulleted',
    items: [
      { text: '个人账号', link: '/account/', icon: 'mdi:account' },
      { text: '拥有的设备', link: '/equipment/', icon: 'mdi:cellphone' },
      { text: '各项开销及赞助事宜', link: '/bill-and-sponsor/', icon: 'mdi:attach-money' }
    ]
  },
  /*{
    text: '个人总结',
    items: [{ text: '示例', link: '/notes/demo/README.md' }]
  },*/
  { text: '友链', link: '/friends/', icon: 'mdi:human-male-male' },
  { text: '前往主站', link: 'https://www.akio.top', icon: 'mdi:web' },
])

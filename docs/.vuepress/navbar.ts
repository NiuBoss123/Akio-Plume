import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/', icon: 'mdi:home' },
  { text: '文稿', link: '/posts/', icon: 'mdi:post' },
  { text: '手记', link: '/notes/', icon: 'mdi:note' },
  { text: '关于我', link: '/about/', icon: 'mdi:about' },
  {
    text: '其他页面',
    icon: 'mdi:format-list-bulleted',
    items: [
      { text: '个人账号', link: '/account/', icon: 'mdi:account' },
      { text: '拥有的设备', link: '/equipment/', icon: 'mdi:cellphone' },
      { text: '各项开销及赞助事宜', link: '/bill-and-sponsor/', icon: 'mdi:attach-money' }
    ]
  },
  { text: '友链', link: 'https://www.akio.top/friends', icon: 'mdi:human-male-male' },
  { text: '前往主站', link: 'https://www.akio.top', icon: 'mdi:web' },
])

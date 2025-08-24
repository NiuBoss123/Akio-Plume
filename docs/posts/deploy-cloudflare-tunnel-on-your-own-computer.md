---
title: 【Cloudflare】在自己电脑部署 Cloudflare Tunnel 
createTime: 2025-02-18
date: 2025/02/18
description: ''
image: ''
tags: [教程,Cloudflare]
category: '教程'
categories: [教程]
draft: false 
permalink: /posts/course/deploy-cloudflare-tunnel-on-your-own-computer/
---
## 前言

尽管早早就在 Cloudflare 绑卡了，但我也就用 R2 比较多，至于 Zero Trust  则是知道有这玩意但一直没用过

直到后来我才发现，这玩意能搞的事情疑似有点多，那我可就要玩起来了


## EP0：前置步骤

整个步骤都基于你早就创建了一个 Cloudflare 账户，同时已经把域名的 DNS 绑定到 Cloudflare 账户上了

首先你得准备一张银行卡，Visa & MasterCard & AMEX & Discover 任选一，之前有人说可以绑 PayPal，~~但至少，在我之前为了使用 R2 绑卡的时候已经没有 PayPal 的按钮了~~，玄学反正，我是没看到 PayPal 的按钮，所以是绑卡的

（绑的是中银万事达卡）

::: warning
实测银联不行，至少中国大陆发行的银联卡不行，哪怕银联可以走 Discover 统统但也没法验证，所以老老实实办一张 MasterCard 或者 AMEX 吧，人民币卡是可以绑定的，这方面管的不严
:::

如果走银行卡的话，记得在账户里留大约1美元，Cloudflare 验证账户的时候要扣大约1美元来验证账户

## EP1：初始化 Zero Trust

点击左侧导航栏的 Zero Trust 按钮，页面会跳转到 Zero Trust 独立的控制台（这个控制台没有深色模式）

然后你可以看到他的相关提示，在这里输入一个你觉得合适的名字，纯英文

![](https://mx-space.akio.top/api/v2/objects/icon/oqnzucydeoja96rxqd.png)

输入完后，点击“下一步”，然后选择 Free 计划

![](https://mx-space.akio.top/api/v2/objects/icon/tc4n7r7l9hqa7o2lco.png)

然后点击“继续付款”

![](https://mx-space.akio.top/api/v2/objects/icon/mmt68ldzw5bwb0v5yi.png)

假设你很早之前因为使用某些服务已经在 Cloudflare 绑卡了，那么这一步你只需要放松下来，等待他调整状态

但如果你没有在 Cloudflare 绑卡，那他就会弹出下面这个让你绑卡了

![](https://mx-space.akio.top/api/v2/objects/icon/ox7schjksrfothmxdr.png)

![](https://mx-space.akio.top/api/v2/objects/icon/ckqky4yw0vsdytrn7o.png)

当显示以下页面的时候，我们就完成 Zero Trust 的初始化了

![](https://mx-space.akio.top/api/v2/objects/icon/cgxoei5dziueln49vj.png)

## EP2：安装软件

点击“设置”→“资源”，滑到下面的“下载cloudflared”，根据自己的系统选择下载，这里我选择 Windows (64-bit)

![](https://mx-space.akio.top/api/v2/objects/icon/jzm6r0xajl151057qx.png)

下载完后打开，安装即可

当然也可以用 Docker 的方法去部署，这个放到后面再说

如果你需要用 Docker 安装，请提前在你的设备安装 Docker，这里并不推荐 Windows 使用 Docker 来安装

## EP3：创建应用

点击“网络”→“Tunnels”，点击“添加隧道”

![](https://mx-space.akio.top/api/v2/objects/icon/ly0z898j6r0mze5u2r.png)

选择左侧的 Cloudflared

![](https://mx-space.akio.top/api/v2/objects/icon/qfs52y1v41v1i5dyrz.png)

给隧道命名，好记就行，这里我用我设备名字来做为名称，填写完后点击“保存隧道”

![](https://mx-space.akio.top/api/v2/objects/icon/pkr5mnu9dgz969igjr.png)

然后就是关键的步骤了

以管理员模式打开 CMD 或者 PowerShell，如果已经安装了 gsudo 也可以直接输入 sudo 来切换到管理员模式，因为我的 Windows 有 gsudo 所以直接切换了

![](https://mx-space.akio.top/api/v2/objects/icon/5njhm0whaxe9nliki7.png)

回到刚才的页面，向下滑到“安装并运行连接器”

这里我们已经提前完成了第1到第3步骤，直接复制指令到刚打开的控制台回车即可

::: caution
请小心存放您的令牌。此命令包含允许连接器运行的敏感令牌。任何有权访问此令牌的人员都能够运行隧道
:::

![](https://mx-space.akio.top/api/v2/objects/icon/9l99q8yxog9t9thl4r.png)

::: warning
在这一步我们可以在“选择您的环境”这一栏有几个选择，其中就有 Docker，改选 Docker 之后，下面的“安装并运行连接器”将会自动切换到 Docker 的方案，同样的，直接复制指令到刚打开的控制台回车即可

![](https://mx-space.akio.top/api/v2/objects/icon/u5bt5w05bxqbmyxna2.png)
:::


![](https://mx-space.akio.top/api/v2/objects/icon/lx9sjim29nq4k0hci5.png)

运行后完后回到刚才的页面，滑到最底下的“Connectors”，此时应该可以看到我们的设备

![](https://mx-space.akio.top/api/v2/objects/icon/nih802gz1t3cjiqznx.png)

确定能看到之后，点击“下一步”

![](https://mx-space.akio.top/api/v2/objects/icon/6ypymv9wqvhtdw8bhi.png)

根据他的提示填写以上信息即可，填写完后点击“保存隧道”，这时候访问你创建的链接来检查访问是否正常吧

::: warning
- 如果出现例如 `Error: Bad Configuration: Validation failed: parse "http://127.0.0.1:2333 ": invalid port ":2333 " after host` 的提示，可以返回到“Tunnels”页面，进入刚才创建的隧道的配置页面，在“公共主机名”页面独立配置，配置方法和刚才一致，一般情况下这样可以解决问题
- 如果没有解决问题，请确认自己的防火墙没有拦截有关于 cloudflared 的连接，一般情况下，Linux 系统不会拦截有关于 cloudflared 的连接
- Windows 记得在防火墙放通 cloudflared，尽管在安装的时候 cloudflared 已经创建了相关入站规则，但不一定被启用了
- Windows 用户请前往“高级安全Windows Defender防火墙”启用名字为“cloudflared”的两个规则，一般情况下启用后即可正常
![](https://mx-space.akio.top/api/v2/objects/icon/uz28yw6uxwsh8vw0qq.png)
:::

## 后记

Cloudflare 这边还建议你 Access 创建一个应用程序来保护你的连接，这就看个人了（我没做，我不会弄这个）

以上操作可同理到服务器上（废话）

## 相关链接

- cloudflared GitHub 仓库：[cloudflare/cloudflared](https://github.com/cloudflare/cloudflared)
---
title: 使用 Harbor 自建具有代理功能的私有 Docker 存储库
createTime: 2025-12-10
date: 2025/12/10
description: ''
image: ''
tags: [教程,Docker,Harbor]
category: '教程'
categories: [教程]
draft: false 
permalink: /posts/course/harbor-setup/
---
## 前言

在某个不知名时间点 !!（其实是我记不住）!! 开始，中国大陆的服务器就没法直接连接到 Docker Hub（docker.io）了，这对所有的内地服务器无疑是个打击，好在代理服务越来越多，也不至于说彻底没法用

但是，和 Docker Hub 同病相怜的、由 GitHub 提供的 Docker 镜像服务 ghcr.io 却没什么人弄代理服务，即使有人弄了，也没法去访问私有仓库（这基本上是登录不上去导致的）

因为有两个项目用了 ghcr 并弄了私密，内地服务器完全不能去拉取，或者说拉取很慢，导致不能用内地服务器去做分流，一直苦苦寻求于 ghcr 的代理方案，正好前不久翻找到了 Harbor 这个企业级 Docker 私有库，就试着搭建起来了

::: warning
文稿开始编写的时候，属于 BLUEAKIO 的私有 Docker 早已部署完成，故本教程不代表本人实际业务上的配置，仅作参考
:::

## EP0：前置步骤

### 配置服务器
首先你得有：
- 一台服务器，最好是 Linux 的，**最好不是 Windows 的**
- SSH 远程工具，Termius、Tabby、XShell 都可以（本地部署可忽略）
- 一个域名（建议），在中国大陆部署时若需使用域名，请提前备案

Harbor 是基于 Docker 运行的程序，因而服务器需要提前安装 Docker，如果服务器在内地的话还需要提前配置好代理，否则会导致后续步骤的失败，为此，你有以下选择：

<details><summary>安装服务器控制面板后再部署 Docker</summary>
建议使用 1panel，1panel 的安装脚本会帮你安装 Docker 并配置代理，方便后续的步骤
  
1panel 安装脚本：
```
  bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```
在命令行运行以上指令之后，跟随 1panel 的引导去配置服务器即可，此时 1panel 安装脚本已经配置好了 Docker 代理源
</details>

<details><summary>纯命令行操作</summary>
使用官方源安装 Docker：
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```
内地服务器，请使用阿里源安装 Docker：
```
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
sudo sh get-docker.sh
```
运行完后启动 Docker 并将 Docker 设置为开机自启动
```
sudo systemctl start docker
sudo systemctl enable docker
```

内地服务器安装完成后，还需要运行以下命令以配置 Docker 代理
```
echo '{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.1panel.live",
    "https://docker.ketches.cn"
  ]
}' | sudo tee /etc/docker/daemon.json

sudo systemctl restart docker
```
此时即可完成 Docker 的安装

</details>

### 下载安装包

打开 [Harbor Releases）](https://github.com/goharbor/harbor/releases)，你会在 Release 看到类似如下的内容

![](https://act-webstatic.blueakio.com/2025/12/10/69391593862a2.png)

`harbor-offline-installer-v<版本号>tgz` 的是离线安装包，`harbor-online-installer-v<版本号>tgz` 的是在线安装包，请根据实际最新版本来部署

本教程使用的是在线版本，如果你的服务器实在连不上 Docker Hub，请使用离线版本，两者在使用上无任何差别，区别在于在线安装包会从 Docker Hub 拉取镜像后部署，相对来说会更轻便，本地文件也会更干净

将文件下载到服务器，解压，此时会多出一个名为 `harbor` 的文件夹

进入`harbor` 文件夹，如果目录下有以下内容（并且一个不缺的话），此时我们就完成了第一步

![所有的文件](https://act-webstatic.blueakio.com/2025/12/10/693917e184a0d.png)

## EP1：配置

::: warning
从此处开始，将根据本人的习惯软件进行教程的编写，请根据你的习惯修改相关命令行指令
:::

### 重命名`harbor.yml.tmpl` 为`harbor.yml`

将`harbor.yml.tmpl` 复制后修改名字为`harbor.yml`，**务必不要直接修改文件名，避免因误删除内容导致严重后果**

```
cp harbor.yml.tmpl harbor.yml
```

### 修改密码
进入`harbor.yml`，

```
vim harbor.yml
```

找到 `harbor_admin_password`

![](https://act-webstatic.blueakio.com/2025/12/10/693918dd351ab.png)

将 `Harbor12345` 修改为另外的字符，**请牢记这串字符，这段字符将成为待会登录网页控制台的 Admin 账号的初始密码**

同时，建议把 `database.password` 也修改成其他的字符（如下图位置），这串字符将成为 Harbor 待会部署的数据库的访问密码，但无需记住

![](https://act-webstatic.blueakio.com/2025/12/10/693919db843d4.png)

### 修改访问地址

在`harbor.yml`的顶部，找到 `hostname`

![](https://act-webstatic.blueakio.com/2025/12/10/69391a4788b0a.png)

修改 `hostname` 为实际的访问地址，这段不要求必须写域名，可以写服务器的IP

### 配置端口

基于各类原因，大体上会出现三种情况：

<details><summary>**你考虑使用 HTTP 作为你的 Docker 服务的协议**（特别不建议）</summary>
把 `https` 相关字段都注释掉，然后修改 `http` 的端口号为你需要使用的端口号

![](https://act-webstatic.blueakio.com/2025/12/10/69391c34ded4f.png)

此时你的访问地址为 `http://<hostname>:<port>`（例如 http://reg.mydomain.com:10086）
</details>

<details><summary>**你考虑使用 HTTPS 作为你的 Docker 服务的协议，但想使用你已经有的网页服务（例如 `Nginx` ）做反代**</summary>
这种情况下多为使用`80`，`443`这类端口去提供接入，也是最常见的一种情况
  
把 `https` 相关字段都注释掉，然后修改 `http` 的端口号为你需要使用的端口号

![](https://act-webstatic.blueakio.com/2025/12/10/69391c34ded4f.png)

然后去你的 web 服务那里配置反代，无需多余配置，只需要配置最基础的反向代理就行

此时你的访问地址为 `https://<hostname>:<port>`（例如 https://reg.mydomain.com）

</details>

<details><summary>**你考虑使用 HTTPS 作为你的 Docker 服务的协议，但不想做任何反代**</summary>
将 `https.prot` 修改为你打算使用的端口号，同时把 `https.certificate` 修改为你 SSL 公钥的地址，把 `https.private_key` 修改为你 SSL 私钥的地址，并把 SSL 公私钥放置在对应目录

![](https://act-webstatic.blueakio.com/2025/12/10/69391cf86bc14.png)

此时仍需修改 `http` 的端口号，但只需要修改成一个不与其他应用冲突的地址，后续使用时无需使用此端口

此时你的访问地址为 `https://<hostname>:<port>`（例如 https://reg.mydomain.com:10088）

</details>

### 保存 `harbor.yml`

做完以上配置后，按下 `esc`，输入 `:qw`，此时`harbor.yml` 的修改就已经完成

## EP2：启动安装脚本

使用命令行执行以下命令

```
bash install.sh
```

此时就进入了安装步骤

出现 `Harbor has been installed and started successfully.` 时候，整个安装就完成了

![](https://act-webstatic.blueakio.com/2025/12/10/69394798c51e7.png)

同时整一个服务已经运作起来了

## EP4：访问网页

 !!~~我不会数那个介于2和4之间的数字~~!!

根据你的配置的 `hostname` 和 `prot`，在浏览器访问你的 Harbor

然后你可以看到如下界面

![](https://act-webstatic.blueakio.com/2025/12/10/6939531e24d3d.png)

登录，初始账号（或者说 Admin 账号）的用户名为 `admin`，密码为你刚才设置的 `harbor_admin_password`

登入后，你可以看到如下界面

![](https://act-webstatic.blueakio.com/2025/12/10/693953947c3b6.png)

此时已经可以确定，整一个 Harbor 服务都已经正常运作起来了

## EP5：安全性操作
### 修改 Admin 账户的密码

尽管已经在 `harbor.yml` 修改了默认的密码，但为保安全，仍旧需要在网页这边修改一次密码

点击右上角的用户标识，然后点击 `修改密码`，根据弹出的填写框填写所有必填内容即可

![](https://act-webstatic.blueakio.com/2025/12/10/693955858c6dd.png)

### 创建新用户

虽说不一定要创建新用户，但为保安全，我仍旧建议创建一个新的用户专门用于在 Docker 登录你的账户

点击左侧的 `用户管理`，再点击 `创建用户`，根据弹出的填写框填写所有必填内容即可

![](https://act-webstatic.blueakio.com/2025/12/10/693956583b769.png)

## EP6：在 Docker 进行登录

在命令行输入
```
docker login <hostname>:<port>
```

然后会出现交互式填写

![](https://act-webstatic.blueakio.com/2025/12/10/6939571e5f6bc.png)

先填写 `Username`（你刚创建用户时设置的用户名），回车，然后再填写 `Passport`（你刚创建用户时设置的密码，填写 Passport 不会显示填写的内容），然后回车

如果账密都对，会出现以下内容

![](https://act-webstatic.blueakio.com/2025/12/10/6939576fd58f3.png)

此时你的服务器已经和你的 Harbor 连接上，各类提交和拉取（包括私密仓库）都畅通无阻

## EP-S-1：配置代理

::: warning
如果你部署的服务器位于中国大陆，那么你无需也无法根据此部分部署代理
:::

### 与其他服务进行关联

登录到你的 Harbor 网页之后，点击页面左边的 `仓库管理`，再点击 `新建目标`

![](https://act-webstatic.blueakio.com/2025/12/10/693958a922aa6.png)

此时弹出 `新建目标` 窗口

调整 `提供者` 选项，可以看到有12个选项

![](https://act-webstatic.blueakio.com/2025/12/10/693958e02f7e4.png)

如若选择 `harbor` 或是 `Docker Registry` 的话需要填写对应服务的地址（即 `目标URL`），如若选择这两个以外的选项的话，无需填写对应服务的地址

这里以 `GitHub GHCR` 作为例子（不是 `Google GCR`，要看清了，这俩的地址就差一个字母）

![](https://act-webstatic.blueakio.com/2025/12/10/69395a22d6aaf.png)

（关于如何获取 GitHub 访问凭证，请访问 [https://github.com/settings/tokens](https://github.com/settings/tokens)获取）

配置好后点确定即可

### 设置项目

何为“项目”？在 Harbor 里，项目就相当于一个单独的存储地，他指向了镜像存储的地方，在访问管理这一块（也就是镜像是公开的还是私密的）是基于每一个项目而定的，不是基于每一个镜像，这和很多 Docker 云服务都不相同

点击页面左边的 `项目`，再点击 `新建项目`

![](https://act-webstatic.blueakio.com/2025/12/10/69395af4bfcd0.png)

![](https://act-webstatic.blueakio.com/2025/12/10/69395b4a621ab.png)

然后点确定，就设置完成项目了

![](https://act-webstatic.blueakio.com/2025/12/10/69395b6f2f795.png)

## END：拉取镜像

以 `ghcr.io` 以及上图配置的项目名称 `ghcr` 为例，假设原始地址为 
```
ghcr.io/NiuBoss123/114514:latest
```
在经过 Harbor 的代理之后，地址将变为
```
<hostname>:<port>/ghcr/NiuBoss123/114514:latest
```
也就是把 `ghcr.io` 替换为 `<hostname>:<port>/ghcr`

之后的操作与原地址的操作无异

## 后记

如果只是为了个代理就搭建 Harbor 的话是不是太大材小用了呢？我个人觉得确实是很大材小用了 !!言外之意就是我想折腾了!!，但若考虑到他作为一个企业级 Docker 存储的地位，应当就不奇怪了

有人会说为什么不用 Docker Registry，考虑到这个本质上只是一个存储库，没有网页控制台，没有代理功能，需要自己把镜像传上去，感觉还是好麻烦（虽然用 Harbor 一样麻烦就是了，只不过用 Harbor 的话比较讨巧 !!真的讨巧吗!!）

## 相关链接
- Harbor 官网：[goharbor.io](https://goharbor.io)
- Harbor GitHub 仓库：[goharbor/harbor](https://github.com/goharbor/harbor)

（本教程在编写过程中没有一个域名受到伤害）
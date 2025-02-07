# MisakaAkio Website (Plume)

御坂秋生的個人網站（基於 Plume 的版本）。

Powered by VuePress & vuepress-theme-plume

＃＃ 安裝

```sh
pnpm i
```

＃＃ 用法

```sh
# 啟動開發伺服器
pnpm docs:dev
# 建構生產環境
pnpm docs:build
# 在本地預覽生產版本
pnpm docs:preview
# 更新 vuepress 和主題
pnpm vp-update
```

## 部署到 GitHub Pages

已使用 GitHub Actions 建立了 plume 主題：`.github/workflows/docs-deploy.yml`。還需要在GitHub倉庫中進行以下設定：

- [ ] `settings > Actions > General`，捲動到頁面底部，在 `Build and deployment` 下，選取 `Deploy from a branch`，然後按一下 `Source` 按鈕。

- [ ] `settings > Pages`，在 `Build and deploy` 中，為 `Source` 選擇 `Deploy from a branch`，為 `Branch` 選擇 `gh-pages`，點擊儲存按鈕。
 （第一次建立時 `gh-pages` 分支可能不存在。您可以先完成上述設置，將程式碼推送到主分支，等待 `github action` 完成，然後再繼續設定。）

- [ ] 修改 `docs/.vuepress/config.ts` 中的 `base` 選項：
 - 如果您打算部署到 `https://<USERNAME>.github.io/`，則可以跳過此步驟，因為 `base` 預設為 `"/"`。
 - 如果您打算部署到 `https://<USERNAME>.github.io/<REPO>/`，這表示您的儲存庫 URL 是 `https://github.com/<USERNAME>/<REPO>`，請將 `base` 設定為 `"/<REPO>/"`。

自訂網域請參考[Github Pages](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)

## 文件

- [vuepress](https://vuepress.vuejs.org/)
- [vuepress-theme-plume](https://theme-plume.vuejs.press/)

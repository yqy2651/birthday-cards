# Birthday Cards — 3D 互动生日贺卡

基于 Three.js 构建的 3D 立体生日贺卡制作与分享网页应用：支持多款分层 3D 立体影盒封面、动态特写镜头、信封深 V 封装与拆封动画、以及可开关的微信生日红包彩蛋。

## 在线体验（GitHub Pages）

- **在线网址**：https://yqy2651.github.io/birthday-cards/
- **发布分支**：`main` 分支 [`docs/`](./docs/) 目录

若修改了 [`public/`](./public/) 中的页面样式、脚本或美术资源，可运行以下命令重新构建静态发布目录与本地离线单文件：

```bash
python -B scripts/build_gh_pages.py
python -B scripts/build_standalone.py
```

## 本地离线使用

直接双击打开根目录下的 `BirthdayCards-Standalone.html` 即可纯离线制作贺卡，并通过 `#/share/...` 链接分享或预览拆封效果，无需运行任何后台服务。

# Birthday Cards — 3D 互动生日贺卡

基于 Three.js 构建的 3D 立体生日贺卡制作与分享网页应用：支持多款分层 3D 立体影盒封面、动态特写镜头、信封深 V 封装与拆封动画、以及可开关的微信生日红包彩蛋。

## GitHub Pages 在线部署

静态构建输出位于 [`docs/`](./docs/)（`main` 分支 `/docs` 目录）。  
若修改了 `public/` 中的页面或资源，可重新生成 `docs/`：

```bash
python scripts/build_gh_pages.py
```

## 本地离线使用

1. **直接双击运行（无需后台服务器）**：打开本地生成的 `BirthdayCards-Standalone.html` 即可纯离线制作并通过 `#/share/...` 分享卡片。若修改源码，可运行以下命令重新构建单文件版本：
   ```bash
   python scripts/build_standalone.py
   ```
2. **可选本地服务模式**：在 Windows 下双击 `启动本地网页.bat`，或运行：
   ```bash
   python server.py --port 8000
   ```

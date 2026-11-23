"""Build a subpath-safe, mobile/WeChat-compatible GitHub Pages static site in docs/."""

import json
from pathlib import Path
import shutil
import sys
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_standalone import bundle_app_modules, bundle_three  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
DOCS = ROOT / "docs"


def convert_assets() -> dict[str, str]:
    """Convert public/assets PNGs into compact WebPs under docs/assets/ and return subpath map."""
    assets_src = PUBLIC / "assets"
    asset_map: dict[str, str] = {}

    for src in sorted(assets_src.rglob("*.png")):
        rel_posix = src.relative_to(PUBLIC).with_suffix(".webp").as_posix()
        dst = DOCS / rel_posix
        dst.parent.mkdir(parents=True, exist_ok=True)

        im = Image.open(src)
        if src.name.endswith("-normal.png") or src.name == "foil.png":
            im.save(dst, format="WEBP", lossless=True, quality=100)
        else:
            im.save(dst, format="WEBP", quality=86, method=4)

        key = "/" + src.relative_to(PUBLIC).as_posix()
        asset_map[key] = "./" + rel_posix

    return asset_map


def write_bundles_and_styles() -> None:
    """Copy CSS and compile classic non-module JS bundles compatible with all mobile WebViews."""
    shutil.copytree(PUBLIC / "css", DOCS / "css")
    js_dir = DOCS / "js"
    js_dir.mkdir(parents=True, exist_ok=True)
    (js_dir / "three.bundle.js").write_text(bundle_three(), encoding="utf-8")
    (js_dir / "app.bundle.js").write_text(bundle_app_modules(), encoding="utf-8")


def build_index_html(asset_map: dict[str, str]) -> str:
    """Generate mobile-safe docs/index.html with zero render-blocking fonts and zero importmap."""
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Birthday Cards — 制作与分享你的生日贺卡</title>
  <meta property="og:title" content="Birthday Cards — 制作与分享你的生日贺卡" />
  <meta property="og:description" content="亲手挑一张 3D 立体生日贺卡，写下祝福、装进信封、盖上火漆印章，附带专属微信生日红包送给朋友。" />
  <meta property="og:type" content="website" />
  <link rel="icon" type="image/webp" href="./assets/brand/mark.webp" />
  <link rel="stylesheet" href="./css/styles.css" />
</head>
<body>
  <div id="site-loading" class="site-loading" aria-hidden="false">
    <div class="loading-inner">
      <div class="loading-illustration">
        <img src="./assets/brand/mark.webp" alt="" class="loading-mark" />
        <svg class="loading-sparkles" viewBox="0 0 120 80" fill="none" aria-hidden="true">
          <path d="M22 18L24 23L29 25L24 27L22 32L20 27L15 25L20 23Z" fill="#d4a84f" />
          <path d="M98 14L99.5 18L103.5 19.5L99.5 21L98 25L96.5 21L92.5 19.5L96.5 18Z" fill="#d4a84f" />
          <circle cx="92" cy="60" r="2.2" fill="#d4a84f" opacity="0.7" />
          <circle cx="30" cy="62" r="1.8" fill="#d4a84f" opacity="0.6" />
        </svg>
      </div>
      <div class="loading-title">Birthday Cards</div>
      <div class="loading-subtitle">A little birthday magic is on its way...</div>
    </div>
  </div>

  <div id="app"></div>
  <div id="toast-container" class="toast-container" aria-live="polite"></div>

  <script>
    window.__STANDALONE_BUNDLE__ = true;
    window.__INLINE_ASSETS__ = {json.dumps(asset_map, ensure_ascii=False)};
    (function () {{
      function hideSplash() {{
        var el = document.getElementById('site-loading');
        if (el) {{
          el.classList.add('hidden');
          el.setAttribute('aria-hidden', 'true');
        }}
      }}
      window.addEventListener('error', hideSplash);
      setTimeout(hideSplash, 6000);
    }})();
  </script>
  <script src="./js/three.bundle.js"></script>
  <script src="./js/app.bundle.js"></script>
</body>
</html>
"""


def build_404_html() -> str:
    """Redirect unknown subpaths cleanly back to ./ while preserving hash if present."""
    return """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=./" />
  <title>Birthday Cards — Redirecting</title>
  <script>
    window.location.replace('./' + (window.location.hash || ''));
  </script>
</head>
<body></body>
</html>
"""


def main() -> None:
    if DOCS.exists():
        shutil.rmtree(DOCS)
    DOCS.mkdir(parents=True, exist_ok=True)

    asset_map = convert_assets()
    write_bundles_and_styles()
    (DOCS / "index.html").write_text(build_index_html(asset_map), encoding="utf-8")
    (DOCS / ".nojekyll").write_text("", encoding="utf-8")
    (DOCS / "404.html").write_text(build_404_html(), encoding="utf-8")

    files = [p for p in DOCS.rglob("*") if p.is_file()]
    total_mb = sum(p.stat().st_size for p in files) / (1024.0 * 1024.0)
    print(f"Built {DOCS} ({len(files)} files, {len(asset_map)} WebP assets, {total_mb:.2f} MB)")


if __name__ == "__main__":
    main()

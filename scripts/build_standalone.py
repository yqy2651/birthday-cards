"""Build a self-contained, zero-server single-file HTML bundle: BirthdayCards-Standalone.html."""

import base64
from io import BytesIO
import json
from pathlib import Path
import re
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT_HTML = ROOT / "BirthdayCards-Standalone.html"


def encode_assets() -> dict[str, str]:
    """Encode all public/assets PNGs into compact Data URIs."""
    assets_dir = PUBLIC / "assets"
    mapping: dict[str, str] = {}
    for p in sorted(assets_dir.rglob("*.png")):
        rel = "/" + p.relative_to(PUBLIC).as_posix()
        im = Image.open(p)
        buf = BytesIO()
        # Keep normal/foil maps lossless to preserve exact tangent-space vectors
        if p.name.endswith("-normal.png") or p.name == "foil.png":
            im.save(buf, format="WEBP", lossless=True, quality=100)
        else:
            im.save(buf, format="WEBP", quality=86, method=4)
        b64 = base64.b64encode(buf.getvalue()).decode("ascii")
        mapping[rel] = f"data:image/webp;base64,{b64}"
    return mapping


def parse_export_list(spec: str) -> str:
    """Convert `local as exported, foo` -> `exported:local,foo:foo`."""
    pairs = []
    for raw in spec.split(","):
        tok = raw.strip()
        if not tok:
            continue
        if " as " in tok:
            local_n, exp_n = [x.strip() for x in tok.split(" as ", 1)]
            pairs.append(f"{exp_n}:{local_n}")
        else:
            pairs.append(f"{tok}:{tok}")
    return "{" + ",".join(pairs) + "}"


def parse_import_list(spec: str) -> str:
    """Convert `Orig as alias, foo` -> `Orig:alias,foo` for JS destructuring."""
    pairs = []
    for raw in spec.split(","):
        tok = raw.strip()
        if not tok:
            continue
        if " as " in tok:
            orig_n, alias_n = [x.strip() for x in tok.split(" as ", 1)]
            pairs.append(f"{orig_n}:{alias_n}")
        else:
            pairs.append(tok)
    return "{" + ",".join(pairs) + "}"


def bundle_three() -> str:
    core_src = (PUBLIC / "vendor" / "three.core.min.js").read_text(encoding="utf-8")
    mod_src = (PUBLIC / "vendor" / "three.module.js").read_text(encoding="utf-8")

    # Convert core export{...}; at end
    m_core = re.search(r"export\s*\{([^}]*)\}\s*;?\s*$", core_src)
    if not m_core:
        raise RuntimeError("Could not locate export block in three.core.min.js")
    core_ret = parse_export_list(m_core.group(1))
    core_body = core_src[:m_core.start()] + f"\nreturn {core_ret};\n"

    # Convert module import{...}from"./three.core.min.js";, strip core re-export, and wrap module export{...};
    m_imp = re.search(r'import\s*\{([^}]*)\}\s*from\s*["\']\./three\.core\.min\.js["\']\s*;', mod_src)
    if not m_imp:
        raise RuntimeError("Could not locate three.core.min.js import in three.module.js")
    imp_destruct = parse_import_list(m_imp.group(1))
    mod_body = mod_src[:m_imp.start()] + f"const {imp_destruct}=__THREE_CORE__;" + mod_src[m_imp.end():]

    m_reexp = re.search(r'export\s*\{([^}]*)\}\s*from\s*["\']\./three\.core\.min\.js["\']\s*;', mod_body)
    if m_reexp:
        mod_body = mod_body[:m_reexp.start()] + mod_body[m_reexp.end():]

    m_mod_exp = re.search(r"export\s*\{([^}]*)\}\s*;?\s*$", mod_body)
    if not m_mod_exp:
        raise RuntimeError("Could not locate export block in three.module.js")
    mod_ret = parse_export_list(m_mod_exp.group(1))
    mod_body = mod_body[:m_mod_exp.start()] + f"\nreturn Object.assign({{}}, __THREE_CORE__, {mod_ret});\n"

    combined = (
        "const __THREE_CORE__=(function(){\n"
        + core_body
        + "\n})();\n"
        + "window.__THREE__=(function(){\n"
        + mod_body
        + "\n})();\n"
    )
    return combined.replace("</script>", "<\\/script>")


def resolve_module_key(current_rel: str, spec: str) -> str:
    if spec == "three":
        return "three"
    base_parts = Path(current_rel).parent
    resolved = (base_parts / spec).as_posix()
    # Normalize '..'
    parts: list[str] = []
    for seg in resolved.split("/"):
        if seg in ("", "."):
            continue
        if seg == "..":
            if parts:
                parts.pop()
        else:
            parts.append(seg)
    return "/".join(parts)


def bundle_app_modules() -> str:
    order = [
        "js/config.js",
        "js/api.js",
        "js/audio.js",
        "js/components/redPacketModal.js",
        "js/three/textures.js",
        "js/three/coverEffects3d.js",
        "js/three/sceneManager.js",
        "js/three/card3d.js",
        "js/three/envelope3d.js",
        "js/views/homeView.js",
        "js/views/editorView.js",
        "js/views/letterView.js",
        "js/views/outboxView.js",
        "js/main.js",
    ]

    parts = ["const __APP_MODS__ = { 'three': window.__THREE__ };\n"]
    imp_re = re.compile(r'^\s*import\s+([\s\S]*?)\s+from\s+[\'"]([^\'"]+)[\'"];?', re.MULTILINE)

    for rel in order:
        src = (PUBLIC / rel).read_text(encoding="utf-8")

        def repl_import(match: re.Match) -> str:
            clause = match.group(1).strip()
            spec = match.group(2).strip()
            mod_key = resolve_module_key(rel, spec)
            if clause.startswith("* as "):
                alias = clause[5:].strip()
                return f"const {alias} = __APP_MODS__['{mod_key}'];"
            if clause.startswith("{") and clause.endswith("}"):
                inner = parse_import_list(clause[1:-1])
                return f"const {inner} = __APP_MODS__['{mod_key}'];"
            return f"const {clause} = __APP_MODS__['{mod_key}'];"

        src = imp_re.sub(repl_import, src)

        exported_names: list[str] = []

        def collect_decl(match: re.Match) -> str:
            kw, name = match.group(1), match.group(2)
            exported_names.append(name)
            return f"{kw} {name}"

        src = re.sub(
            r"^\s*export\s+(async\s+function|function|const|let|class)\s+([A-Za-z0-9_$]+)",
            collect_decl,
            src,
            flags=re.MULTILINE,
        )

        ret_stmt = (
            "return { " + ", ".join(exported_names) + " };"
            if exported_names
            else "return {};"
        )
        wrapped = (
            f"__APP_MODS__['{rel}'] = (function() {{\n"
            f"{src}\n"
            f"{ret_stmt}\n"
            f"}})();\n"
        )
        parts.append(wrapped.replace("</script>", "<\\/script>"))

    return "\n".join(parts)


def main():
    assets = encode_assets()
    css_src = (PUBLIC / "css" / "styles.css").read_text(encoding="utf-8")
    three_js = bundle_three()
    app_js = bundle_app_modules()

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Birthday Cards — 制作与分享你的生日贺卡</title>
  <link rel="icon" type="image/webp" href="{assets.get('/assets/brand/mark.png', '')}" />
  <style>
{css_src}
  </style>
</head>
<body>
  <div id="site-loading" class="site-loading" aria-hidden="false">
    <div class="loading-inner">
      <div class="loading-illustration">
        <img src="{assets.get('/assets/brand/mark.png', '')}" alt="" class="loading-mark" />
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
window.__INLINE_ASSETS__ = {json.dumps(assets, ensure_ascii=False)};
  </script>
  <script>
{three_js}
  </script>
  <script>
{app_js}
  </script>
</body>
</html>
"""
    OUT_HTML.write_text(html, encoding="utf-8")
    size_kb = OUT_HTML.stat().st_size / 1024.0
    print(f"Built {OUT_HTML} ({len(assets)} assets embedded, {size_kb:.1f} KB)")


if __name__ == "__main__":
    main()

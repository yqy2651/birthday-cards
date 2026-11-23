"""Asset extraction, compositing, and procedural PBR texture pipeline for Birthday Cards."""

from collections import deque
import json
import math
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
RAW = ROOT / "raw_assets"

MASTERPLATES = {
    "candlelight-wish": Path(
        r"C:\Users\YANG\.gemini\antigravity\brain\31d4af52-8c44-4382-8d10-7db4900792f2\cover_candlelight_wish_1795424749717.jpg"
    ),
    "garden-tea": Path(
        r"C:\Users\YANG\.gemini\antigravity\brain\31d4af52-8c44-4382-8d10-7db4900792f2\cover_garden_tea_1795424750510.jpg"
    ),
    "sky-balloons": Path(
        r"C:\Users\YANG\.gemini\antigravity\brain\31d4af52-8c44-4382-8d10-7db4900792f2\cover_sky_balloons_1795424760693.jpg"
    ),
}

COVER_SIZE = (780, 1080)
THUMB_SIZE = (156, 216)


def fit_cover(im: Image.Image, target_size=COVER_SIZE) -> Image.Image:
    """Center-crop and resize an image to exact 26:36 card dimensions."""
    tw, th = target_size
    sw, sh = im.size
    target_ratio = tw / th
    src_ratio = sw / sh
    if src_ratio > target_ratio:
        new_w = int(round(sh * target_ratio))
        left = (sw - new_w) // 2
        im = im.crop((left, 0, left + new_w, sh))
    else:
        new_h = int(round(sw / target_ratio))
        top = (sh - new_h) // 2
        im = im.crop((0, top, sw, top + new_h))
    return im.resize((tw, th), Image.Resampling.LANCZOS)


def make_foil_mask(rgb_im: Image.Image) -> Image.Image:
    """Detect warm metallic gold-foil pixels for realistic PBR sheen & specular glint."""
    arr = np.asarray(rgb_im.convert("RGB"), dtype=np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    warm = r - b
    gold_ratio = (g - b) / np.maximum(1.0, warm)
    mask = (
        np.clip((r - 135.0) / 55.0, 0.0, 1.0)
        * np.clip((warm - 26.0) / 42.0, 0.0, 1.0)
        * np.clip(1.0 - np.abs(gold_ratio - 0.68) / 0.42, 0.0, 1.0)
    )
    foil = Image.fromarray((np.clip(mask, 0.0, 1.0) * 255).astype(np.uint8), mode="L")
    return foil.filter(ImageFilter.GaussianBlur(radius=0.8))


def flood_extract_bg(
    crop: Image.Image,
    bg_rgb: tuple[float, float, float] | None = None,
    hard_dist: float = 22.0,
    soft_dist: float = 40.0,
    keep_largest: bool = False,
) -> Image.Image:
    """Extract an isolated motif using border-connected color-distance flood-fill."""
    rgb = np.asarray(crop.convert("RGB"), dtype=np.float32)
    h, w, _ = rgb.shape

    if bg_rgb is None:
        border = np.concatenate([rgb[0, :], rgb[-1, :], rgb[:, 0], rgb[:, -1]], axis=0)
        bg = np.median(border, axis=0)
    else:
        bg = np.array(bg_rgb, dtype=np.float32)

    dist = np.linalg.norm(rgb - bg[None, None, :], axis=2)
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    q = deque()

    def try_push(y: int, x: int):
        if not visited[y, x] and dist[y, x] <= soft_dist:
            visited[y, x] = True
            q.append((y, x))

    for x in range(w):
        try_push(0, x)
        try_push(h - 1, x)
    for y in range(h):
        try_push(y, 0)
        try_push(y, w - 1)

    while q:
        cy, cx = q.popleft()
        is_bg[cy, cx] = True
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                if dist[ny, nx] <= soft_dist:
                    visited[ny, nx] = True
                    q.append((ny, nx))

    alpha = np.where(is_bg, 0.0, 255.0).astype(np.float32)

    bg_img = Image.fromarray((is_bg.astype(np.uint8) * 255), mode="L")
    dilated = np.asarray(bg_img.filter(ImageFilter.MaxFilter(5)), dtype=np.float32) / 255.0
    near_edge = (dilated > 0.5) & (~is_bg)
    edge_ramp = np.clip((dist - hard_dist) / max(1.0, (soft_dist - hard_dist)), 0.0, 1.0) * 255.0
    alpha = np.where(near_edge, np.minimum(alpha, edge_ramp), alpha)

    if keep_largest:
        fg = alpha > 40
        comp = np.zeros((h, w), dtype=np.int32)
        best_id, best_area = 0, 0
        cid = 0
        for sy in range(h):
            for sx in range(w):
                if fg[sy, sx] and comp[sy, sx] == 0:
                    cid += 1
                    cq = deque([(sy, sx)])
                    comp[sy, sx] = cid
                    area = 0
                    while cq:
                        yy, xx = cq.popleft()
                        area += 1
                        for dy in (-1, 0, 1):
                            for dx in (-1, 0, 1):
                                ny, nx = yy + dy, xx + dx
                                if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and comp[ny, nx] == 0:
                                    comp[ny, nx] = cid
                                    cq.append((ny, nx))
                    if area > best_area:
                        best_area = area
                        best_id = cid
        if best_id > 0:
            # Keep main component and close small neighbors within 4px
            keep_mask = Image.fromarray(((comp == best_id).astype(np.uint8) * 255), mode="L").filter(ImageFilter.MaxFilter(7))
            keep_arr = np.asarray(keep_mask) > 0
            alpha = np.where(keep_arr, alpha, 0.0)

    alpha_im = Image.fromarray(np.clip(alpha, 0, 255).astype(np.uint8), mode="L").filter(ImageFilter.GaussianBlur(radius=0.5))
    rgba = crop.convert("RGBA")
    rgba.putalpha(alpha_im)
    return rgba


def pad_square(im: Image.Image, size: int, margin_ratio: float = 0.08) -> Image.Image:
    """Trim transparent margin and center inside a square transparent canvas."""
    bbox = im.getbbox()
    if not bbox:
        return Image.new("RGBA", (size, size), (0, 0, 0, 0))
    trimmed = im.crop(bbox)
    tw, th = trimmed.size
    inner = int(round(size * (1.0 - 2.0 * margin_ratio)))
    scale = min(inner / max(1, tw), inner / max(1, th))
    nw = max(1, int(round(tw * scale)))
    nh = max(1, int(round(th * scale)))
    resized = trimmed.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return canvas


def apply_paper_grain(rgba: Image.Image, seed: int = 77, strength: float = 0.06) -> Image.Image:
    """Blend subtle cold-press watercolor tooth into opaque pixels of supersampled art."""
    arr = np.asarray(rgba, dtype=np.float32).copy()
    h, w, _ = arr.shape
    n = value_noise_2d(max(h, w), 64, seed)[:h, :w] - 0.5
    factor = 1.0 + n * strength * 2.0
    arr[:, :, :3] = (arr[:, :, :3] * factor[:, :, None]).clip(0, 255)
    return Image.fromarray(arr.astype(np.uint8), mode="RGBA")


def value_noise_2d(size: int, grid: int, seed: int) -> np.ndarray:
    """Generate seamless periodic bilinear value noise in [0, 1]."""
    rng = np.random.default_rng(seed)
    lattice = rng.random((grid, grid), dtype=np.float32)

    coords = np.linspace(0, grid, size, endpoint=False, dtype=np.float32)
    xi = np.floor(coords).astype(np.int32)
    xf = coords - xi
    u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)

    x0 = xi % grid
    x1 = (xi + 1) % grid

    n00 = lattice[np.ix_(x0, x0)]
    n10 = lattice[np.ix_(x0, x1)]
    n01 = lattice[np.ix_(x1, x0)]
    n11 = lattice[np.ix_(x1, x1)]

    nx0 = n00 * (1 - u[None, :]) + n10 * u[None, :]
    nx1 = n01 * (1 - u[None, :]) + n11 * u[None, :]
    return nx0 * (1 - u[:, None]) + nx1 * u[:, None]


def height_to_normal(height: np.ndarray, strength: float = 2.4) -> Image.Image:
    """Convert a tileable [0, 1] heightfield to a tangent-space RGB normal map."""
    gx = np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)
    gy = np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)
    dx = -gx * strength
    dy = gy * strength
    dz = np.ones_like(height)
    norm = np.sqrt(dx * dx + dy * dy + dz * dz)
    r = ((dx / norm) * 0.5 + 0.5) * 255.0
    g = ((dy / norm) * 0.5 + 0.5) * 255.0
    b = ((dz / norm) * 0.5 + 0.5) * 255.0
    rgb = np.stack([r, g, b], axis=-1).clip(0, 255).astype(np.uint8)
    return Image.fromarray(rgb, mode="RGB")


def draw_8star(
    draw: ImageDraw.ImageDraw,
    cx: float,
    cy: float,
    outer_r: float,
    inner_r: float,
    diag_r: float,
    fill: tuple,
    outline: tuple | None = None,
    width: int = 1,
):
    """Draw a crisp 8-point gold star polygon."""
    pts = []
    for i in range(16):
        ang = i * math.pi / 8.0 - math.pi / 2.0
        r = outer_r if i % 4 == 0 else (diag_r if i % 4 == 2 else inner_r)
        pts.append((cx + math.cos(ang) * r, cy + math.sin(ang) * r))
    draw.polygon(pts, fill=fill, outline=outline)
    if outline and width > 1:
        draw.line(pts + [pts[0]], fill=outline, width=width)


def draw_watercolor_rose(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, s: int, tint: str = "blush"):
    """Draw a layered hand-painted watercolor rose blossom."""
    if tint == "blush":
        c_outer, c_mid, c_in, c_edge = (247, 212, 210, 255), (239, 184, 182, 255), (224, 152, 152, 255), (176, 114, 114, 240)
    else:
        c_outer, c_mid, c_in, c_edge = (252, 244, 232, 255), (244, 228, 206, 255), (232, 206, 176, 255), (186, 156, 126, 240)
    for k in range(5):
        ang = k * 2 * math.pi / 5 + 0.2
        px = cx + math.cos(ang) * r * 0.42
        py = cy + math.sin(ang) * r * 0.42
        pr = r * 0.56
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=c_outer, outline=c_edge, width=max(1, 2 * s))
    for k in range(4):
        ang = k * 2 * math.pi / 4 + 0.65
        px = cx + math.cos(ang) * r * 0.24
        py = cy + math.sin(ang) * r * 0.24
        pr = r * 0.40
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=c_mid, outline=c_edge, width=max(1, 2 * s))
    draw.ellipse([cx - r * 0.24, cy - r * 0.24, cx + r * 0.24, cy + r * 0.24], fill=c_in, outline=c_edge, width=max(1, 2 * s))


def draw_leaf(draw: ImageDraw.ImageDraw, cx: float, cy: float, ang: float, length: float, width_r: float, s: int):
    """Draw a soft sage eucalyptus leaf."""
    ca, sa = math.cos(ang), math.sin(ang)
    nx, ny = -sa, ca
    pts = [
        (cx, cy),
        (cx + ca * length * 0.45 + nx * width_r, cy + sa * length * 0.45 + ny * width_r),
        (cx + ca * length, cy + sa * length),
        (cx + ca * length * 0.45 - nx * width_r, cy + sa * length * 0.45 - ny * width_r),
    ]
    draw.polygon(pts, fill=(170, 194, 172, 250), outline=(112, 138, 118, 240))
    draw.line([(cx, cy), (cx + ca * length * 0.85, cy + sa * length * 0.85)], fill=(128, 152, 132, 200), width=max(1, s))


def generate_textures():
    """Generate seamless PBR paper normal maps, kraft albedo, and crimson gold-star lining."""
    tex_dir = ASSETS / "textures"
    size = 512

    h_wc = (
        0.48 * value_noise_2d(size, 64, 101)
        + 0.32 * value_noise_2d(size, 128, 102)
        + 0.20 * value_noise_2d(size, 256, 103)
    )
    height_to_normal(h_wc, strength=3.4).save(tex_dir / "watercolor-normal.png")
    rough_wc = (0.82 + (h_wc - 0.5) * 0.22).clip(0.55, 0.98) * 255.0
    Image.fromarray(rough_wc.astype(np.uint8), mode="L").save(tex_dir / "watercolor-rough.png")

    h_kf = (
        0.35 * value_noise_2d(size, 32, 201)
        + 0.35 * value_noise_2d(size, 96, 202)
        + 0.30 * value_noise_2d(size, 192, 203)
    )
    height_to_normal(h_kf, strength=2.9).save(tex_dir / "kraft-normal.png")

    rng = np.random.default_rng(209)
    base = np.zeros((size, size, 3), dtype=np.float32)
    base[:, :, 0] = 200.0 + (h_kf - 0.5) * 22.0
    base[:, :, 1] = 171.0 + (h_kf - 0.5) * 20.0
    base[:, :, 2] = 136.0 + (h_kf - 0.5) * 18.0
    fleck_img = Image.fromarray(base.clip(0, 255).astype(np.uint8), mode="RGB")
    draw = ImageDraw.Draw(fleck_img, "RGBA")
    for _ in range(950):
        x = int(rng.integers(0, size))
        y = int(rng.integers(0, size))
        ang = float(rng.uniform(0, math.pi))
        ln = float(rng.uniform(1.5, 4.5))
        dark = rng.random() > 0.35
        col = (128, 98, 68, 70) if dark else (228, 206, 178, 65)
        draw.line([(x, y), (x + math.cos(ang) * ln, y + math.sin(ang) * ln)], fill=col, width=1)
    fleck_img.save(tex_dir / "kraft-albedo.png")

    h_pr = (
        0.45 * value_noise_2d(size, 16, 301)
        + 0.35 * value_noise_2d(size, 128, 302)
        + 0.20 * value_noise_2d(size, 256, 303)
    )
    height_to_normal(h_pr, strength=1.45).save(tex_dir / "pearl-normal.png")

    h_ln = 0.55 * value_noise_2d(size, 48, 401) + 0.45 * value_noise_2d(size, 160, 402)
    crimson = np.zeros((size, size, 3), dtype=np.float32)
    crimson[:, :, 0] = 148.0 + (h_ln - 0.5) * 18.0
    crimson[:, :, 1] = 30.0 + (h_ln - 0.5) * 8.0
    crimson[:, :, 2] = 28.0 + (h_ln - 0.5) * 8.0
    lining = Image.fromarray(crimson.clip(0, 255).astype(np.uint8), mode="RGB")

    ss = 2
    ov = Image.new("RGBA", (size * ss, size * ss), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    step = 64 * ss
    for row in range(-1, (size * ss) // step + 2):
        for col in range(-1, (size * ss) // step + 2):
            cx = col * step + (step // 2 if row % 2 else 0)
            cy = row * step
            draw_8star(od, cx, cy, outer_r=8.5 * ss, inner_r=2.8 * ss, diag_r=5.4 * ss, fill=(225, 184, 102, 235))
    ov_small = ov.resize((size, size), Image.Resampling.LANCZOS)
    Image.alpha_composite(lining.convert("RGBA"), ov_small).convert("RGB").save(tex_dir / "lining-crimson-stars.png")


def paint_watercolor_cake(size: int = 256) -> Image.Image:
    """Paint a 4x supersampled frosted birthday cake with warm berries & lit candles."""
    s = 4
    w = size * s
    im = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # Warm candle halo behind top
    halo = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    hd.ellipse([w * 0.24, w * 0.05, w * 0.76, w * 0.42], fill=(255, 224, 140, 115))
    halo = halo.filter(ImageFilter.GaussianBlur(radius=18 * s))
    im = Image.alpha_composite(im, halo)
    d = ImageDraw.Draw(im)

    # Cake pedestal stand
    d.ellipse([w * 0.16, w * 0.78, w * 0.84, w * 0.89], fill=(246, 240, 230, 255), outline=(176, 154, 128, 255), width=3 * s)
    d.polygon([(w * 0.42, w * 0.87), (w * 0.58, w * 0.87), (w * 0.64, w * 0.93), (w * 0.36, w * 0.93)], fill=(238, 230, 218, 255), outline=(176, 154, 128, 255))

    # Bottom tier (warm ivory sponge + blush buttercream)
    d.rounded_rectangle([w * 0.22, w * 0.54, w * 0.78, w * 0.83], radius=14 * s, fill=(252, 242, 226, 255), outline=(182, 146, 108, 255), width=3 * s)
    # Berry filling band + frosting scallops
    d.rectangle([w * 0.23, w * 0.66, w * 0.77, w * 0.72], fill=(236, 178, 178, 210))
    for i in range(5):
        sx = w * (0.24 + i * 0.105)
        d.pieslice([sx, w * 0.51, sx + w * 0.105, w * 0.61], 0, 180, fill=(255, 250, 244, 255), outline=(196, 166, 134, 235), width=2 * s)

    # Top tier
    d.rounded_rectangle([w * 0.31, w * 0.35, w * 0.69, w * 0.56], radius=12 * s, fill=(253, 246, 234, 255), outline=(182, 146, 108, 255), width=3 * s)
    for i in range(4):
        sx = w * (0.315 + i * 0.092)
        d.pieslice([sx, w * 0.33, sx + w * 0.092, w * 0.42], 0, 180, fill=(255, 252, 247, 255), outline=(196, 166, 134, 235), width=2 * s)

    # Berries & gold pearls on rim
    for bx, by, col in [
        (0.36, 0.35, (206, 76, 86, 255)), (0.45, 0.34, (86, 102, 148, 255)),
        (0.55, 0.34, (206, 76, 86, 255)), (0.64, 0.35, (218, 172, 84, 255)),
        (0.28, 0.55, (206, 76, 86, 255)), (0.72, 0.55, (206, 76, 86, 255)),
    ]:
        rr = 8 * s
        d.ellipse([bx * w - rr, by * w - rr, bx * w + rr, by * w + rr], fill=col, outline=(146, 84, 72, 220), width=2 * s)

    # 3 slim gold candles + flames
    for cx_f, top_y in [(0.40, 0.18), (0.50, 0.14), (0.60, 0.18)]:
        cx = cx_f * w
        d.rounded_rectangle([cx - 5 * s, top_y * w, cx + 5 * s, w * 0.35], radius=3 * s, fill=(246, 226, 178, 255), outline=(182, 142, 74, 255), width=2 * s)
        fy = (top_y - 0.045) * w
        d.polygon([(cx, fy - 10 * s), (cx + 7 * s, fy + 4 * s), (cx, fy + 10 * s), (cx - 7 * s, fy + 4 * s)], fill=(250, 184, 62, 255))
        d.ellipse([cx - 3 * s, fy - 2 * s, cx + 3 * s, fy + 6 * s], fill=(255, 248, 212, 255))

    return apply_paper_grain(im.resize((size, size), Image.Resampling.LANCZOS), seed=88, strength=0.05)


def paint_watercolor_gift(size: int = 256) -> Image.Image:
    """Paint a 4x supersampled floral-wrapped gift box with crimson satin bow."""
    s = 4
    w = size * s
    im = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # Box body (warm ivory-cream paper with subtle sage dots)
    d.rounded_rectangle([w * 0.20, w * 0.37, w * 0.80, w * 0.86], radius=10 * s, fill=(248, 242, 230, 255), outline=(176, 148, 114, 255), width=3 * s)
    # Lid overhanging slightly
    d.rounded_rectangle([w * 0.17, w * 0.30, w * 0.83, w * 0.43], radius=8 * s, fill=(252, 247, 238, 255), outline=(176, 148, 114, 255), width=3 * s)

    # Subtle botanical sprigs on wrapping paper
    for gx, gy in [(0.29, 0.56), (0.68, 0.54), (0.31, 0.74), (0.69, 0.75)]:
        draw_leaf(d, gx * w, gy * w, -0.6, 26 * s, 9 * s, s)
        draw_leaf(d, gx * w, gy * w, -2.2, 22 * s, 8 * s, s)
        d.ellipse([gx * w - 5 * s, gy * w - 5 * s, gx * w + 5 * s, gy * w + 5 * s], fill=(214, 108, 112, 210))

    # Crimson & gold-edged vertical + horizontal ribbon
    rib_fill, rib_out = (176, 46, 52, 255), (124, 28, 32, 255)
    d.rectangle([w * 0.44, w * 0.30, w * 0.56, w * 0.86], fill=rib_fill, outline=rib_out, width=2 * s)
    d.rectangle([w * 0.20, w * 0.56, w * 0.80, w * 0.65], fill=rib_fill, outline=rib_out, width=2 * s)
    # Gold edge trim on vertical ribbon
    d.line([(w * 0.45, w * 0.31), (w * 0.45, w * 0.85)], fill=(228, 188, 106, 230), width=2 * s)
    d.line([(w * 0.55, w * 0.31), (w * 0.55, w * 0.85)], fill=(228, 188, 106, 230), width=2 * s)

    # Lush bow loops on top
    l_loop = [(w * 0.48, w * 0.28), (w * 0.27, w * 0.14), (w * 0.22, w * 0.28), (w * 0.46, w * 0.31)]
    r_loop = [(w * 0.52, w * 0.28), (w * 0.73, w * 0.14), (w * 0.78, w * 0.28), (w * 0.54, w * 0.31)]
    d.polygon(l_loop, fill=rib_fill, outline=rib_out)
    d.line(l_loop + [l_loop[0]], fill=rib_out, width=3 * s)
    d.polygon(r_loop, fill=rib_fill, outline=rib_out)
    d.line(r_loop + [r_loop[0]], fill=rib_out, width=3 * s)
    d.ellipse([w * 0.45, w * 0.23, w * 0.55, w * 0.33], fill=(192, 56, 62, 255), outline=rib_out, width=3 * s)

    return apply_paper_grain(im.resize((size, size), Image.Resampling.LANCZOS), seed=91, strength=0.05)


def paint_watercolor_envelope(size: int = 256) -> Image.Image:
    """Paint a 4x supersampled ivory cotton envelope with crimson heart wax seal."""
    s = 4
    w = size * s
    im = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    box = [w * 0.12, w * 0.26, w * 0.88, w * 0.76]
    d.rounded_rectangle(box, radius=10 * s, fill=(249, 244, 235, 255), outline=(184, 162, 134, 255), width=3 * s)
    # Bottom flap seams
    d.line([(w * 0.13, w * 0.75), (w * 0.50, w * 0.48), (w * 0.87, w * 0.75)], fill=(208, 188, 162, 230), width=3 * s)
    # Top triangular flap
    flap = [(w * 0.13, w * 0.27), (w * 0.87, w * 0.27), (w * 0.50, w * 0.55)]
    d.polygon(flap, fill=(252, 248, 241, 255), outline=(188, 166, 138, 255))
    d.line(flap, fill=(188, 166, 138, 255), width=3 * s)

    # Glossy red heart wax seal
    d.ellipse([w * 0.44, w * 0.47, w * 0.56, w * 0.59], fill=(176, 36, 40, 255), outline=(126, 22, 26, 255), width=2 * s)
    # Highlight crescent
    d.arc([w * 0.46, w * 0.49, w * 0.54, w * 0.57], 200, 310, fill=(238, 148, 148, 180), width=2 * s)

    return apply_paper_grain(im.resize((size, size), Image.Resampling.LANCZOS), seed=95, strength=0.05)


def paint_watercolor_balloon(size: int = 256) -> Image.Image:
    """Paint a 4x supersampled bouquet of pastel hot air / party balloons with gold ribbons."""
    s = 4
    w = size * s
    im = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # Ribbons down to tie knot
    knot = (w * 0.50, w * 0.74)
    for bx, by in [(w * 0.34, w * 0.44), (w * 0.66, w * 0.44), (w * 0.50, w * 0.36)]:
        d.line([(bx, by + 40 * s), knot], fill=(196, 158, 92, 230), width=2 * s)
    d.line([knot, (w * 0.44, w * 0.90)], fill=(196, 158, 92, 220), width=2 * s)
    d.line([knot, (w * 0.56, w * 0.89)], fill=(196, 158, 92, 220), width=2 * s)

    balloons = [
        (0.34, 0.40, 0.145, 0.175, (244, 198, 198, 255), (186, 128, 128, 255)),  # blush rose
        (0.66, 0.40, 0.145, 0.175, (206, 224, 240, 255), (138, 164, 188, 255)),  # powder blue
        (0.50, 0.30, 0.16, 0.195, (250, 232, 182, 255), (190, 152, 78, 255)),   # warm buttercream gold
    ]
    for fx, fy, rx, ry, fill, outl in balloons:
        cx, cy = fx * w, fy * w
        d.ellipse([cx - rx * w, cy - ry * w, cx + rx * w, cy + ry * w], fill=fill, outline=outl, width=3 * s)
        # Soft specular sheen
        d.ellipse([cx - rx * w * 0.55, cy - ry * w * 0.55, cx - rx * w * 0.15, cy - ry * w * 0.15], fill=(255, 255, 255, 130))
        # Tie nub
        d.polygon([(cx - 6 * s, cy + ry * w), (cx + 6 * s, cy + ry * w), (cx, cy + ry * w + 10 * s)], fill=fill, outline=outl)

    return apply_paper_grain(im.resize((size, size), Image.Resampling.LANCZOS), seed=99, strength=0.05)


def build_supersampled_stickers_and_brand(im_candlelight: Image.Image, im_garden: Image.Image):
    """Create crisp 256x256 transparent stickers and brand mark."""
    st_dir = ASSETS / "stickers"

    # 1. star-gold (tight crop + keep largest component)
    star_crop = im_candlelight.crop((395, 1005, 505, 1125))
    star_rgba = flood_extract_bg(star_crop, hard_dist=20, soft_dist=38, keep_largest=True)
    pad_square(star_rgba, 256, 0.10).save(st_dir / "star-gold.png")

    # 2. moon (tight crop avoiding corner leaf & arch border)
    moon_crop = im_candlelight.crop((74, 76, 254, 248))
    moon_rgba = flood_extract_bg(moon_crop, hard_dist=20, soft_dist=38, keep_largest=True)
    pad_square(moon_rgba, 256, 0.08).save(st_dir / "moon.png")

    # 3. bow (tight crop avoiding arch border)
    bow_crop = im_candlelight.crop((642, 68, 818, 266))
    bow_rgba = flood_extract_bg(bow_crop, hard_dist=18, soft_dist=36, keep_largest=True)
    pad_square(bow_rgba, 256, 0.08).save(st_dir / "bow.png")

    # 4. wreath (tight crop avoiding ribbon tips at top, preserve detached top stars/leaves)
    wreath_crop = im_garden.crop((364, 962, 532, 1122))
    wreath_rgba = flood_extract_bg(wreath_crop, hard_dist=18, soft_dist=36, keep_largest=False)
    pad_square(wreath_rgba, 256, 0.08).save(st_dir / "wreath.png")

    # 5-8. Clean 4x supersampled painterly watercolor stickers
    paint_watercolor_cake(256).save(st_dir / "cake.png")
    paint_watercolor_gift(256).save(st_dir / "gift.png")
    paint_watercolor_envelope(256).save(st_dir / "envelope.png")
    paint_watercolor_balloon(256).save(st_dir / "balloon.png")

    # 9. sparkles (4x supersampled gold sparkle cluster)
    s = 4
    w = 256 * s
    sp = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sp)
    stars_cfg = [
        (0.38, 0.36, 56, (230, 186, 94, 245), (178, 134, 52, 235)),
        (0.68, 0.28, 36, (242, 206, 120, 240), (186, 142, 60, 225)),
        (0.66, 0.64, 46, (226, 180, 88, 245), (174, 130, 50, 230)),
        (0.30, 0.70, 28, (240, 204, 122, 230), (180, 138, 56, 210)),
        (0.50, 0.50, 20, (248, 220, 144, 235), (190, 148, 66, 210)),
    ]
    for fx, fy, rad, fill, outl in stars_cfg:
        draw_8star(sd, fx * w, fy * w, rad * s, rad * 0.22 * s, rad * 0.45 * s, fill=fill, outline=outl, width=2 * s)
    for fx, fy, r in [(0.22, 0.48, 7), (0.52, 0.22, 8), (0.78, 0.46, 7), (0.48, 0.78, 8), (0.20, 0.24, 5), (0.76, 0.78, 6)]:
        cx, cy, rr = fx * w, fy * w, r * s
        sd.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(232, 188, 96, 225))
    sp.resize((256, 256), Image.Resampling.LANCZOS).save(st_dir / "sparkles.png")

    # 10. candle (4x supersampled painterly cream & gold striped birthday candle)
    cd = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    halo = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    ImageDraw.Draw(halo).ellipse([w * 0.34, w * 0.05, w * 0.66, w * 0.37], fill=(255, 215, 118, 95))
    cd = Image.alpha_composite(cd, halo.filter(ImageFilter.GaussianBlur(radius=18 * s)))
    cdd = ImageDraw.Draw(cd)
    cdd.polygon([(w * 0.50, w * 0.09), (w * 0.56, w * 0.21), (w * 0.54, w * 0.28), (w * 0.50, w * 0.30), (w * 0.46, w * 0.28), (w * 0.44, w * 0.21)], fill=(246, 178, 66, 250), outline=(196, 126, 36, 240))
    cdd.polygon([(w * 0.50, w * 0.14), (w * 0.53, w * 0.22), (w * 0.50, w * 0.28), (w * 0.47, w * 0.22)], fill=(255, 245, 198, 255))
    cdd.line([(w * 0.50, w * 0.29), (w * 0.50, w * 0.34)], fill=(112, 84, 58, 255), width=3 * s)
    bx0, by0, bx1, by1 = w * 0.42, w * 0.33, w * 0.58, w * 0.86
    cdd.rounded_rectangle([bx0, by0, bx1, by1], radius=10 * s, fill=(250, 244, 232, 255), outline=(182, 146, 94, 255), width=2 * s)
    for i in range(6):
        sy = by0 + (i * 0.085 + 0.04) * w
        cdd.polygon([(bx0 + 3 * s, sy), (bx1 - 3 * s, sy - 0.045 * w), (bx1 - 3 * s, sy - 0.015 * w), (bx0 + 3 * s, sy + 0.03 * w)], fill=(218, 176, 92, 220))
    cdd.ellipse([bx0 - 2 * s, by0 - 4 * s, bx1 + 2 * s, by0 + 16 * s], fill=(253, 249, 242, 255), outline=(182, 146, 94, 240), width=2 * s)
    cdd.rounded_rectangle([w * 0.36, w * 0.84, w * 0.64, w * 0.90], radius=6 * s, fill=(214, 174, 96, 255), outline=(154, 114, 48, 255), width=2 * s)
    draw_8star(cdd, w * 0.31, w * 0.20, 14 * s, 4 * s, 7 * s, fill=(228, 184, 94, 235))
    draw_8star(cdd, w * 0.70, w * 0.24, 11 * s, 3.2 * s, 5.5 * s, fill=(228, 184, 94, 225))
    apply_paper_grain(cd.resize((256, 256), Image.Resampling.LANCZOS), seed=61).save(st_dir / "candle.png")

    # 11. crown
    cr = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    crd = ImageDraw.Draw(cr)
    pts = [(w * 0.19, w * 0.72), (w * 0.14, w * 0.35), (w * 0.33, w * 0.52), (w * 0.50, w * 0.26), (w * 0.67, w * 0.52), (w * 0.86, w * 0.35), (w * 0.81, w * 0.72)]
    crd.polygon(pts, fill=(226, 184, 98, 255), outline=(162, 118, 44, 255))
    crd.line(pts + [pts[0]], fill=(162, 118, 44, 255), width=3 * s)
    in_pts = [(w * 0.24, w * 0.67), (w * 0.20, w * 0.43), (w * 0.35, w * 0.57), (w * 0.50, w * 0.34), (w * 0.65, w * 0.57), (w * 0.80, w * 0.43), (w * 0.76, w * 0.67)]
    crd.polygon(in_pts, fill=(242, 208, 128, 240))
    crd.rounded_rectangle([w * 0.18, w * 0.66, w * 0.82, w * 0.76], radius=6 * s, fill=(214, 168, 80, 255), outline=(154, 110, 40, 255), width=3 * s)
    for px, py, r in [(0.14, 0.34, 11), (0.50, 0.24, 14), (0.86, 0.34, 11)]:
        rr = r * s
        crd.ellipse([px * w - rr, py * w - rr, px * w + rr, py * w + rr], fill=(252, 246, 236, 255), outline=(176, 134, 62, 255), width=2 * s)
    crd.ellipse([w * 0.46, w * 0.67, w * 0.54, w * 0.75], fill=(224, 128, 136, 255), outline=(156, 98, 42, 255), width=2 * s)
    apply_paper_grain(cr.resize((256, 256), Image.Resampling.LANCZOS), seed=62).save(st_dir / "crown.png")

    # 12. cupcake
    cc = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    ccd = ImageDraw.Draw(cc)
    liner_pts = [(w * 0.28, w * 0.54), (w * 0.72, w * 0.54), (w * 0.64, w * 0.86), (w * 0.36, w * 0.86)]
    ccd.polygon(liner_pts, fill=(244, 218, 214, 255), outline=(178, 132, 124, 255))
    ccd.line(liner_pts + [liner_pts[0]], fill=(178, 132, 124, 255), width=3 * s)
    for t in [0.22, 0.40, 0.60, 0.78]:
        ccd.line([(w * (0.28 + t * 0.44), w * 0.55), (w * (0.36 + t * 0.28), w * 0.85)], fill=(208, 156, 148, 210), width=2 * s)
    for box, fill, outl in [
        ([0.23, 0.42, 0.77, 0.60], (252, 238, 232, 255), (192, 150, 140, 240)),
        ([0.28, 0.31, 0.72, 0.49], (255, 244, 238, 255), (192, 150, 140, 235)),
        ([0.35, 0.23, 0.65, 0.39], (255, 250, 246, 255), (192, 150, 140, 230)),
    ]:
        ccd.ellipse([box[0] * w, box[1] * w, box[2] * w, box[3] * w], fill=fill, outline=outl, width=3 * s)
    for sx, sy in [(0.34, 0.47), (0.45, 0.51), (0.58, 0.48), (0.64, 0.43), (0.40, 0.38), (0.55, 0.35)]:
        ccd.ellipse([sx * w - 4 * s, sy * w - 4 * s, sx * w + 4 * s, sy * w + 4 * s], fill=(222, 174, 86, 255))
    ccd.rounded_rectangle([w * 0.475, w * 0.14, w * 0.525, w * 0.27], radius=3 * s, fill=(232, 186, 98, 255), outline=(168, 124, 52, 255), width=2 * s)
    ccd.polygon([(w * 0.50, w * 0.05), (w * 0.535, w * 0.115), (w * 0.50, w * 0.145), (w * 0.465, w * 0.115)], fill=(248, 184, 68, 255))
    apply_paper_grain(cc.resize((256, 256), Image.Resampling.LANCZOS), seed=63).save(st_dir / "cupcake.png")

    # 13. Brand mark
    bm = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    bmd = ImageDraw.Draw(bm)
    left_poly = [(w * 0.18, w * 0.22), (w * 0.48, w * 0.16), (w * 0.48, w * 0.80), (w * 0.18, w * 0.88)]
    right_poly = [(w * 0.48, w * 0.16), (w * 0.82, w * 0.24), (w * 0.82, w * 0.86), (w * 0.48, w * 0.80)]
    bmd.polygon(left_poly, fill=(166, 44, 48, 255), outline=(112, 26, 30, 255))
    bmd.line(left_poly + [left_poly[0]], fill=(112, 26, 30, 255), width=4 * s)
    bmd.polygon(right_poly, fill=(248, 242, 232, 255), outline=(166, 138, 108, 255))
    bmd.line(right_poly + [right_poly[0]], fill=(166, 138, 108, 255), width=4 * s)
    bmd.rounded_rectangle([w * 0.23, w * 0.28, w * 0.43, w * 0.72], radius=14 * s, fill=(246, 238, 224, 255), outline=(216, 174, 92, 255), width=3 * s)
    bmd.rectangle([w * 0.28, w * 0.54, w * 0.38, w * 0.64], fill=(238, 194, 186, 255), outline=(176, 118, 110, 255), width=2 * s)
    bmd.line([(w * 0.33, w * 0.47), (w * 0.33, w * 0.54)], fill=(214, 172, 82, 255), width=3 * s)
    bmd.ellipse([w * 0.315, w * 0.42, w * 0.345, w * 0.46], fill=(248, 188, 72, 255))
    draw_8star(bmd, w * 0.65, w * 0.48, 26 * s, 7 * s, 13 * s, fill=(224, 178, 88, 255), outline=(168, 124, 44, 255), width=2 * s)
    bm.resize((256, 256), Image.Resampling.LANCZOS).save(ASSETS / "brand" / "mark.png")


def build_emblems(im_sky: Image.Image):
    """Build 4 crisp 512x512 transparent inside-left emblems."""
    size = 512
    st_dir = ASSETS / "stickers"
    star = Image.open(st_dir / "star-gold.png")
    moon = Image.open(st_dir / "moon.png")
    wreath = Image.open(st_dir / "wreath.png")

    # 1. candlelight-wish emblem: clean moon + gold starburst
    em1 = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    moon_lg = moon.resize((330, 330), Image.Resampling.LANCZOS)
    star_sm = star.resize((138, 138), Image.Resampling.LANCZOS)
    em1.paste(moon_lg, (70, 74), moon_lg)
    em1.paste(star_sm, (268, 258), star_sm)
    em1.save(ASSETS / "cards" / "candlelight-wish" / "emblem.png")

    # 2. garden-tea emblem: clean floral wreath + gold star centered
    em2 = wreath.resize((size, size), Image.Resampling.LANCZOS).copy()
    star_in = star.resize((132, 132), Image.Resampling.LANCZOS)
    em2.paste(star_in, ((size - 132) // 2, (size - 132) // 2 + 8), star_in)
    em2.save(ASSETS / "cards" / "garden-tea" / "emblem.png")

    # 3. patisserie-window emblem: clean gilded medallion + painted watercolor roses/leaves + satin bow + gold star
    s = 2
    ms = size * s
    med = Image.new("RGBA", (ms, ms), (0, 0, 0, 0))
    md = ImageDraw.Draw(med)
    cx, cy = ms // 2, ms // 2 + 24 * s
    r_out, r_in = 152 * s, 112 * s
    md.ellipse([cx - r_out, cy - r_out, cx + r_out, cy + r_out], fill=(224, 182, 96, 240), outline=(168, 126, 48, 255), width=4 * s)
    md.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=(252, 248, 242, 248), outline=(182, 140, 60, 255), width=3 * s)
    # Lush botanical sprigs & roses flanking left/right/bottom of medallion
    for lx, ly, ang in [
        (0.24, 0.56, -2.5), (0.21, 0.66, -2.9), (0.28, 0.72, 2.5),
        (0.76, 0.56, -0.6), (0.79, 0.66, -0.2), (0.72, 0.72, 0.6),
    ]:
        draw_leaf(md, lx * ms, ly * ms, ang, 62 * s, 18 * s, s)
    draw_watercolor_rose(md, ms * 0.25, ms * 0.63, 44 * s, s, "blush")
    draw_watercolor_rose(md, ms * 0.34, ms * 0.73, 34 * s, s, "cream")
    draw_watercolor_rose(md, ms * 0.75, ms * 0.63, 44 * s, s, "blush")
    draw_watercolor_rose(md, ms * 0.66, ms * 0.73, 34 * s, s, "cream")

    em3 = apply_paper_grain(med.resize((size, size), Image.Resampling.LANCZOS), seed=67, strength=0.04)
    bow_top = pad_square(flood_extract_bg(im_sky.crop((344, 144, 552, 314)), bg_rgb=(204, 222, 240), hard_dist=18, soft_dist=36, keep_largest=True), 192, 0.04)
    star_c = star.resize((148, 148), Image.Resampling.LANCZOS)
    em3.paste(bow_top, ((size - 192) // 2, 24), bow_top)
    em3.paste(star_c, ((size - 148) // 2, (size - 148) // 2 + 24), star_c)
    em3.save(ASSETS / "cards" / "patisserie-window" / "emblem.png")

    # 4. sky-balloons emblem: layered paper-cut starburst medallion
    rosette = Image.new("RGBA", (ms, ms), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rosette)
    rc = ms // 2
    for layer_r, lobes, fill, outl in [
        (188 * s, 16, (198, 218, 236, 255), (156, 182, 206, 255)),
        (148 * s, 12, (248, 242, 230, 255), (206, 184, 142, 255)),
        (110 * s, 12, (226, 236, 246, 255), (176, 194, 214, 255)),
    ]:
        pts = []
        for i in range(lobes * 6):
            ang = (i / (lobes * 6)) * 2 * math.pi
            scallop = abs(math.sin(ang * lobes * 0.5))
            rad = layer_r * (0.86 + 0.14 * scallop)
            pts.append((rc + math.cos(ang) * rad, rc + math.sin(ang) * rad))
        rd.polygon(pts, fill=fill, outline=outl)
        rd.line(pts + [pts[0]], fill=outl, width=3 * s)
    em4 = apply_paper_grain(rosette.resize((size, size), Image.Resampling.LANCZOS), seed=68, strength=0.04)
    star_sky = pad_square(flood_extract_bg(im_sky.crop((400, 935, 502, 1052)), bg_rgb=(204, 222, 240), hard_dist=18, soft_dist=36, keep_largest=True), 160, 0.05)
    em4.paste(star_sky, ((size - 160) // 2, (size - 160) // 2), star_sky)
    em4.save(ASSETS / "cards" / "sky-balloons" / "emblem.png")


def build_patisserie_cover(im_sky: Image.Image):
    """Compose a cohesive crimson Parisian birthday patisserie cover (780x1080) with clean layered silhouettes."""
    w, h = COVER_SIZE
    noise = value_noise_2d(1080, 96, 515)[:h, :w]
    grain = value_noise_2d(1080, 256, 516)[:h, :w]
    base = np.zeros((h, w, 3), dtype=np.float32)
    base[:, :, 0] = 142.0 + (noise - 0.5) * 18.0 + (grain - 0.5) * 8.0
    base[:, :, 1] = 29.0 + (noise - 0.5) * 7.0 + (grain - 0.5) * 4.0
    base[:, :, 2] = 35.0 + (noise - 0.5) * 8.0 + (grain - 0.5) * 4.0
    card = Image.fromarray(base.clip(0, 255).astype(np.uint8), mode="RGB").convert("RGBA")

    draw = ImageDraw.Draw(card)
    draw.rectangle([28, 28, w - 28, h - 28], outline=(214, 174, 96, 230), width=3)
    draw.rectangle([38, 38, w - 38, h - 38], outline=(198, 156, 82, 180), width=1)

    sky_bg = (204, 222, 240)
    corner_boxes = [
        ((15, 15, 180, 175), (34, 34)),
        ((715, 15, 880, 175), (w - 34 - 135, 34)),
        ((15, 1020, 180, 1185), (34, h - 34 - 135)),
        ((715, 1020, 880, 1185), (w - 34 - 135, h - 34 - 135)),
    ]
    for box, pos in corner_boxes:
        cf = flood_extract_bg(im_sky.crop(box), bg_rgb=sky_bg, hard_dist=18, soft_dist=36)
        cf = ImageEnhance.Brightness(cf).enhance(1.12).resize((135, 135), Image.Resampling.LANCZOS)
        card.paste(cf, pos, cf)

    # Shopfront window with warm golden bakery glow gradient
    win_l, win_t, win_r, win_b = 112, 185, w - 112, 855
    win_bg = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(win_bg)
    wd.rounded_rectangle([win_l - 14, win_t - 12, win_r + 14, win_b + 38], radius=18, fill=(246, 238, 224, 255), outline=(198, 158, 86, 255), width=3)
    for row in range(win_t, win_b):
        t = (row - win_t) / max(1, (win_b - win_t))
        r_c = int(112 + 122 * math.sin(t * math.pi * 0.85))
        g_c = int(76 + 98 * math.sin(t * math.pi * 0.85))
        b_c = int(48 + 56 * math.sin(t * math.pi * 0.85))
        wd.line([(win_l, row), (win_r, row)], fill=(r_c, g_c, b_c, 255))
    # Soft warm bokeh glow behind cake
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([w * 0.25, 290, w * 0.75, 760], fill=(255, 228, 165, 110))
    win_bg = Image.alpha_composite(win_bg, glow.filter(ImageFilter.GaussianBlur(radius=32)))
    wd = ImageDraw.Draw(win_bg)
    for mx in [win_l + (win_r - win_l) // 3, win_l + 2 * (win_r - win_l) // 3]:
        wd.rectangle([mx - 5, win_t, mx + 5, win_b], fill=(242, 232, 214, 215))
    for my in [win_t + 195, win_t + 405]:
        wd.rectangle([win_l, my - 5, win_r, my + 5], fill=(242, 232, 214, 215))
    card = Image.alpha_composite(card, win_bg)

    # Clean, zero-halo watercolor cake centered inside window
    cake = Image.open(ASSETS / "stickers" / "cake.png").resize((390, 390), Image.Resampling.LANCZOS)
    card.paste(cake, ((w - 390) // 2, 415), cake)

    # Window sill
    sd = ImageDraw.Draw(card)
    sd.rounded_rectangle([win_l - 28, win_b - 6, win_r + 28, win_b + 48], radius=8, fill=(246, 239, 226, 255), outline=(190, 150, 82, 255), width=3)
    sd.line([(win_l - 20, win_b + 12), (win_r + 20, win_b + 12)], fill=(214, 178, 114, 200), width=2)

    # Striped crimson & cream scalloped awning
    aw_l, aw_r, aw_t, aw_b = win_l - 28, win_r + 28, 128, 224
    stripes = 11
    sw_step = (aw_r - aw_l) / stripes
    for i in range(stripes):
        sx0 = aw_l + i * sw_step
        sx1 = sx0 + sw_step + 1
        col = (164, 34, 40, 255) if i % 2 == 0 else (249, 242, 230, 255)
        sd.polygon([(sx0 + 10, aw_t), (sx1 + 6, aw_t), (sx1, aw_b - 18), (sx0, aw_b - 18)], fill=col)
        sd.pieslice([sx0, aw_b - 36, sx1, aw_b], 0, 180, fill=col, outline=(190, 150, 84, 220))
    sd.line([(aw_l + 10, aw_t), (aw_r + 6, aw_t)], fill=(214, 174, 96, 255), width=4)

    # Clean supersampled watercolor botanical corners on window sill + gift + cupcake + satin bow
    sill_florals = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fd = ImageDraw.Draw(sill_florals)
    for lx, ly, ang in [(112, 842, -2.5), (146, 825, -1.9), (168, 864, -0.4), (668, 842, -0.6), (634, 825, -1.2), (612, 864, -2.7)]:
        draw_leaf(fd, lx, ly, ang, 46, 14, 1)
    draw_watercolor_rose(fd, 134, 844, 32, 1, "blush")
    draw_watercolor_rose(fd, 176, 866, 24, 1, "cream")
    draw_watercolor_rose(fd, 646, 844, 32, 1, "blush")
    draw_watercolor_rose(fd, 604, 866, 24, 1, "cream")
    card = Image.alpha_composite(card, sill_florals)

    gift_box = Image.open(ASSETS / "stickers" / "gift.png").resize((126, 126), Image.Resampling.LANCZOS)
    cupcake = Image.open(ASSETS / "stickers" / "cupcake.png").resize((112, 112), Image.Resampling.LANCZOS)
    bow_top = pad_square(flood_extract_bg(im_sky.crop((344, 144, 552, 314)), bg_rgb=sky_bg, hard_dist=18, soft_dist=36, keep_largest=True), 192, 0.04)

    card.paste(cupcake, (186, 772), cupcake)
    card.paste(gift_box, (476, 762), gift_box)
    card.paste(bow_top, ((w - 192) // 2, 46), bow_top)

    sd = ImageDraw.Draw(card)
    for fx in range(win_l + 18, win_r - 10, 44):
        fy = int(228 + 10 * math.sin((fx - win_l) * 0.05))
        sd.ellipse([fx - 5, fy - 5, fx + 5, fy + 5], fill=(255, 228, 134, 240))
    star_bot = Image.open(ASSETS / "stickers" / "star-gold.png").resize((92, 92), Image.Resampling.LANCZOS)
    card.paste(star_bot, ((w - 92) // 2, 924), star_bot)

    out_dir = ASSETS / "cards" / "patisserie-window"
    final = card.convert("RGB")
    final.save(out_dir / "cover.png")
    final.resize(THUMB_SIZE, Image.Resampling.LANCZOS).save(out_dir / "thumb.png")
    make_foil_mask(final).save(out_dir / "foil.png")


def build_qa_contact_sheet():
    """Render all assets over a soft checkerboard so transparency and edges are easy to inspect."""
    w, h = 1520, 1120
    sheet = Image.new("RGB", (w, h), (234, 230, 222))
    arr = np.asarray(sheet).copy()
    yy, xx = np.mgrid[0:h, 0:w]
    checker = ((xx // 16) + (yy // 16)) % 2 == 0
    arr[checker & (xx >= 540)] = [244, 241, 235]
    sheet = Image.fromarray(arr, mode="RGB")

    cards = ["candlelight-wish", "garden-tea", "patisserie-window", "sky-balloons"]
    for idx, cid in enumerate(cards):
        cov = Image.open(ASSETS / "cards" / cid / "cover.png").resize((175, 242), Image.Resampling.LANCZOS)
        sheet.paste(cov, (30 + (idx % 2) * 200, 30 + (idx // 2) * 265))

        emb = Image.open(ASSETS / "cards" / cid / "emblem.png").resize((150, 150), Image.Resampling.LANCZOS)
        sheet.paste(emb, (560 + (idx % 2) * 180, 30 + (idx // 2) * 180), emb)

    bm = Image.open(ASSETS / "brand" / "mark.png").resize((140, 140), Image.Resampling.LANCZOS)
    sheet.paste(bm, (560, 410), bm)
    lin = Image.open(ASSETS / "textures" / "lining-crimson-stars.png").resize((150, 150), Image.Resampling.LANCZOS)
    sheet.paste(lin, (740, 410))

    stickers = [
        "star-gold", "sparkles", "cake", "candle",
        "balloon", "gift", "bow", "moon",
        "cupcake", "wreath", "envelope", "crown",
    ]
    for idx, sid in enumerate(stickers):
        st = Image.open(ASSETS / "stickers" / f"{sid}.png").resize((135, 135), Image.Resampling.LANCZOS)
        sheet.paste(st, (945 + (idx % 4) * 140, 30 + (idx // 4) * 155), st)

    for idx, cid in enumerate(cards):
        fl = Image.open(ASSETS / "cards" / cid / "foil.png").convert("RGB").resize((120, 166), Image.Resampling.LANCZOS)
        sheet.paste(fl, (30 + idx * 140, 620))

    sheet.paste(Image.open(ASSETS / "textures" / "kraft-albedo.png").resize((160, 160), Image.Resampling.LANCZOS), (620, 620))
    sheet.paste(Image.open(ASSETS / "textures" / "watercolor-normal.png").resize((160, 160), Image.Resampling.LANCZOS), (800, 620))

    sheet.save(RAW / "qa_contact_sheet.png")


def build_relief_normal(cover_rgb: Image.Image, foil_gray: Image.Image, wc_normal: Image.Image, out_path: Path):
    """Combine tileable cold-press cotton grain with embossed illustration luminance & gold foil relief."""
    w, h = cover_rgb.size
    # Tile 512x512 watercolor normal map cleanly
    tiles_x = (w + wc_normal.width - 1) // wc_normal.width
    tiles_y = (h + wc_normal.height - 1) // wc_normal.height
    tiled = Image.new("RGB", (tiles_x * wc_normal.width, tiles_y * wc_normal.height))
    for ty in range(tiles_y):
        for tx in range(tiles_x):
            tiled.paste(wc_normal, (tx * wc_normal.width, ty * wc_normal.height))
    base_n = np.asarray(tiled.crop((0, 0, w, h)), dtype=np.float32) / 255.0 * 2.0 - 1.0

    lum = np.asarray(cover_rgb.convert("L").filter(ImageFilter.GaussianBlur(radius=1.6)), dtype=np.float32) / 255.0
    foil = np.asarray(foil_gray.filter(ImageFilter.GaussianBlur(radius=1.2)), dtype=np.float32) / 255.0
    height = lum * 0.45 + foil * 0.95

    gx = np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)
    gy = np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)
    dx = base_n[:, :, 0] * 0.65 - gx * 2.2
    dy = base_n[:, :, 1] * 0.65 + gy * 2.2
    dz = np.maximum(0.4, base_n[:, :, 2])
    norm = np.sqrt(dx * dx + dy * dy + dz * dz)
    rgb = np.stack([
        ((dx / norm) * 0.5 + 0.5) * 255.0,
        ((dy / norm) * 0.5 + 0.5) * 255.0,
        ((dz / norm) * 0.5 + 0.5) * 255.0,
    ], axis=-1).clip(0, 255).astype(np.uint8)
    Image.fromarray(rgb, mode="RGB").save(out_path)


def save_tight_prop(rgba: Image.Image, out_path: Path, full_w: int = 780, full_h: int = 1080, crop_box: tuple[int, int, int, int] = (0, 0, 780, 1080), pivot_px: tuple[float, float] | None = None) -> dict:
    """Save a cropped RGBA prop and return normalized 3D placement metadata."""
    bbox = rgba.getbbox()
    if not bbox:
        rgba.save(out_path)
        return {"url": str(out_path), "u": 0.5, "v": 0.5, "w": 0.2, "h": 0.2, "pivotU": 0.5, "pivotV": 0.5}
    trimmed = rgba.crop(bbox)
    trimmed.save(out_path)
    x0 = crop_box[0] + bbox[0]
    y0 = crop_box[1] + bbox[1]
    x1 = crop_box[0] + bbox[2]
    y1 = crop_box[1] + bbox[3]
    cx = (x0 + x1) * 0.5 / full_w
    cy = (y0 + y1) * 0.5 / full_h
    pw = (x1 - x0) / full_w
    ph = (y1 - y0) / full_h
    if pivot_px is not None:
        pu = (pivot_px[0] - x0) / max(1.0, (x1 - x0))
        pv = (pivot_px[1] - y0) / max(1.0, (y1 - y0))
    else:
        pu, pv = 0.5, 0.5
    return {"cx": round(cx, 4), "cy": round(cy, 4), "w": round(pw, 4), "h": round(ph, 4), "pivotX": round(pu, 4), "pivotY": round(pv, 4)}


def extract_arch_mask(w: int, h: int, cx: float, cy: float, r: float, bottom: float, feather: float = 2.0) -> np.ndarray:
    """Return float mask [0..1] inside a classic rounded arch aperture."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # Signed distance inside arch: negative = inside, positive = outside
    d_top = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) - r
    d_rect = np.maximum(np.abs(xx - cx) - r, yy - bottom)
    sd = np.where(yy < cy, d_top, d_rect)
    return np.clip((-sd) / max(0.5, feather) + 0.5, 0.0, 1.0)


def _keep_largest_component(fg: np.ndarray) -> np.ndarray:
    """Return boolean mask containing only the largest 8-connected foreground component."""
    h, w = fg.shape
    comp = np.zeros((h, w), dtype=np.int32)
    best_id, best_area, cid = 0, 0, 0
    for sy in range(h):
        for sx in range(w):
            if fg[sy, sx] and comp[sy, sx] == 0:
                cid += 1
                cq = deque([(sy, sx)])
                comp[sy, sx] = cid
                area = 0
                while cq:
                    yy, xx = cq.popleft()
                    area += 1
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = yy + dy, xx + dx
                            if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and comp[ny, nx] == 0:
                                comp[ny, nx] = cid
                                cq.append((ny, nx))
                if area > best_area:
                    best_area = area
                    best_id = cid
    if best_id == 0:
        return fg
    return comp == best_id


def _border_reachable(cand: np.ndarray) -> np.ndarray:
    """Return boolean mask of pixels in `cand` 4-connected to the crop perimeter."""
    h, w = cand.shape
    vis = np.zeros((h, w), dtype=bool)
    q = deque()

    def push(y: int, x: int):
        if cand[y, x] and not vis[y, x]:
            vis[y, x] = True
            q.append((y, x))

    for x in range(w):
        push(0, x)
        push(h - 1, x)
    for y in range(h):
        push(y, 0)
        push(y, w - 1)

    while q:
        cy, cx = q.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not vis[ny, nx]:
                vis[ny, nx] = True
                q.append((ny, nx))
    return vis


def inpaint_horizontal_ovals(rgb_arr: np.ndarray, ovals: list[tuple[float, float, float, float]]) -> np.ndarray:
    """Smoothly replace foreground ovals in sky backdrop using union mask + feathered neighbor interpolation."""
    h, w, _ = rgb_arr.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    union_mask = np.zeros((h, w), dtype=bool)
    for cx, cy, rx, ry in ovals:
        union_mask |= (((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2) <= 1.0

    dil_im = Image.fromarray((union_mask.astype(np.uint8) * 255), mode="L").filter(ImageFilter.MaxFilter(9))
    dil_mask = np.asarray(dil_im) > 127

    filled = rgb_arr.astype(np.float32).copy()
    for y in range(h):
        row = dil_mask[y]
        if not np.any(row):
            continue
        padded = np.concatenate([[False], row, [False]])
        starts = np.where(~padded[:-1] & padded[1:])[0]
        ends = np.where(padded[:-1] & ~padded[1:])[0] - 1
        for c0, c1 in zip(starts, ends):
            ls0, ls1 = max(0, c0 - 10), max(0, c0 - 2)
            rs0, rs1 = min(w, c1 + 3), min(w, c1 + 11)
            left_slice = rgb_arr[y, ls0:ls1] if ls1 > ls0 else rgb_arr[y, max(0, c0 - 1):max(1, c0)]
            right_slice = rgb_arr[y, rs0:rs1] if rs1 > rs0 else rgb_arr[y, min(w - 1, c1 + 1):min(w, c1 + 2)]
            c_left = left_slice.mean(axis=0) if len(left_slice) else rgb_arr[y, max(0, c0 - 1)]
            c_right = right_slice.mean(axis=0) if len(right_slice) else rgb_arr[y, min(w - 1, c1 + 1)]
            cols = np.arange(c0, c1 + 1, dtype=np.float32)
            t = (cols - max(0, c0 - 4)) / max(1.0, (min(w - 1, c1 + 4) - max(0, c0 - 4)))
            t = np.clip(t, 0.0, 1.0)[:, None]
            filled[y, c0:c1 + 1] = c_left[None, :] * (1.0 - t) + c_right[None, :] * t

    filled_blur = np.asarray(
        Image.fromarray(filled.clip(0, 255).astype(np.uint8), mode="RGB").filter(ImageFilter.GaussianBlur(radius=3.5)),
        dtype=np.float32,
    )
    feather = np.asarray(
        Image.fromarray((dil_mask.astype(np.uint8) * 255), mode="L").filter(ImageFilter.GaussianBlur(radius=2.5)),
        dtype=np.float32,
    ) / 255.0
    out = rgb_arr.astype(np.float32) * (1.0 - feather[:, :, None]) + filled_blur * feather[:, :, None]
    return out.clip(0, 255).astype(np.uint8)


def extract_balloon_silhouette(im_rgb: Image.Image, cx: int, cy: int, rx: int, ry: int, basket_y1: int, crop_box: tuple[int, int, int, int]) -> Image.Image:
    """Cleanly isolate a hot air balloon (teardrop envelope + ropes + basket) without surrounding cloud bleed."""
    x0, y0, x1, y1 = crop_box
    crop = im_rgb.crop(crop_box).convert("RGBA")
    arr = np.asarray(crop).copy()
    h, w, _ = arr.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    px = xx + x0
    py = yy + y0

    # Balloon dome + tapered lower cone
    dy = py - cy
    scale_x = np.where(dy > 0, np.maximum(0.28, 1.0 - (dy / (ry * 1.48)) * 0.72), 1.0)
    ell = ((px - cx) / (rx * scale_x)) ** 2 + np.where(dy < 0, (dy / ry) ** 2, (dy / (ry * 1.38)) ** 2)
    dome_a = np.clip((1.03 - ell) * 18.0, 0.0, 1.0)

    # Basket rectangle + subtle rope triangle connecting dome bottom (cy + ry*1.2) to basket
    b_top = cy + ry * 1.15
    rope_half_w = np.where(py < b_top, 18.0, 13.0)
    in_lower = (py >= cy + ry * 0.85) & (py <= basket_y1) & (np.abs(px - cx) <= rope_half_w)
    lower_a = np.where(in_lower, 1.0, 0.0)

    # Color-key pale sky inside the rope gap (between dome & basket)
    rgb = arr[:, :, :3].astype(np.float32)
    is_sky = (rgb[:, :, 2] > 218) & (rgb[:, :, 0] > 195) & (rgb[:, :, 1] > 205) & (py > cy + ry * 0.96) & (py < basket_y1 - 14)
    alpha = np.maximum(dome_a, lower_a) * np.where(is_sky, 0.0, 1.0)
    arr[:, :, 3] = (alpha * 255.0).clip(0, 255).astype(np.uint8)
    out = Image.fromarray(arr, mode="RGBA")
    # Mildly feather alpha edge
    a = out.split()[3].filter(ImageFilter.GaussianBlur(0.5))
    out.putalpha(a)
    return out


def build_3d_layers(im_sky_raw: Image.Image):
    """Generate per-card relief normal maps and 3D shadowbox cutout layers."""
    w, h = COVER_SIZE
    wc_normal = Image.open(ASSETS / "textures" / "watercolor-normal.png").convert("RGB")

    # Generate relief-normal.png for all 4 covers
    for cid in ["candlelight-wish", "garden-tea", "patisserie-window", "sky-balloons"]:
        card_dir = ASSETS / "cards" / cid
        cov = Image.open(card_dir / "cover.png").convert("RGB")
        foil = Image.open(card_dir / "foil.png").convert("L")
        build_relief_normal(cov, foil, wc_normal, card_dir / "relief-normal.png")
        (card_dir / "layers").mkdir(parents=True, exist_ok=True)

    # ------------------------------------------------------------------
    # 1. candlelight-wish: Recessed starry sky + floating cake + moon/bells/ribbon/star
    # ------------------------------------------------------------------
    c1_dir = ASSETS / "cards" / "candlelight-wish"
    c1_layers = c1_dir / "layers"
    c1 = Image.open(c1_dir / "cover.png").convert("RGB")
    c1_arr = np.asarray(c1, dtype=np.float32)

    arch1 = extract_arch_mask(w, h, cx=390, cy=374, r=216, bottom=768, feather=2.0)
    sky_arr = c1_arr.copy()
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    rng = np.random.default_rng(771)
    sky_fill = np.zeros_like(sky_arr)
    sky_fill[:, :, 0] = 16.0 + 18.0 * np.clip((yy - 360) / 420.0, 0, 1)
    sky_fill[:, :, 1] = 36.0 + 30.0 * np.clip((yy - 360) / 420.0, 0, 1)
    sky_fill[:, :, 2] = 68.0 + 38.0 * np.clip((yy - 360) / 420.0, 0, 1)
    for _ in range(95):
        sx = int(rng.integers(180, 600))
        sy = int(rng.integers(380, 760))
        sky_fill[sy - 1:sy + 2, sx - 1:sx + 2] = [248, 236, 198]
    cake_region = np.clip((yy - 395.0) / 36.0, 0.0, 1.0) * (1.0 - np.clip((np.abs(xx - 390) - 210) / 10.0, 0, 1))
    sky_arr = sky_arr * (1.0 - cake_region[:, :, None]) + sky_fill * cake_region[:, :, None]
    sky_bleed = extract_arch_mask(w, h, cx=390, cy=374, r=248, bottom=796, feather=2.0)
    outside_arch = (arch1 < 0.5) & (sky_bleed > 0.1)
    sky_arr[outside_arch] = [18.0, 38.0, 72.0]
    sky_rgba = Image.fromarray(sky_arr.clip(0, 255).astype(np.uint8), mode="RGB").convert("RGBA")
    sky_rgba.putalpha(Image.fromarray((sky_bleed * 255).astype(np.uint8), mode="L"))
    sky_rgba.save(c1_layers / "bg.png")

    ribbon_keep = (yy > 734) & (np.abs(xx - 390) < 320)
    cut1 = arch1 * np.where(ribbon_keep, 0.0, 1.0)
    frame1_alpha = np.clip((1.0 - cut1) * 255.0, 0, 255).astype(np.uint8)
    frame1 = c1.convert("RGBA")
    frame1.putalpha(Image.fromarray(frame1_alpha, mode="L"))
    frame1.save(c1_layers / "frame.png")

    # Mid-depth glowing cake + cloud table inside arch (border flood-fill from dark navy)
    cake1_box = (210, 392, 570, 788)
    cake1_crop = c1.crop(cake1_box)
    cake1_p = flood_extract_bg(cake1_crop, bg_rgb=(16.0, 36.0, 68.0), hard_dist=42, soft_dist=72, keep_largest=True)
    c1a = np.asarray(cake1_p).copy()
    cyy, _cxx = np.mgrid[0:c1a.shape[0], 0:c1a.shape[1]].astype(np.float32)
    c1a[:, :, 3] = (c1a[:, :, 3].astype(np.float32) * np.clip((396.0 - cyy) / 16.0, 0.0, 1.0)).clip(0, 255).astype(np.uint8)
    cake1_meta = save_tight_prop(Image.fromarray(c1a, mode="RGBA"), c1_layers / "cake.png", w, h, cake1_box)

    moon_box = (32, 46, 224, 224)
    moon_p = flood_extract_bg(c1.crop(moon_box), bg_rgb=(247, 243, 234), hard_dist=18, soft_dist=36, keep_largest=True)
    moon_meta = save_tight_prop(moon_p, c1_layers / "prop-moon.png", w, h, moon_box)

    bells_box = (552, 48, 722, 236)
    bells_p = flood_extract_bg(c1.crop(bells_box), bg_rgb=(247, 243, 234), hard_dist=18, soft_dist=36, keep_largest=True)
    bells_meta = save_tight_prop(bells_p, c1_layers / "prop-bells.png", w, h, bells_box, pivot_px=(640, 88))

    ribbon_box = (118, 760, 658, 914)
    rib_p = flood_extract_bg(c1.crop(ribbon_box), bg_rgb=(247, 243, 234), hard_dist=18, soft_dist=34, keep_largest=True)
    ribbon_meta = save_tight_prop(rib_p, c1_layers / "prop-ribbon.png", w, h, ribbon_box)

    star_box = (326, 902, 454, 1028)
    star_p = flood_extract_bg(c1.crop(star_box), bg_rgb=(247, 243, 234), hard_dist=18, soft_dist=34, keep_largest=True)
    star_meta = save_tight_prop(star_p, c1_layers / "prop-star.png", w, h, star_box)

    (c1_layers / "manifest.json").write_text(json.dumps({
        "type": "candlelight-wish",
        "props": {"cake": cake1_meta, "moon": moon_meta, "bells": bells_meta, "ribbon": ribbon_meta, "star": star_meta},
    }, indent=2), encoding="utf-8")

    # ------------------------------------------------------------------
    # 2. garden-tea: Sunlit garden backdrop + feathered tea table + swinging lantern + clean wreath/envelope
    # ------------------------------------------------------------------
    c2_dir = ASSETS / "cards" / "garden-tea"
    c2_layers = c2_dir / "layers"
    c2 = Image.open(c2_dir / "cover.png").convert("RGB")

    arch2 = extract_arch_mask(w, h, cx=390, cy=342, r=245, bottom=768, feather=2.0)
    arch2_bleed = extract_arch_mask(w, h, cx=390, cy=342, r=274, bottom=796, feather=2.0)
    bg2_rgba = c2.convert("RGBA")
    bg2_rgba.putalpha(Image.fromarray((arch2_bleed * 255).astype(np.uint8), mode="L"))
    bg2_rgba.save(c2_layers / "bg.png")

    frame2_alpha = np.clip((1.0 - arch2) * 255.0, 0, 255).astype(np.uint8)
    frame2 = c2.convert("RGBA")
    frame2.putalpha(Image.fromarray(frame2_alpha, mode="L"))
    frame2.save(c2_layers / "frame.png")

    # Mid-depth tea table + berry cake (soft circular botanical medallion feathering so no hard rectangle edges)
    table_box = (242, 398, 550, 725)
    t_crop = c2.crop(table_box).convert("RGBA")
    t_arr = np.asarray(t_crop).copy()
    th, tw, _ = t_arr.shape
    tyy, txx = np.mgrid[0:th, 0:tw].astype(np.float32)
    t_ell = ((txx - tw * 0.5) / (tw * 0.46)) ** 2 + ((tyy - th * 0.54) / (th * 0.46)) ** 2
    t_arr[:, :, 3] = (np.clip((1.0 - t_ell) * 3.8, 0.0, 1.0) * 255.0).astype(np.uint8)
    table_meta = save_tight_prop(Image.fromarray(t_arr, mode="RGBA"), c2_layers / "table.png", w, h, table_box)

    # Clean swinging hanging gold lantern + cream ribbon pivoted at top
    lantern_box = (552, 0, 658, 344)
    lan_crop = c2.crop(lantern_box)
    lan_p = flood_extract_bg(lan_crop, bg_rgb=(208, 221, 212), hard_dist=20, soft_dist=38, keep_largest=True)
    l_rgb = np.asarray(lan_crop.convert("RGB"), dtype=np.float32)
    lr, lg, lb = l_rgb[:, :, 0], l_rgb[:, :, 1], l_rgb[:, :, 2]
    is_sage_bg = (lg >= lr - 5.0) & ((lr - lb) < 24.0)
    dist_sage = np.linalg.norm(l_rgb - np.array([208.0, 221.0, 212.0])[None, None, :], axis=2)
    ext_sage = _border_reachable((dist_sage <= 38.0) | is_sage_bg)

    l_arr = np.asarray(lan_p).copy()
    l_arr[ext_sage, 3] = 0
    lyy, lxx = np.mgrid[0:l_arr.shape[0], 0:l_arr.shape[1]].astype(np.float32)
    # Tapered silhouette envelope around hanging lantern body below ribbon bow (y > 165)
    half_w = np.interp(lyy, [165.0, 182.0, 205.0, 265.0, 315.0, 343.0], [18.0, 18.0, 37.0, 37.0, 27.0, 16.0])
    lower_bad = (lyy > 165.0) & ((np.abs(lxx - 53.0) > half_w) | ((lg >= lr - 4.0) & ((lr - lb) < 20.0)))
    l_arr[lower_bad, 3] = 0

    keep_l = _keep_largest_component(l_arr[:, :, 3] > 35)
    l_arr[:, :, 3] = np.where(keep_l, l_arr[:, :, 3], 0)
    lan_clean = Image.fromarray(l_arr, mode="RGBA")
    lan_clean.putalpha(lan_clean.split()[3].filter(ImageFilter.GaussianBlur(0.5)))
    lantern_meta = save_tight_prop(lan_clean, c2_layers / "prop-lantern.png", w, h, lantern_box, pivot_px=(605, 2))

    # Reuse razor-clean wreath sticker & envelope sticker aligned cleanly to cover positions
    wr2_src = Image.open(ASSETS / "stickers" / "wreath.png").resize((152, 152), Image.Resampling.LANCZOS)
    wr2_full = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    wr2_full.paste(wr2_src, (314, 882), wr2_src)
    wr2_meta = save_tight_prop(wr2_full, c2_layers / "prop-wreath.png", w, h, (0, 0, w, h))

    env2_src = Image.open(ASSETS / "stickers" / "envelope.png").resize((150, 150), Image.Resampling.LANCZOS)
    env2_full = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    env2_full.paste(env2_src, (544, 694), env2_src)
    env2_meta = save_tight_prop(env2_full, c2_layers / "prop-envelope.png", w, h, (0, 0, w, h))

    # Clean bottom cream-and-gold bow extracted directly from ribbon band y=766..856
    rib2_box = (146, 766, 580, 856)
    rib2_p = flood_extract_bg(c2.crop(rib2_box), bg_rgb=(208, 221, 212), hard_dist=18, soft_dist=34, keep_largest=True)
    rib2_meta = save_tight_prop(rib2_p, c2_layers / "prop-ribbon.png", w, h, rib2_box)

    (c2_layers / "manifest.json").write_text(json.dumps({
        "type": "garden-tea",
        "props": {"table": table_meta, "lantern": lantern_meta, "wreath": wr2_meta, "envelope": env2_meta, "ribbon": rib2_meta},
    }, indent=2), encoding="utf-8")

    # ------------------------------------------------------------------
    # 3. patisserie-window: Real 3D slanted awning + open 6-pane glass shop window + recessed cake
    # ------------------------------------------------------------------
    c3_dir = ASSETS / "cards" / "patisserie-window"
    c3_layers = c3_dir / "layers"
    c3 = Image.open(c3_dir / "cover.png").convert("RGB")

    bg3 = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bg3_d = ImageDraw.Draw(bg3)
    win_l, win_t, win_r, win_b = 112, 185, w - 112, 855
    for row in range(win_t - 15, win_b + 15):
        t = np.clip((row - win_t) / max(1, (win_b - win_t)), 0, 1)
        r_c = int(112 + 122 * math.sin(t * math.pi * 0.85))
        g_c = int(76 + 98 * math.sin(t * math.pi * 0.85))
        b_c = int(48 + 56 * math.sin(t * math.pi * 0.85))
        bg3_d.line([(win_l - 25, row), (win_r + 25, row)], fill=(r_c, g_c, b_c, 255))
    glow3 = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(glow3).ellipse([w * 0.22, 270, w * 0.78, 780], fill=(255, 228, 165, 118))
    bg3 = Image.alpha_composite(bg3, glow3.filter(ImageFilter.GaussianBlur(34)))
    bg3.save(c3_layers / "bg.png")

    frame3_a = np.full((h, w), 255, dtype=np.uint8)
    m_x1, m_x2 = win_l + (win_r - win_l) // 3, win_l + 2 * (win_r - win_l) // 3
    m_y1, m_y2 = win_t + 195, win_t + 405
    panes_x = [(win_l + 4, m_x1 - 7), (m_x1 + 7, m_x2 - 7), (m_x2 + 7, win_r - 4)]
    panes_y = [(222, m_y1 - 7), (m_y1 + 7, m_y2 - 7), (m_y2 + 7, win_b - 8)]
    for px0, px1 in panes_x:
        for py0, py1 in panes_y:
            frame3_a[py0:py1, px0:px1] = 0
    frame3 = c3.convert("RGBA")
    frame3.putalpha(Image.fromarray(frame3_a, mode="L"))
    frame3.save(c3_layers / "frame.png")

    cake3_src = Image.open(ASSETS / "stickers" / "cake.png").resize((390, 390), Image.Resampling.LANCZOS)
    cake3_full = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    cake3_full.paste(cake3_src, ((w - 390) // 2, 415), cake3_src)
    cake3_meta = save_tight_prop(cake3_full, c3_layers / "cake.png", w, h, (0, 0, w, h))

    # Cleanly compose sill foreground layer on transparent canvas (no brown wall bleed!)
    sill_full = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sfd = ImageDraw.Draw(sill_full)
    sfd.rounded_rectangle([win_l - 28, win_b - 6, win_r + 28, win_b + 48], radius=8, fill=(246, 239, 226, 255), outline=(190, 150, 82, 255), width=3)
    sfd.line([(win_l - 20, win_b + 12), (win_r + 20, win_b + 12)], fill=(214, 178, 114, 200), width=2)
    for lx, ly, ang in [(112, 842, -2.5), (146, 825, -1.9), (168, 864, -0.4), (668, 842, -0.6), (634, 825, -1.2), (612, 864, -2.7)]:
        draw_leaf(sfd, lx, ly, ang, 46, 14, 1)
    draw_watercolor_rose(sfd, 134, 844, 32, 1, "blush")
    draw_watercolor_rose(sfd, 176, 866, 24, 1, "cream")
    draw_watercolor_rose(sfd, 646, 844, 32, 1, "blush")
    draw_watercolor_rose(sfd, 604, 866, 24, 1, "cream")
    cup3 = Image.open(ASSETS / "stickers" / "cupcake.png").resize((112, 112), Image.Resampling.LANCZOS)
    gift3 = Image.open(ASSETS / "stickers" / "gift.png").resize((126, 126), Image.Resampling.LANCZOS)
    sill_full.paste(cup3, (186, 772), cup3)
    sill_full.paste(gift3, (476, 762), gift3)
    sill_meta = save_tight_prop(sill_full, c3_layers / "prop-sill.png", w, h, (0, 0, w, h))

    # Clean pure cream-and-gold bow from raw sky_balloons masterplate (zero leaves, zero blue-grey sky, zero hole)
    bow_crop = im_sky_raw.crop((344, 144, 552, 314)).convert("RGBA")
    b_arr = np.asarray(bow_crop).copy()
    b_rgb = b_arr[:, :, :3].astype(np.float32)
    br, bg_c, bb = b_rgb[:, :, 0], b_rgb[:, :, 1], b_rgb[:, :, 2]
    is_bg_bow = (bb >= br - 5.0) | (bg_c > br + 2.0) | (((br - bb) < 10.0) & (br < 228.0))
    fg_bow = _keep_largest_component(~is_bg_bow)
    ext_bow = _border_reachable(~fg_bow)
    is_spec_hole = (~fg_bow) & (~ext_bow) & (br > 235.0) & (bg_c > 230.0) & (bb > 220.0)
    fg_final = fg_bow | is_spec_hole
    b_arr[:, :, 3] = np.where(fg_final, 255, 0).astype(np.uint8)
    bow_masked = Image.fromarray(b_arr, mode="RGBA")
    bow_masked.putalpha(bow_masked.split()[3].filter(ImageFilter.GaussianBlur(0.6)))
    bow_clean = pad_square(bow_masked, 192, 0.04)
    bow3_full = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bow3_full.paste(bow_clean, ((w - 192) // 2, 46), bow_clean)
    bow3_meta = save_tight_prop(bow3_full, c3_layers / "prop-bow.png", w, h, (0, 0, w, h))

    aw_tex = Image.new("RGBA", (512, 256), (0, 0, 0, 0))
    aw_d = ImageDraw.Draw(aw_tex)
    stripes = 11
    sw_s = 512.0 / stripes
    for i in range(stripes):
        sx0 = i * sw_s
        sx1 = sx0 + sw_s + 1
        col = (164, 34, 40, 255) if i % 2 == 0 else (249, 242, 230, 255)
        aw_d.rectangle([sx0, 0, sx1, 200], fill=col)
        aw_d.pieslice([sx0, 148, sx1, 254], 0, 180, fill=col, outline=(190, 150, 84, 220))
    aw_tex.save(c3_layers / "awning-tex.png")

    (c3_layers / "manifest.json").write_text(json.dumps({
        "type": "patisserie-window",
        "props": {"cake": cake3_meta, "sill": sill_meta, "bow": bow3_meta},
    }, indent=2), encoding="utf-8")

    # ------------------------------------------------------------------
    # 4. sky-balloons: Circular wreath window + 3 crisp silhouette-isolated 3D hot air balloons
    # ------------------------------------------------------------------
    c4_dir = ASSETS / "cards" / "sky-balloons"
    c4_layers = c4_dir / "layers"
    c4 = Image.open(c4_dir / "cover.png").convert("RGB")
    c4_arr = np.asarray(c4, dtype=np.uint8)

    cx4, cy4 = 390.0, 468.0
    r_dist = np.sqrt((xx - cx4) ** 2 + (yy - cy4) ** 2)
    circ_cut = np.clip((206.0 - r_dist) / 2.0 + 0.5, 0.0, 1.0)
    circ_bleed = np.clip((242.0 - r_dist) / 2.0 + 0.5, 0.0, 1.0)

    b_pink_box = (238, 336, 336, 486)
    b_pink_p = extract_balloon_silhouette(c4, cx=286, cy=398, rx=41, ry=46, basket_y1=480, crop_box=b_pink_box)
    b_pink_meta = save_tight_prop(b_pink_p, c4_layers / "balloon-pink.png", w, h, b_pink_box)

    b_gold_box = (340, 272, 426, 412)
    b_gold_p = extract_balloon_silhouette(c4, cx=383, cy=330, rx=36, ry=42, basket_y1=408, crop_box=b_gold_box)
    b_gold_meta = save_tight_prop(b_gold_p, c4_layers / "balloon-gold.png", w, h, b_gold_box)

    b_blue_box = (442, 304, 532, 452)
    b_blue_p = extract_balloon_silhouette(c4, cx=486, cy=366, rx=37, ry=42, basket_y1=448, crop_box=b_blue_box)
    b_blue_meta = save_tight_prop(b_blue_p, c4_layers / "balloon-blue.png", w, h, b_blue_box)

    bg4_arr = inpaint_horizontal_ovals(
        c4_arr,
        [
            (286, 396, 52, 56),
            (286, 462, 24, 26),
            (383, 330, 46, 50),
            (383, 392, 22, 24),
            (486, 366, 48, 52),
            (486, 430, 22, 24),
        ],
    )
    bg4_rgba = Image.fromarray(bg4_arr, mode="RGB").convert("RGBA")
    bg4_rgba.putalpha(Image.fromarray((circ_bleed * 255).astype(np.uint8), mode="L"))
    bg4_rgba.save(c4_layers / "bg.png")

    frame4_a = np.clip((1.0 - circ_cut) * 255.0, 0, 255).astype(np.uint8)
    frame4 = c4.convert("RGBA")
    frame4.putalpha(Image.fromarray(frame4_a, mode="L"))
    frame4.save(c4_layers / "frame.png")

    # Clean elevated circular rose wreath ring
    wr_box = (72, 130, 708, 780)
    wr_rgba = flood_extract_bg(c4.crop(wr_box), bg_rgb=(204, 222, 240), hard_dist=18, soft_dist=36)
    wr_arr = np.asarray(wr_rgba).copy()
    wyy, wxx = np.mgrid[0:wr_arr.shape[0], 0:wr_arr.shape[1]].astype(np.float32)
    wr_dist = np.sqrt((wxx + wr_box[0] - cx4) ** 2 + (wyy + wr_box[1] - cy4) ** 2)
    inner_trim = np.clip((wr_dist - 196.0) / 14.0, 0.0, 1.0)
    wr_arr[:, :, 3] = (wr_arr[:, :, 3].astype(np.float32) * inner_trim).clip(0, 255).astype(np.uint8)
    wreath4_meta = save_tight_prop(Image.fromarray(wr_arr, mode="RGBA"), c4_layers / "wreath.png", w, h, wr_box)

    # Clean top bow (aligned to cover position from clean bow_clean!)
    bow4_full = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bow4_clean = bow_clean.resize((198, 198), Image.Resampling.LANCZOS)
    bow4_full.paste(bow4_clean, ((w - 198) // 2, 114), bow4_clean)
    bow4_meta = save_tight_prop(bow4_full, c4_layers / "prop-bow.png", w, h, (0, 0, w, h))

    star4_box = (340, 815, 442, 922)
    star4_p = flood_extract_bg(c4.crop(star4_box), bg_rgb=(204, 222, 240), hard_dist=18, soft_dist=36, keep_largest=True)
    star4_meta = save_tight_prop(star4_p, c4_layers / "prop-star.png", w, h, star4_box)

    (c4_layers / "manifest.json").write_text(json.dumps({
        "type": "sky-balloons",
        "props": {
            "balloonPink": b_pink_meta,
            "balloonGold": b_gold_meta,
            "balloonBlue": b_blue_meta,
            "wreath": wreath4_meta,
            "bow": bow4_meta,
            "star": star4_meta,
        },
    }, indent=2), encoding="utf-8")


def build_qa_3d_layers():
    """Render a visual QA sheet showing each card's cut frame, recessed bg, and 3D props over checkerboard."""
    w, h = 1480, 980
    sheet = Image.new("RGB", (w, h), (235, 231, 224))
    arr = np.asarray(sheet).copy()
    yy, xx = np.mgrid[0:h, 0:w]
    arr[((xx // 16) + (yy // 16)) % 2 == 0] = [245, 242, 236]
    sheet = Image.fromarray(arr, mode="RGB")

    cards = ["candlelight-wish", "garden-tea", "patisserie-window", "sky-balloons"]
    for i, cid in enumerate(cards):
        ldir = ASSETS / "cards" / cid / "layers"
        y0 = 20 + i * 240
        # Col 1: relief normal
        rn = Image.open(ASSETS / "cards" / cid / "relief-normal.png").resize((156, 216), Image.Resampling.LANCZOS)
        sheet.paste(rn, (24, y0))
        # Col 2: cut frame over checkerboard
        fr = Image.open(ldir / "frame.png").resize((156, 216), Image.Resampling.LANCZOS)
        sheet.paste(fr, (204, y0), fr)
        # Col 3: recessed bg over checkerboard
        bg = Image.open(ldir / "bg.png").resize((156, 216), Image.Resampling.LANCZOS)
        sheet.paste(bg, (384, y0), bg)
        # Col 4+: all prop pngs
        px = 574
        for p in sorted(ldir.glob("*.png")):
            if p.name in ("frame.png", "bg.png"):
                continue
            pim = Image.open(p).convert("RGBA")
            pim.thumbnail((170, 195), Image.Resampling.LANCZOS)
            sheet.paste(pim, (px, y0 + 10), pim)
            px += pim.width + 18

    sheet.save(RAW / "qa_3d_layers.png")


def main():
    im_candlelight = Image.open(MASTERPLATES["candlelight-wish"]).convert("RGB")
    im_garden = Image.open(MASTERPLATES["garden-tea"]).convert("RGB")
    im_sky = Image.open(MASTERPLATES["sky-balloons"]).convert("RGB")

    for cid, src in [("candlelight-wish", im_candlelight), ("garden-tea", im_garden), ("sky-balloons", im_sky)]:
        out_dir = ASSETS / "cards" / cid
        fitted = fit_cover(src, COVER_SIZE)
        fitted.save(out_dir / "cover.png")
        fitted.resize(THUMB_SIZE, Image.Resampling.LANCZOS).save(out_dir / "thumb.png")
        make_foil_mask(fitted).save(out_dir / "foil.png")

    generate_textures()
    build_supersampled_stickers_and_brand(im_candlelight, im_garden)
    build_emblems(im_sky)
    build_patisserie_cover(im_sky)
    build_3d_layers(im_sky)
    build_qa_contact_sheet()
    build_qa_3d_layers()
    print("Refined asset pipeline completed successfully.")


if __name__ == "__main__":
    main()

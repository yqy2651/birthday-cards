"""Birthday Cards (生日信) — Static SPA & REST API server."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from pathlib import Path
import re
import secrets
import shutil
import threading
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = ROOT / "public"
DATA_DIR = ROOT / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
LETTERS_FILE = DATA_DIR / "letters.json"

MAX_AUDIO_BYTES = 15 * 1024 * 1024
ALLOWED_AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".ogg", ".aac", ".webm"}
ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{4,64}$")

MIME_OVERRIDES = {
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".m4a": "audio/mp4",
    ".ogg": "audio/ogg",
    ".aac": "audio/aac",
    ".webm": "audio/webm",
}

STORE_LOCK = threading.Lock()


def ensure_storage():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    if not LETTERS_FILE.exists():
        LETTERS_FILE.write_text('{"letters": {}}', encoding="utf-8")


def load_store() -> dict:
    ensure_storage()
    try:
        raw = LETTERS_FILE.read_text(encoding="utf-8")
        data = json.loads(raw)
        if isinstance(data, dict) and isinstance(data.get("letters"), dict):
            return data
    except (OSError, json.JSONDecodeError):
        pass
    return {"letters": {}}


def save_store(data: dict):
    ensure_storage()
    tmp_path = DATA_DIR / f"letters.{secrets.token_hex(4)}.tmp"
    tmp_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp_path, LETTERS_FILE)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_utc(dt: datetime | None = None) -> str:
    dt = dt or utc_now()
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def parse_iso(val: str | None) -> datetime | None:
    if not val or not isinstance(val, str):
        return None
    try:
        normalized = val.strip()
        if normalized.endswith("Z"):
            normalized = normalized[:-1] + "+00:00"
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except ValueError:
        return None


def compute_status(record: dict) -> tuple[str, bool]:
    deliver_dt = parse_iso(record.get("deliverAt"))
    now = utc_now()
    if deliver_dt and now < deliver_dt:
        return "scheduled", True
    if record.get("openedAt"):
        return "opened", False
    return "delivered", False


def guess_mime(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in MIME_OVERRIDES:
        return MIME_OVERRIDES[ext]
    guessed, _ = mimetypes.guess_type(str(path))
    return guessed or "application/octet-stream"


class BirthdayCardsHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, format: str, *args):
        # Keep daemon stdout crisp and readable
        print(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}")

    def send_json(self, status: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self, max_bytes: int = 2 * 1024 * 1024) -> dict | None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return None
        if length <= 0 or length > max_bytes:
            return None
        raw = self.rfile.read(length)
        try:
            parsed = json.loads(raw.decode("utf-8"))
            return parsed if isinstance(parsed, dict) else None
        except (UnicodeDecodeError, json.JSONDecodeError):
            return None

    def serve_file(self, file_path: Path, cache_control: str = "no-cache", support_range: bool = False):
        if not file_path.is_file():
            self.send_json(404, {"success": False, "error": "Not found"})
            return

        file_size = file_path.stat().st_size
        ctype = guess_mime(file_path)
        range_header = self.headers.get("Range") if support_range else None

        if range_header and range_header.startswith("bytes="):
            spec = range_header[6:].split(",")[0].strip()
            parts = spec.split("-", 1)
            try:
                start = int(parts[0]) if parts[0] else 0
                end = int(parts[1]) if parts[1] else file_size - 1
            except ValueError:
                self.send_error(416, "Invalid Range")
                return
            if start >= file_size or end < start:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{file_size}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
            end = min(end, file_size - 1)
            chunk_len = end - start + 1
            self.send_response(206)
            self.send_header("Content-Type", ctype)
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Content-Length", str(chunk_len))
            self.send_header("Cache-Control", cache_control)
            self.end_headers()
            with file_path.open("rb") as f:
                f.seek(start)
                remaining = chunk_len
                while remaining > 0:
                    buf = f.read(min(65536, remaining))
                    if not buf:
                        break
                    self.wfile.write(buf)
                    remaining -= len(buf)
            return

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        if support_range:
            self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(file_size))
        self.send_header("Cache-Control", cache_control)
        self.end_headers()
        with file_path.open("rb") as f:
            shutil.copyfileobj(f, self.wfile)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        # API: GET /api/letters/<id>
        if path.startswith("/api/letters/"):
            letter_id = path[len("/api/letters/"):].strip("/")
            if not ID_PATTERN.match(letter_id):
                self.send_json(400, {"success": False, "error": "Invalid letter ID"})
                return
            with STORE_LOCK:
                store = load_store()
                record = store["letters"].get(letter_id)
            if not record:
                self.send_json(404, {"success": False, "error": "Letter not found"})
                return

            status, locked = compute_status(record)
            base_data = {
                "id": record["id"],
                "status": status,
                "locked": locked,
                "recipientName": record.get("recipientName", ""),
                "envelopeColor": record.get("envelopeColor", "ivory"),
                "seal": record.get("seal", {"color": "red", "stamp": "star"}),
                "deliverAt": record.get("deliverAt"),
                "openedAt": record.get("openedAt"),
                "createdAt": record.get("createdAt"),
            }
            if not locked:
                base_data["content"] = record.get("content", {})
            self.send_json(200, {"success": True, "data": base_data})
            return

        # API: GET /api/outbox/<outboxId>
        if path.startswith("/api/outbox/"):
            outbox_id = path[len("/api/outbox/"):].strip("/")
            if not ID_PATTERN.match(outbox_id):
                self.send_json(400, {"success": False, "error": "Invalid outbox ID"})
                return
            with STORE_LOCK:
                store = load_store()
                items = [r for r in store["letters"].values() if r.get("outboxId") == outbox_id]

            items.sort(key=lambda r: r.get("createdAt", ""), reverse=True)
            result = []
            for r in items:
                status, locked = compute_status(r)
                content = r.get("content") or {}
                result.append({
                    "id": r["id"],
                    "recipientName": r.get("recipientName", "Friend"),
                    "templateId": content.get("templateId", "candlelight-wish"),
                    "status": status,
                    "locked": locked,
                    "deliverAt": r.get("deliverAt"),
                    "openedAt": r.get("openedAt"),
                    "createdAt": r.get("createdAt"),
                })
            self.send_json(200, {"success": True, "data": {"outboxId": outbox_id, "letters": result}})
            return

        # Uploaded audio streaming: GET /uploads/<filename>
        if path.startswith("/uploads/"):
            rel = path[len("/uploads/"):].lstrip("/")
            if "/" in rel or "\\" in rel or ".." in rel or not rel:
                self.send_json(403, {"success": False, "error": "Forbidden"})
                return
            target = (UPLOADS_DIR / rel).resolve()
            if target.parent != UPLOADS_DIR.resolve():
                self.send_json(403, {"success": False, "error": "Forbidden"})
                return
            self.serve_file(target, cache_control="public, max-age=86400", support_range=True)
            return

        # Static file resolution inside public/
        rel_path = path.lstrip("/")
        if rel_path:
            candidate = (PUBLIC_DIR / rel_path).resolve()
            public_root = PUBLIC_DIR.resolve()
            if str(candidate).startswith(str(public_root)) and candidate.is_file():
                cache = "public, max-age=3600" if ("/assets/" in path or "/vendor/" in path) else "no-cache"
                self.serve_file(candidate, cache_control=cache)
                return

        # SPA routes: /, /editor, /letter/<id>, /outbox/<id>
        if (
            path in ("", "/", "/editor")
            or path.startswith("/letter/")
            or path.startswith("/outbox/")
        ):
            self.serve_file(PUBLIC_DIR / "index.html", cache_control="no-cache")
            return

        self.send_json(404, {"success": False, "error": "Resource not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        # API: POST /api/letters
        if path == "/api/letters":
            body = self.read_json_body()
            if not body:
                self.send_json(400, {"success": False, "error": "Invalid JSON body"})
                return

            content = body.get("content")
            if not isinstance(content, dict):
                self.send_json(400, {"success": False, "error": "Missing content object"})
                return

            recipient_name = str(body.get("recipientName") or content.get("greetingName") or "Friend").strip()[:60] or "Friend"
            req_outbox = body.get("outboxId")
            outbox_id = req_outbox if (isinstance(req_outbox, str) and ID_PATTERN.match(req_outbox)) else secrets.token_urlsafe(16)

            deliver_raw = body.get("deliverAt")
            deliver_dt = parse_iso(deliver_raw) or utc_now()
            deliver_at = iso_utc(deliver_dt)

            rp = content.get("redPacket") if isinstance(content.get("redPacket"), dict) else {}
            letter_id = secrets.token_urlsafe(9)
            record = {
                "id": letter_id,
                "outboxId": outbox_id,
                "recipientName": recipient_name,
                "envelopeColor": str(body.get("envelopeColor") or "ivory")[:24],
                "seal": body.get("seal") if isinstance(body.get("seal"), dict) else {"color": "red", "stamp": "star"},
                "deliverAt": deliver_at,
                "createdAt": iso_utc(),
                "openedAt": None,
                "content": {
                    "templateId": str(content.get("templateId") or "candlelight-wish")[:48],
                    "paper": str(content.get("paper") or "watercolor")[:32],
                    "font": str(content.get("font") or "english")[:32],
                    "greeting": str(content.get("greeting") or "Dear Friend,")[:120],
                    "body": str(content.get("body") or "")[:1200],
                    "signature": str(content.get("signature") or "— Best wishes")[:120],
                    "stickers": content.get("stickers") if isinstance(content.get("stickers"), list) else [],
                    "audioUrl": content.get("audioUrl"),
                    "audioName": content.get("audioName"),
                    "presetAudio": content.get("presetAudio"),
                    "coverCloseup": bool(content.get("coverCloseup", True)),
                    "effects3d": bool(content.get("effects3d", True)),
                    "redPacket": {
                        "enabled": bool(rp.get("enabled", False)),
                        "wish": str(rp.get("wish") or "生日快乐，大吉大利！").strip()[:60] or "生日快乐，大吉大利！",
                        "amount": str(rp.get("amount") or "88.88").strip()[:16] or "88.88",
                        "claimCode": str(rp.get("claimCode") or "").strip()[:80],
                    },
                },
            }

            with STORE_LOCK:
                store = load_store()
                while letter_id in store["letters"]:
                    letter_id = secrets.token_urlsafe(9)
                    record["id"] = letter_id
                store["letters"][letter_id] = record
                save_store(store)

            self.send_json(201, {
                "success": True,
                "data": {
                    "id": letter_id,
                    "outboxId": outbox_id,
                    "deliverAt": deliver_at,
                },
            })
            return

        # API: POST /api/letters/<id>/opened
        if path.startswith("/api/letters/") and path.endswith("/opened"):
            letter_id = path[len("/api/letters/"):-len("/opened")].strip("/")
            if not ID_PATTERN.match(letter_id):
                self.send_json(400, {"success": False, "error": "Invalid letter ID"})
                return
            with STORE_LOCK:
                store = load_store()
                record = store["letters"].get(letter_id)
                if not record:
                    self.send_json(404, {"success": False, "error": "Letter not found"})
                    return
                if not record.get("openedAt"):
                    record["openedAt"] = iso_utc()
                    save_store(store)
                opened_at = record["openedAt"]
            self.send_json(200, {"success": True, "data": {"id": letter_id, "openedAt": opened_at}})
            return

        # API: POST /api/audio
        if path == "/api/audio":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                self.send_json(400, {"success": False, "error": "Invalid Content-Length"})
                return
            if length <= 0 or length > MAX_AUDIO_BYTES:
                self.send_json(413, {"success": False, "error": "Audio must be between 1 byte and 15MB"})
                return

            raw_name = unquote(self.headers.get("X-Filename", "audio.mp3")).strip()
            safe_name = os.path.basename(raw_name) or "birthday-music.mp3"
            ext = Path(safe_name).suffix.lower()
            if ext not in ALLOWED_AUDIO_EXTS:
                self.send_json(400, {"success": False, "error": "Unsupported audio format"})
                return

            ensure_storage()
            token = secrets.token_urlsafe(12)
            out_name = f"{token}{ext}"
            out_path = UPLOADS_DIR / out_name

            remaining = length
            with out_path.open("wb") as f:
                while remaining > 0:
                    chunk = self.rfile.read(min(65536, remaining))
                    if not chunk:
                        break
                    f.write(chunk)
                    remaining -= len(chunk)

            self.send_json(201, {
                "success": True,
                "data": {
                    "audioUrl": f"/uploads/{out_name}",
                    "audioName": safe_name[:120],
                },
            })
            return

        self.send_json(404, {"success": False, "error": "Unknown API endpoint"})


def main():
    parser = argparse.ArgumentParser(description="Birthday Cards Server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8000")))
    args = parser.parse_args()

    ensure_storage()
    server = ThreadingHTTPServer((args.host, args.port), BirthdayCardsHandler)
    print(f"Birthday Cards server running at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        server.server_close()


if __name__ == "__main__":
    main()

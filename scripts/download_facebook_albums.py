from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SOURCE = PROJECT_ROOT / "external" / "facebook-albums" / "albums.json"
DEFAULT_TARGET = PROJECT_ROOT / "external" / "facebook-albums"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
)


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "album"


def extract_fbid(page_url: str, fallback_index: int) -> str:
    match = re.search(r"fbid=(\d+)", page_url)
    if match:
        return match.group(1)
    return f"{fallback_index:03d}"


def infer_extension(image_url: str) -> str:
    path = urllib.parse.urlparse(image_url).path
    suffix = Path(path).suffix.lower()
    return suffix if suffix else ".jpg"


def download_image(image_url: str, destination: Path) -> None:
    request = urllib.request.Request(image_url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request) as response, destination.open("wb") as output_file:
        output_file.write(response.read())


def load_albums(source_path: Path) -> list[dict]:
    with source_path.open("r", encoding="utf-8-sig") as file:
        return json.load(file)


def save_json(path: Path, data: object) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    if not DEFAULT_SOURCE.exists():
        print(f"No existe el archivo fuente: {DEFAULT_SOURCE}", file=sys.stderr)
        return 1

    albums = load_albums(DEFAULT_SOURCE)
    DEFAULT_TARGET.mkdir(parents=True, exist_ok=True)

    summary: list[dict] = []
    failures: list[dict] = []

    for album in albums:
        album_name = album.get("name", "Album")
        slug = slugify(album_name)
        album_dir = DEFAULT_TARGET / slug
        album_dir.mkdir(parents=True, exist_ok=True)
        save_json(album_dir / "metadata.json", album)

        downloaded = 0
        failed = 0
        photos = album.get("photos", [])

        for index, photo in enumerate(photos, start=1):
            image_url = photo.get("image")
            page_url = photo.get("page", "")
            if not image_url:
                failed += 1
                failures.append(
                    {
                        "album": album_name,
                        "page": page_url,
                        "image": image_url,
                        "message": "Missing image URL",
                    }
                )
                continue

            fbid = extract_fbid(page_url, index)
            extension = infer_extension(image_url)
            file_name = f"{index:02d}-{fbid}{extension}"
            destination = album_dir / file_name

            if destination.exists():
                downloaded += 1
                continue

            try:
                download_image(image_url, destination)
                downloaded += 1
            except urllib.error.URLError as error:
                failed += 1
                failures.append(
                    {
                        "album": album_name,
                        "page": page_url,
                        "image": image_url,
                        "message": str(error),
                    }
                )

        summary.append(
            {
                "name": album_name,
                "expected": album.get("expected"),
                "found": album.get("found"),
                "downloadedCandidates": album.get("downloadedCandidates"),
                "downloaded": downloaded,
                "failed": failed,
            }
        )
        print(
            f"{album_name}: descargadas {downloaded} de {len(photos)} URLs detectadas "
            f"(esperadas por Facebook: {album.get('expected')})."
        )

    save_json(DEFAULT_TARGET / "download-summary.json", summary)
    save_json(DEFAULT_TARGET / "download-failures.json", failures)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
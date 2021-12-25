import { Base64 } from "js-base64";

export function computePath(current: string[], append: string): string[] {
  const segs = append.split("/").filter(x => x);

  const out = append.startsWith("/") ? [] : [...current]
  for(const seg of segs) {
    if(!validatePathSeg(seg)) throw new Error("Invalid path");
    if (seg == "..") {
      out.pop();
      continue;
    }
    if (seg == ".") {
      continue;
    }
    out.push(seg);
  }

  return out;
}

export function formatPath(path: Uint8Array): string {
  const pretty = tryPrettyPrintPath(path);
  if (pretty === undefined) {
    return '[b] ' + Base64.fromUint8Array(path);
  } else {
    return '[p] ' + pretty;
  }
}

export function tryPrettyPrintPath(path: Uint8Array): string | undefined {
  let idx = 0;
  let segs: string[] = [];
  while (idx < path.length) {
    if (path[idx] == 0x02) {
      let seg: number[] = [];
      let fin = false;
      idx++;
      while (idx < path.length) {
        let b = path[idx++];
        if (b == 0x00) {
          fin = true;
          break;
        }
        seg.push(b);
      }
      if (!fin) return undefined;
      segs.push(new TextDecoder().decode(Uint8Array.from(seg)));
    } else {
      return undefined;
    }
  }
  return segs.join("/");
}

export function encodePath(path: string[]): Uint8Array {
  const raw = path.map(seg => new TextEncoder().encode(seg));
  const buf = new Uint8Array(raw.reduce((acc, cur) => acc + cur.length + 2, 0));
  let offset = 0;
  for (const seg of raw) {
    buf[offset++] = 0x02;
    buf.set(seg, offset);
    offset += seg.length;
    buf[offset++] = 0x00;
  }
  return buf;
}

function validatePathSeg(seg: string): boolean {
  const encoded = new TextEncoder().encode(seg);
  for (const b of encoded) {
    if (b == 0) return false;
    if (b == 47) return false; // '/'
  }
  return true;
}

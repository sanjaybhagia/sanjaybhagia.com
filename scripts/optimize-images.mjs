#!/usr/bin/env node
// One-off (re-runnable) compressor for public/images. Keeps filenames and
// formats — the /images/... URLs are load-bearing. Downscales to max 1600px
// wide (2x the content column), palette-quantizes PNGs, mozjpegs JPEGs.
// Only rewrites a file when that saves at least 10%.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = 'public/images';
const MAX_WIDTH = 1600;
let before = 0;
let after = 0;
let changed = 0;
let skipped = 0;

for (const name of fs.readdirSync(dir)) {
  const p = path.join(dir, name);
  if (!fs.statSync(p).isFile()) continue;
  const ext = path.extname(name).toLowerCase();
  const buf = fs.readFileSync(p);
  let pipeline = sharp(buf).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  let out;
  try {
    if (ext === '.png') {
      out = await pipeline.png({ palette: true, quality: 90, effort: 9, compressionLevel: 9 }).toBuffer();
    } else if (ext === '.jpg' || ext === '.jpeg') {
      out = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    } else if (ext === '.webp') {
      out = await pipeline.webp({ quality: 82 }).toBuffer();
    } else {
      continue; // gif/ico/etc: leave alone
    }
  } catch (err) {
    console.error(`SKIP (error): ${name}: ${err.message}`);
    continue;
  }
  before += buf.length;
  if (out.length < buf.length * 0.9) {
    fs.writeFileSync(p, out);
    after += out.length;
    changed++;
  } else {
    after += buf.length;
    skipped++;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`Rewrote ${changed} files, left ${skipped} (already small enough).`);
console.log(`Total: ${mb(before)} MB -> ${mb(after)} MB`);

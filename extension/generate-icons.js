import fs from 'fs';
import zlib from 'zlib';

function crc32Buf(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc = crc >>> 1;
      }
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  const c = crc32Buf(Buffer.concat([typeBuf, data]));
  crc.writeUInt32BE(c, 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function generateIcon(filePath, size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdr = makeChunk('IHDR', ihdrData);
  
  const scanlineSize = size * 3 + 1;
  const rawPixels = Buffer.alloc(size * scanlineSize);
  
  const cx = size / 2;
  const cy = size / 2;
  
  for (let y = 0; y < size; y++) {
    rawPixels[y * scanlineSize] = 0; // Filter type 0
    for (let x = 0; x < size; x++) {
      const idx = y * scanlineSize + 1 + x * 3;
      
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Default: Emerald background (#14b8a6)
      let r = 20, g = 184, b = 166;
      
      // Draw outer border (1/16th of size)
      const borderWidth = Math.max(1, Math.round(size / 16));
      if (x < borderWidth || x >= size - borderWidth || y < borderWidth || y >= size - borderWidth) {
        // Dark slate border (#0f172a)
        r = 15; g = 23; b = 42;
      } else if (dist < size * 0.22) {
        // White center dot
        r = 255; g = 255; b = 255;
      } else if (dist < size * 0.35 && dist >= size * 0.26) {
        // Dark slate accent ring
        r = 15; g = 23; b = 42;
      }
      
      rawPixels[idx] = r;
      rawPixels[idx + 1] = g;
      rawPixels[idx + 2] = b;
    }
  }
  
  const idatData = zlib.deflateSync(rawPixels);
  const idat = makeChunk('IDAT', idatData);
  
  const iend = makeChunk('IEND', Buffer.alloc(0));
  
  const png = Buffer.concat([signature, ihdr, idat, iend]);
  fs.writeFileSync(filePath, png);
  console.log(`Generated icon: ${filePath} (${size}x${size})`);
}

// Generate the three required sizes
generateIcon('extension/icon16.png', 16);
generateIcon('extension/icon48.png', 48);
generateIcon('extension/icon128.png', 128);

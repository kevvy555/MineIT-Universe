import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const cwebp = 'C:\\Users\\Kevin\\AppData\\Local\\npm-cache\\_npx\\49359dc1eed2d4ec\\node_modules\\cwebp-bin\\vendor\\cwebp.exe';

export function convertJpgToPngWithAlpha(srcJpg, dstPng) {
  const psScript = `
    Add-Type -AssemblyName System.Drawing
    $bmp = [System.Drawing.Bitmap]::FromFile('${srcJpg.replace(/\\/g, '\\\\')}')
    $w = $bmp.Width
    $h = $bmp.Height
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bytes = New-Object byte[] ($bmpData.Stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $bytes, 0, $bytes.Length)
    $bmp.UnlockBits($bmpData)
    $bmp.Dispose()

    # Process alpha: Format32bppArgb is BGRA in memory
    for ($i = 0; $i -lt $bytes.Length; $i += 4) {
        $b = $bytes[$i]
        $g = $bytes[$i+1]
        $r = $bytes[$i+2]
        $brightness = [int]$b + [int]$g + [int]$r
        if ($brightness -lt 18) {
            $bytes[$i+3] = 0
            $bytes[$i] = 0
            $bytes[$i+1] = 0
            $bytes[$i+2] = 0
        } elseif ($brightness -lt 36) {
            $bytes[$i+3] = [byte](($brightness - 18) / 18.0 * 255)
        } else {
            $bytes[$i+3] = 255
        }
    }

    $outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outData = $outBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $outData.Scan0, $bytes.Length)
    $outBmp.UnlockBits($outData)

    $parent = Split-Path '${dstPng.replace(/\\/g, '\\\\')}' -Parent
    if (!(Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    $outBmp.Save('${dstPng.replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
  `;
  execFileSync('powershell.exe', ['-NoProfile', '-Command', psScript], { stdio: 'inherit' });
}

export function encodePngToWebp(srcPng, dstWebp) {
  const dir = dirname(dstWebp);
  if (!existsSync(dir)) {
    execFileSync('powershell.exe', ['-NoProfile', '-Command', `New-Item -ItemType Directory -Path '${dir}' -Force | Out-Null`]);
  }
  execFileSync(cwebp, ['-lossless', srcPng, '-o', dstWebp, '-quiet'], { stdio: 'inherit' });
}

export function buildAtlas(levelPngs, dstAtlasWebp) {
  const dir = dirname(dstAtlasWebp);
  if (!existsSync(dir)) {
    execFileSync('powershell.exe', ['-NoProfile', '-Command', `New-Item -ItemType Directory -Path '${dir}' -Force | Out-Null`]);
  }
  const tempAtlasPng = dstAtlasWebp.replace(/\\.webp$/, '_temp.png');
  const pngList = levelPngs.map(p => `'${p.replace(/\\/g, '\\\\')}'`).join(',');
  const psScript = `
    Add-Type -AssemblyName System.Drawing
    $files = @(${pngList})
    $atlas = New-Object System.Drawing.Bitmap(1280, 256, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($atlas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    for ($i = 0; $i -lt 5; $i++) {
        $frame = [System.Drawing.Bitmap]::FromFile($files[$i])
        $destRect = New-Object System.Drawing.Rectangle(($i * 256), 0, 256, 256)
        $g.DrawImage($frame, $destRect, 0, 0, $frame.Width, $frame.Height, [System.Drawing.GraphicsUnit]::Pixel)
        $frame.Dispose()
    }
    $g.Dispose()
    $atlas.Save('${tempAtlasPng.replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
    $atlas.Dispose()
  `;
  execFileSync('powershell.exe', ['-NoProfile', '-Command', psScript], { stdio: 'inherit' });
  encodePngToWebp(tempAtlasPng, dstAtlasWebp);
  execFileSync('powershell.exe', ['-NoProfile', '-Command', `Remove-Item '${tempAtlasPng}' -Force`]);
}

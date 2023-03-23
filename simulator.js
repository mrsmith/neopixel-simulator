class NeoPixelStrip {
  constructor(numPixels) {
    this.strip = document.querySelector('.strip');
    this.pixels = new Array(numPixels).fill({ r: 0, g: 0, b: 0 });

    for (let i = 0; i < numPixels; i++) {
      const pixelDiv = document.createElement('div');
      pixelDiv.className = 'pixel';
      this.strip.appendChild(pixelDiv);
    }
  }

  setColor(index, r, g, b) {
    this.pixels[index] = { r, g, b };
    this.strip.children[index].style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }

  fill(r, g, b) {
    for (let i = 0; i < this.pixels.length; i++) {
      this.setColor(i, r, g, b);
    }
  }
}

class RainbowClumpEffect {
  constructor(strip, clumpSize, speed) {
    this.strip = strip;
    this.clumpSize = clumpSize;
    this.speed = speed;
    this.i = -6;
    this.rainbowStep = 0;
  }

  rainbowColor(step) {
    let r = 0, g = 0, b = 0;
    const pos = step % 1536;

    if (pos < 256) {
      r = 255 - pos;
      g = pos;
    } else if (pos < 512) {
      g = 255 - (pos - 256);
      b = pos - 256;
    } else if (pos < 768) {
      g = pos - 512;
      b = 255 - (pos - 512);
    } else if (pos < 1024) {
      r = pos - 768;
      b = 255 - (pos - 768);
    } else if (pos < 1280) {
      r = 255 - (pos - 1024);
      b = pos - 1024;
    } else {
      r = pos - 1280;
      g = 255 - (pos - 1280);
    }

    return { r, g, b };
  }

  loop() {
    this.strip.fill(0, 0, 0);
    const color = this.rainbowColor(this.rainbowStep);

    for (let j = this.i; j < this.i + this.clumpSize; j++) {
      if (j >= 0 && j < this.strip.pixels.length) {
        this.strip.setColor(j, color.r, color.g, color.b);
      }
    }

    this.i = (this.i + 1) % (this.strip.pixels.length + this.clumpSize);
    this.rainbowStep = (this.rainbowStep + 1) % 1536;
  }
}

const NUMPIXELS = 37;
const strip = new NeoPixelStrip(NUMPIXELS);
const effect = new RainbowClumpEffect(strip, 7, 30);

function loop() {
  effect.loop();
  setTimeout(loop, effect.speed);
}

loop();

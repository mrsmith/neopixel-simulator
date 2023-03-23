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
    this.rainbowSpeed = 3;
  }

  rainbowColor(hue) {
    var h = hue;
    var s = 256; // Saturation value
    var v = 256; // Value value
    var hi = Math.floor(h / 43); // Calculate which section of the color wheel we're in
    var f = (h - hi * 43) * 6; // Calculate the fractional distance between hues

    var p = (v * (256 - s)) >> 8;
    var q = (v * (256 - ((s * f) >> 8))) >> 8;
    var t = (v * (256 - ((s * (256 - f)) >> 8))) >> 8;

    var r, g, b;
    switch (hi) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
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
    this.rainbowStep = (this.rainbowStep + this.rainbowSpeed) % 256;
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

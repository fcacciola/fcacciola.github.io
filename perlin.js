//
// TAKEN FROM http://itc-station.org/perlin
//

class Perlin {
  // Scale is a distance between grid nodes
  constructor(width, height, scale)  {  this.resize(width, height, scale);}
  // Array index of unit vector at (x, y) integer coordinates
  indexOf(x, y) {
      x = x >= 0 ? (x % this.width) : (this.width + (x % this.width));
      y = y >= 0 ? (y % this.height) : (this.height + (y % this.height));
      return y * this.width + x;
  }
  // Unit vector at (x, y) integer coordinates
  value(x, y) { return this.values[this.indexOf(x, y)] }

  // Perlin noise value at (x, y) real coordinates
  get(x, y){
      // Rescale x and y according to the grid scale
      x /= this.scale;
      y /= this.scale;

      // Integer coordinates of the requested point
      const floor = {x : Math.floor(x), y : Math.floor(y)};

      // Unit vectors of the nearest grid nodes
      const v1 = this.value(floor.x,     floor.y);
      const v2 = this.value(floor.x + 1, floor.y);
      const v3 = this.value(floor.x,     floor.y + 1);
      const v4 = this.value(floor.x + 1, floor.y + 1);

      // Local coordinates of the requested point
      const local = {x : x - floor.x, y : y - floor.y};

      // Vectors that point to the requested point
      const p1 = {x : local.x,     y : local.y};
      const p2 = {x : local.x - 1, y : local.y};
      const p3 = {x : local.x,     y : local.y - 1};
      const p4 = {x : local.x - 1, y : local.y - 1};

      // Dot products of grid unit vectors and pointing vectors
      const d1 = dot(v1, p1);
      const d2 = dot(v2, p2);
      const d3 = dot(v3, p3);
      const d4 = dot(v4, p4);

      // Interpolate between dot products 1 and 2 by quintic(x)
      const ix1 = lerp(d1, d2, quintic(local.x));

      // Interpolate between dot products 3 and 4 by quintic(x)
      const ix2 = lerp(d3, d4, quintic(local.x));

      // Interpolate between two previous results by quintic(y)
      return lerp(ix1, ix2, quintic(local.y));
  }

  // Resize the grid and fill it with random unit vectors
  resize(width, height, scale) {
      this.width = width;
      this.height = height;
      this.scale = scale;
      this.values = new Array(width * height);
      for(let n = 0; n < this.values.length; ++n){ this.values[n] = unitVector();}
  }
}


class Grid {
  constructor(width, height){  this.resize(width, height);}
  // Index of the value in (x, y) coordinates
  indexOf(x, y) {
      x = x >= 0 ? (x % this.width) : (this.width + (x % this.width));
      y = y >= 0 ? (y % this.height) : (this.height + (y % this.height));
      return y * this.width + x;
  }
  get(x, y){   return this.values[this.indexOf(x, y)];}
  resize(width, height) {
      this.width = width;
      this.height = height;
      this.values = new Array(width * height);
  }
  noise() {
      for(let n = 0; n < this.values.length; ++n)
      {
          this.values[n] = Math.random() * 2 - 1;
      }
  }
  fill(value) { this.values.fill(value);}
  generate(generator){
      for(let y = 0; y < this.height; ++y) {
          for(let x = 0; x < this.width; ++x) {
              this.values[this.indexOf(x, y)] = generator.get(x, y);
          }
      }
  }
  accumulate(generator, factor){
      //factor = factor || 1;
      for(let y = 0; y < this.height; ++y){
          for(let x = 0; x < this.width; ++x){
              this.values[this.indexOf(x, y)] += generator.get(x, y) * factor;
          }
      }
  }
  blur(depth){
      for(let n = 0; n < depth; ++n){
          const buffer = new Array(this.values.length);
          for(let y = 0; y < this.height; ++y){
              for(let x = 0; x < this.width; ++x){
                  buffer[this.indexOf(x, y)] =
                     (this.get(x - 1, y + 1) + this.get(x, y + 1) + this.get(x + 1, y + 1) +
                      this.get(x - 1, y    ) + this.get(x, y    ) + this.get(x + 1, y    ) +
                      this.get(x - 1, y - 1) + this.get(x, y - 1) + this.get(x + 1, y - 1)) / 9;
              }
          }
          this.values = buffer;
      }
  }
  fractalNoise(depth){
      const buffer = this.values.slice();
      for(let y = 0; y < this.height; ++y){
          for(let x = 0; x < this.width; ++x){
              for(let n = 1; n <= depth; ++n){
                  const factor = Math.pow(2, n);
                  buffer[this.indexOf(x, y)] += this.get(x * factor, y * factor) / (n * n);
              }
          }
      }
      this.values = buffer;
  }
  normalize() {
      let max = 0;
      for(let n = 0; n < this.values.length; ++n)  {
          if(Math.abs(this.values[n]) > max){
              max = Math.abs(this.values[n])
          }
      }
      if(max) {
          for(let n = 0; n < this.values.length; ++n){
              this.values[n] /= max
          }
      }
  }
  draw(canvas, colors) {
      const context = canvas.getContext("2d")
      const imageData = context.createImageData(this.width, this.height)
      for(let y = 0; y < this.height; ++y){
          for(let x = 0; x < this.width; ++x) {
              let value = this.get(x, y) * 255
              // imageData.data is array of RGBA values, four values per pixel
              let n = this.indexOf(x, y) * 4
              const color = value >= 0 ? colors.positive : colors.negative
              value = Math.abs(value)
              imageData.data[n++] = color.r * value
              imageData.data[n++] = color.g * value
              imageData.data[n++] = color.b * value
              imageData.data[n] = 255
          }
      }
      context.putImageData(imageData, 0, 0)
  }
}



// ============ Maths for Perlin
// Dot product of vectors
function dot(a, b) {return a.x * b.x + a.y * b.y }
// Linear interpolation between a and b
function lerp(a, b, t){  return a + (b - a) * t }
// Smoothstep value
function smoothstep(t){ return t * t * (3 - 2 * t) }
// Quintic function
function quintic(t) { return t * t * t * (t * (t * 6 - 15) + 10) }
// Random unit vector generator
function unitVector() {
  const phi = 2 * Math.PI * Math.random()
  return {x : Math.cos(phi), y : Math.sin(phi)}
}
// Handy function to generate nice color pairs for positive and negative grid values
function colors(shift) {
  return {
      positive : {r : 0, g : 0, b : 0},
      negative : {r : 1, g : 1, b : 1}
  };
/*    return {
      positive : hue2rgb(shift),
      negative : hue2rgb(shift + 120)
  };*/
}

function hue2rgb(h) {
  h /= 360;
  let s = 1;
  let l = 0.5;
  const f = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1 / 6) return p + (q - p) * 6 * t;
      if(t < 1 / 2) return q;
      if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {r : f(p, q, h + 1 / 3), g : f(p, q, h), b : f(p, q, h - 1 / 3)};
}


class MyPerlin {
	constructor()
  {
		this.ncol = 3
		this.parameters = {}
		this.max_octave = 6
		this.octave = Array(this.ncol).fill(this.max_octave)
		this.zoom_init = 1
		this.zoom = Array(this.ncol).fill(this.zoom_init)
		this.maxs = Array(this.ncol * this.max_octave).fill(-Infinity)
		this.mins = Array(this.ncol * this.max_octave).fill(Infinity)
		this.height = 400 
    this.width = 400
		this.red = Array(this.ncol).fill(1);
    this.green = Array(this.ncol).fill(1);
    this.blue = Array(this.ncol).fill(1)
		this.scale = 0.8 // between preview and analysis canvas

		this.parameters['luminosity'] = Array(this.ncol).fill([1.3,0.9,0.5,0.3,0.2,0.1,0.1,0.1,0.35,0.35])
		this.parameters['contrast'] = Array(this.ncol).fill([3.2,3.2,3.2,3.2,3.2,3.2,3.2,2.2,0.35,0.35])
		this.parameters['threshold'] = Array(this.ncol).fill([0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.35])
		this.red = [0.6,0.9,0.2,0.8,0.5,0.2,0.8,0.5,0.2,0.8,0.5,0.2]
		this.green = [0.7,0.8,0.4,0.8,0.5,0.2,0.8,0.5,0.2,0.8,0.5,0.2]
		this.blue = [1,0.5,0.5,0.8,0.5,0.2,0.8,0.5,0.2,0.8,0.5,0.2]
		this.octave = [6,6,5,3,3,3,3,3,3,3,3]
    this.Keith_parameters = "3;3140;6,6,6,3,3,3,3,3,3,3,3;1.5,1.5,1.5,1,1,1;0,0,0,0,0,0;.6,.9,0.2,0.8,0.5,0.2,0.8,0.5,0.2,0.8,0.5,0.2;0.7,.8,0.4,0.8,0.5,0.2,0.8,0.5,0.2,0.8,0.5,0.2;1,.5,0.5,0.8,0.5,0.2,0.8,0.5,0.2,0.8,0.5,0.2;1.3,0.9,0.5,0.3,0.2,0.1,0.1,0.1,0.35,0.35;1.3,0.9,0.5,0.3,0.2,0.1,0.1,0.1,0.35,0.35;1.3,0.9,0.5,0.3,0.2,0.1,0.1,0.1,0.35,0.35;2.9,2.9,2.9,2.9,2.9,2.9,3.2,2.2,0.35,0.35;2.9,2.9,2.9,2.9,2.9,2.9,3.2,2.2,0.35,0.35;2.9,2.9,2.9,2.9,2.9,2.9,3.2,2.2,0.35,0.35;0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.35;0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.35;0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.35"
	}

	contrast_fun(val,contr,thr,a,b) {
		var ex = Math.exp((thr-val)/contr)
		return a*(1/(1+ex) -1/2)+b
	}

    drawFrame() 
    {
        const grid = []
        var perlus = []
        var canvas = document.getElementById("perlin_cva")
        const context = canvas.getContext("2d");
        const imageData = context.createImageData(this.width, this.height);
        for (let col=0; col<this.ncol; ++col) {
            var shift = 0
            grid.push(new Grid(this.width,this.height))
            grid[col].fill(0);
            for(let i = 0; i < this.octave[col]; ++i){
                var contr = Math.pow(10,3-this.parameters['contrast'][col][i])
                var thr = this.parameters['threshold'][col][i]
                var ex1 = Math.exp(thr/contr)
                var ex2 = Math.exp((thr-1)/contr)
                var a = 1/(1/(1+ex2)-1/(1+ex1))
                var b = a*(1/2 -1/(1+ex1))
    
    
                const factor = Math.pow(2,i)
                var zoom = 0.18 //Math.max(this.zoom[col],0.18)
                var perluss = new Perlin(20 * factor, 20 * factor,Math.floor(zoom* 200 / factor))
                for(let y = 0; y < grid[col].height; ++y){
                    for(let x = 0; x < grid[col].width; ++x){
                        var value = perluss.get(x, y) * this.parameters['luminosity'][col][i]
                        if (true || this.params_changed) {
                            if (value < this.mins[col,i]) { this.mins[col,i] = value }
                            if (value > this.maxs[col,i]) { this.maxs[col,i] = value }
                        }
                        var val = (value-this.mins[col,i])/(this.maxs[col,i]-this.mins[col,i]+0.001) 
                        var vall = (this.maxs[col,i]-this.mins[col,i])*this.contrast_fun(val,contr,thr,a,b)+this.mins[col,i]
                        grid[col].values[grid[col].indexOf(x, y)] += -vall*255
                    }
                }
            }
        }
        for (let col=0; col<this.ncol; ++col) {
            for(let y = 0; y < grid[0].height; ++y){
                for(let x = 0; x < grid[0].width; ++x){
                    let val = grid[col].get(x, y)
                    let n = grid[0].indexOf(x, y) * 4;
                    imageData.data[n++] += this.red[col] *val + shift
                    imageData.data[n++] += this.green[col] *val + shift
                    imageData.data[n++] += this.blue[col] *val + shift
                    imageData.data[n] += 255 + shift
                }
            }
        }
        context.putImageData(imageData, 0, 0);
    }
}




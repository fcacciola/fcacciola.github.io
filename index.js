class SyneidolikOne
{
	constructor()
  {
    this.gIdx=0 ;
    this.cSize=5 ;
    this.cTotal=this.cSize*this.cSize;
  
    this.colors = { 'a' : [ "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan", 
                          ] ,
                   'b' :  [ "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
                            "cyan", "cyan" ,"cyan", "cyan" ,"cyan", 
                          ] ,
                        }

    this.perlin = new MyPerlin();
  }

  resetInfo()
  {
    document.getElementById("info").innerHTML = "";  
  }
  
  setInfo(text)
  {
    document.getElementById("info").innerHTML = text + "\n";  
  }
  
  addInfo(text)
  {
    document.getElementById("info").innerHTML += text + "\n";  
  }
  
  help_0()
  {
    this.setInfo
    (
    `
  When learnig how to use this, first click on Show. You will see two 5x5 tiles. 
  The tile on the Right has a computer generated black and white pattern.
  The tile on the Left is your tile.
  Your goal is to complete the tile on the left such that it matches the computer generated pattern, but WITHOUT seeing it, by guessing, one at a time, each cell color (black or white).
  At each guessing step, you will be given a secret, hidden message, that will tell you, SUBLIMINALLY, the correct color of the corresponding computer generated cell.
  After all cells have been choosen (right or wrong), the computer generated pattern will be shown to the right.
  You will also be given a score based on how many cells you have guessed correctly.

  Click on Start to give it a try. When finished, you can click on Start again to repeat it.
  You can click on Reset to regenerate the pattern (and you can click on Show again to see it).

  GOOD LUCK!
    `
    )
  }
  
  get_cell(g,r,c)
  {
    return document.getElementById(g + r + c );
  }
  
  setup_cell(g,r,c,x,y)
  {
    var cell = this.get_cell(g,r,c);
    cell.style.position = "absolute";
    cell.style.left = x + "px";
    cell.style.top = y + "px" ;
  }
  
  hide_cell(g,r,c)
  {
    var cell = this.get_cell(g,r,c);
    cell.style.display = "none";
  }
  
  show_cell(g,r,c)
  {
    var cell = this.get_cell(g,r,c);
    cell.style.display = "block";
  }
  
  set_cell_color(g,r,c,clr)
  {
    var cell = this.get_cell(g,r,c);
    cell.style.background = clr ;
  }
  
  is_cell_white(r,c)
  {
    var cell = this.get_cell('b',r,c);
    return cell.style.background == 'white';
  }
  
  set_cell_color_by_idx(g,aIdx,clr)
  {
    var r = Math.floor(aIdx / this.cSize);
    var c = aIdx - ( r * this.cSize ) ;
    this.set_cell_color(g,r,c,clr);
    this.show_cell(g,r,c);
  }

  setup_grid(g)
  {
    var lx = g == 'a' ? 15 : 260 ;
    var ly = 120 ;
  
    for( var r = 0 ; r < this.cSize ; ++ r ) 
    {
      for ( var c = 0 ; c < this.cSize ; ++ c )
      {
        var x = lx + c * 45 ;
        var y = ly + r * 45 ; 
        this.setup_cell(g, r, c, x, y);
  
      }
    }
  }
  
  setup_grids()
  {
    this.setup_grid('a');
    this.setup_grid('b');
  }
  
  hide_grid(g)
  {
    for( var r = 0 ; r < this.cSize ; ++ r ) 
    {
      for ( var c = 0 ; c < this.cSize ; ++ c )
      {
        this.hide_cell(g,r,c);
      }
    }
  }
  
  show_grid(g)
  {
    for( var r = 0 ; r < this.cSize ; ++ r ) 
    {
      for ( var c = 0 ; c < this.cSize ; ++ c )
      {
        this.show_cell(g,r,c);
      }
    }
  }
  
  hide_grids()
  {
    this.hide_grid('a');
    this.hide_grid('b');
  }
  
  show_grids()
  {
    this.show_grid('a');
    this.show_grid('b');
  }
  
  setup_random_grid()
  {
    for( var r = 0 ; r < this.cSize ; ++ r ) 
    {
      for ( var c = 0 ; c < this.cSize ; ++ c )
      {
        var color = ( this.random_even_odd() ? "white" : "black" ) ;
    
        this.set_cell_color('b', r, c, color);
        this.colors['b'][(r*this.cSize)+c] = color ;
      }
    }
  
    this.setup_micro_image();
  }
  
  set_micro_image_pixel_color( ctx, x, y, r, g, b ) 
  {
    var imgData = ctx.getImageData(x, y, 1, 1);
    imgData.data[0] = r;
    imgData.data[1] = g;
    imgData.data[2] = b;
    imgData.data[3] = 255;
    ctx.putImageData(imgData, x, y);        
  
    //addInfo("setting pixel x=" + x + " y=" + y + " r=" + r + " g=" + g + " b=" + b) ;
    
  }
  
  set_micro_image_pixel_color_white( ctx, x, y) 
  {
    this.set_micro_image_pixel_color(ctx, x, y, 255, 255, 255);
  }
  
  set_micro_image_pixel_color_black( ctx, x, y) 
  {
    this.set_micro_image_pixel_color(ctx, x, y, 0, 0, 0);
  }
  
  get_random_color_channel()
  {
    var rnd  = Math.random();
    var irnd = Math.floor(rnd * 255) ;
    return irnd ;
  
  }
  
  set_micro_image_pixel_color_random( ctx, x, y) 
  {
    var r = this.get_random_color_channel();  
    var g = this.get_random_color_channel();  
    var b = this.get_random_color_channel();  
    this.set_micro_image_pixel_color(ctx, x, y, r, g, b);
  }
  
  setup_micro_image()
  {
    const canvas = document.getElementById('micro_image');
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
  
    for( var y = 0 ; y < 15 ; ++ y ) 
    {
      for ( var x = 0 ; x < 15 ; ++ x )
      {
        var in_cell = false ; 
        if ( x >= 5 && x < 10 )
        {
          if ( y >= 0 && y < 5 )
          {
            if ( this.is_cell_white(y,x-5) )
                 this.set_micro_image_pixel_color_white(ctx,x,y) ;
            else this.set_micro_image_pixel_color_black(ctx,x,y) ;
  
            in_cell = true ;
          }
        }
        if ( ! in_cell )
          this.set_micro_image_pixel_color_random(ctx,x,y) ;
      }
    }
  }
  
  clear_hint_image()
  {
    const canvas = document.getElementById('perlin_cva');
    const ctx = canvas.getContext('2d');  
    
    for( var y = 0 ; y < canvas.height ; ++ y ) 
    {
      for ( var x = 0 ; x < canvas.width ; ++ x )
      {
        this.set_micro_image_pixel_color_white(ctx,x,y) ;   
      }
    }
  
  }
  
  random_even_odd()
  {
    var rnd = Math.random();
    var irnd = Math.floor(rnd * 1000) ;
    var even = ( irnd % 2 ) == 0 ;
    return even ;
  }
  
  
  //
  // Perlin Noise image taken from
  // https://github.com/joeiddon/perlin/blob/master/demo.html
  //
  // const GRID_SIZE = 6;
  // const RESOLUTION = 200;
  // const COLOR_SCALE = 250;
  
  setup_hint_image()
  {

    this.perlin.drawFrame()
    // const canvas = document.getElementById('perlin_box');
    // const ctx = canvas.getContext('2d');  
    
    // let pixel_size = canvas.width / RESOLUTION;
    // let num_pixels = GRID_SIZE / RESOLUTION;
  
    // perlin.seed();
    // for (let y = 0; y < GRID_SIZE; y += num_pixels / GRID_SIZE)
    // {
    //   for (let x = 0; x < GRID_SIZE; x += num_pixels / GRID_SIZE)
    //   {
    //     let v = parseInt(perlin.get(x, y) * COLOR_SCALE);
    //     ctx.fillStyle = 'hsl('+v+',50%,50%)';
    //     ctx.fillRect(x / GRID_SIZE * canvas.width, y / GRID_SIZE * canvas.width, pixel_size, pixel_size );      
  
    //   }
    // }
  
  }
  
  setup_choice_grid()
  {
    for( var r = 0 ; r < this.cSize ; ++ r ) 
    {
      for ( var c = 0 ; c < this.cSize ; ++ c )
      {
        this.set_cell_color('a', r, c, this.colors['a'][(r*this.cSize)+c]);
      }
    }
  
  }
  
  calculate_score()
  {
    var score = 0 ; 
    for( var i = 0 ; i < this.cTotal ; ++ i )
      score += ( this.colors['a'][i] == this.colors['b'][i] ? +1 : -1 ) ;
    return score ;
  }
  
  show_score(score)
  {
    var success = ( score + 25 ) * 2 ;
    document.getElementById("score").innerHTML = `Score: ${score} points (+1/-1 for each correct/incorrect color). ${success}% successful.`;  
  }
  
  reset_score()
  {
    document.getElementById("score").innerHTML = `Score:`;  
  }
  
  set_next_cell_color(color)
  {
    if ( this.gIdx < this.cTotal )
    {
      this.colors['a'][this.gIdx] =color ;
  
      this.gIdx = this.gIdx + 1 ;

      if ( this.gIdx < this.cTotal )
        this.ready_for_next_choice();
    }
  
    if ( this.gIdx >= this.cTotal )
    {
      this.setup_choice_grid();
      this.show_grids();
      this.show_score( this.calculate_score() );
    }
  }
  
  set_next_cell_as_white()
  {
    this.set_next_cell_color("white");
  }
  
  set_next_cell_as_black()
  {
    this.set_next_cell_color("black");
  }
  
  reset()
  {
    this.gIdx = 0 ;
    this.setup_random_grid()
    this.hide_grids();
    this.clear_hint_image();
    this.reset_score();
  }
  
  ready_for_next_choice()
  {
    if ( this.gIdx > 0 )
    {
      this.set_cell_color_by_idx('a',this.gIdx-1,this.colors['a'][this.gIdx-1]);
    }

    this.set_cell_color_by_idx('a',this.gIdx,"Gray");

    this.setup_hint_image();
  
    var even = this.random_even_odd(); 
    var color1 = even ? 'WHITE' : 'BLACK' ;
    var color2 = even ? 'BLACK' : 'WHITE' ;
  
    var r = Math.floor(this.gIdx / this.cSize);
    var c = this.gIdx - ( r * this.cSize ) ;
  
    this.setInfo
    (
    `
  Now you have to guess whether the (hidden) computer generated color at row ${r+1} and column ${c+1} is either black or white.
     
  In order to figure that out, imagine that there is an invisible person that is sitting right next to you.
  He knows the correct color and is telling you which is it. But secretly, so that no one else knows it too.
  
  That (imaginary) invisible person is telling you the correct color by hiding a non-written, symbolic message in the odd-looking color image to the left.
  
  Imagine that the hidden message is somehow indicating, BUT WIHTOUT USING WORDS, the correct color (${color1} or ${color2}).
  Try as hard as you can to discover and interpret the hidden message in the image. 
    
  TAKE YOUR TIME.
    
  Once you FEEL that you've got the correct answer, click on either one of the ${color2} or ${color1} boxes below the image.
  The program will move to the next cell after each color selection, until your have guessed all cells.
  At the end, the hidden pattern will be revealed and a score will be calculated.

  You can click on Start to do it all over again.
    `
    )
  
  }
  
  start_choosing()
  {
    this.reset();  
    this.gIdx = 0 ;
    this.ready_for_next_choice();
  }
  
  init()
  {
    this.setup_grids();
    this.reset();
    this.setInfo('Click on FIRST TIME INSTRUCTIONS, or click on Start if you already know what to do.')
  }
  
}

prog = new SyneidolikOne();

prog.init();

function help_0() { prog.help_0(); }
function start_choosing() { prog.start_choosing(); }
function show_grids() { prog.show_grids(); }
function hide_grids() { prog.hide_grids(); }
function set_next_cell_as_black() { prog.set_next_cell_as_black(); }
function set_next_cell_as_white() { prog.set_next_cell_as_white(); }
function reset() { prog.reset(); }
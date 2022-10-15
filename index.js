gIdx=0 ;
cSize=5 ;
cTotal=cSize*cSize;

function resetInfo()
{
  document.getElementById("info").innerHTML = "";  
}

function setInfo(text)
{
  document.getElementById("info").innerHTML = text + "\n";  
}

function addInfo(text)
{
  document.getElementById("info").innerHTML += text + "\n";  
}

function help_0()
{
  setInfo
  (
  `
When learnig how to use this, first click on Show. You will see two 5x5 tiles. 
The tile on the Right has a computer generated black and white pattern.
You can click on Reset to regenerate the pattern (and you can click on Show again to see it).
Your goal is to match the computer generated pattern WITHOUT seeing it, by guessing each cell color (black or white), one at a time.
For each of the nine cells, you will be given a secretly hidden message that should tell you, subliminally,the correct color of the corresponding cell.
After all 25 cells have been choosen (right or wrong), your pattern will be shown on the left, and the computer generated pattern on the right.
You will also be given a Score based on how many cells you guessed correctly.
Click on Start to give it a try. When finished, you can click on Start again to repeat it.
GOOD LUCK!
  `
  )
}

function get_cell(g,r,c)
{
  return document.getElementById(g + r + c );
}

function setup_cell(g,r,c,x,y)
{
  cell = get_cell(g,r,c);
  cell.style.position = "absolute";
  cell.style.left = x + "px";
  cell.style.top = y + "px" ;
}

function hide_cell(g,r,c)
{
  cell = get_cell(g,r,c);
  cell.style.display = "none";
}

function show_cell(g,r,c)
{
  cell = get_cell(g,r,c);
  cell.style.display = "block";
}

function set_cell_color(g,r,c,clr)
{
  cell = get_cell(g,r,c);
  cell.style.background = clr ;
}

function is_cell_white(r,c)
{
  cell = get_cell('b',r,c);
  return cell.style.background == 'white';
}

function set_cell_color_by_idx(g,gIdx,clr)
{
  r = Math.floor(gIdx / cSize);
  c = gIdx - ( r * cSize ) ;
  set_cell_color(g,r,c,clr);
  show_cell(g,r,c);
}

colors = { 'a' : [ "cyan", "cyan" ,"cyan", "cyan" ,"cyan",
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

function setup_grid(g)
{
  lx = g == 'a' ? 25 : 300 ;
  ly = 120 ;

  for( r = 0 ; r < cSize ; ++ r ) 
  {
    for ( c = 0 ; c < cSize ; ++ c )
    {
      x = lx + c * 45 ;
      y = ly + r * 45 ; 
      setup_cell(g, r, c, x, y);

    }
  }
}

function setup_grids()
{
  setup_grid('a');
  setup_grid('b');
}

function hide_grid(g)
{
  for( r = 0 ; r < cSize ; ++ r ) 
  {
    for ( c = 0 ; c < cSize ; ++ c )
    {
      hide_cell(g,r,c);
    }
  }
}

function show_grid(g)
{
  for( r = 0 ; r < cSize ; ++ r ) 
  {
    for ( c = 0 ; c < cSize ; ++ c )
    {
      show_cell(g,r,c);
    }
  }
}

function hide_grids()
{
  hide_grid('a');
  hide_grid('b');
}

function show_grids()
{
  show_grid('a');
  show_grid('b');
}

function setup_random_grid()
{
  for( r = 0 ; r < cSize ; ++ r ) 
  {
    for ( c = 0 ; c < cSize ; ++ c )
    {
      color = ( random_even_odd() ? "white" : "black" ) ;
  
      set_cell_color('b', r, c, color);
      colors['b'][(r*cSize)+c] = color ;
    }
  }

  setup_micro_image();
}

function set_micro_image_pixel_color( ctx, x, y, r, g, b ) 
{
  var imgData = ctx.getImageData(x, y, 1, 1);
  imgData.data[0] = r;
  imgData.data[1] = g;
  imgData.data[2] = b;
  imgData.data[3] = 255;
  ctx.putImageData(imgData, x, y);        

  //addInfo("setting pixel x=" + x + " y=" + y + " r=" + r + " g=" + g + " b=" + b) ;
  
}

function set_micro_image_pixel_color_white( ctx, x, y) 
{
  set_micro_image_pixel_color(ctx, x, y, 255, 255, 255);
}

function set_micro_image_pixel_color_black( ctx, x, y) 
{
  set_micro_image_pixel_color(ctx, x, y, 0, 0, 0);
}

function get_random_color_channel()
{
  rnd  = Math.random();
  irnd = Math.floor(rnd * 255) ;
  return irnd ;

}

function set_micro_image_pixel_color_random( ctx, x, y) 
{
  r = get_random_color_channel();  
  g = get_random_color_channel();  
  b = get_random_color_channel();  
  set_micro_image_pixel_color(ctx, x, y, r, g, b);
}

function setup_micro_image()
{
  const canvas = document.getElementById('micro_image');
  const ctx = canvas.getContext('2d', {willReadFrequently: true});

  for( y = 0 ; y < 15 ; ++ y ) 
  {
    for ( x = 0 ; x < 15 ; ++ x )
    {
      in_cell = false ; 
      if ( x >= 0 && x < 5 )
      {
        if ( y >= 0 && y < 5 )
        {
          if ( is_cell_white(y,x) )
               set_micro_image_pixel_color_white(ctx,x,y) ;
          else set_micro_image_pixel_color_black(ctx,x,y) ;

          in_cell = true ;
        }
      }
      if ( ! in_cell )
        set_micro_image_pixel_color_random(ctx,x,y) ;
    }
  }
}

function clear_hint_image()
{
  const canvas = document.getElementById('aca');
  const ctx = canvas.getContext('2d');  
  
  for( y = 0 ; y < 400 ; ++ y ) 
  {
    for ( x = 0 ; x < 400 ; ++ x )
    {
      set_micro_image_pixel_color_white(ctx,x,y) ;   
    }
  }

}

function random_even_odd()
{
  rnd = Math.random();
  irnd = Math.floor(rnd * 1000) ;
  even = ( irnd % 2 ) == 0 ;
  return even ;
}

function setup_hint_image()
{
  const canvas = document.getElementById('aca');
  const ctx = canvas.getContext('2d');  
  
  for( y = 0 ; y < 400 ; ++ y ) 
  {
    for ( x = 0 ; x < 400 ; ++ x )
    {
      if ( random_even_odd() )
           set_micro_image_pixel_color_white(ctx,x,y) ;   
      else set_micro_image_pixel_color_black(ctx,x,y) ;
    }
  }

}

function setup_choice_grid()
{
  for( r = 0 ; r < cSize ; ++ r ) 
  {
    for ( c = 0 ; c < cSize ; ++ c )
    {
      set_cell_color('a', r, c, colors['a'][(r*cSize)+c]);
    }
  }

}

function calculate_score()
{
  score = 0 ; 
  for( i = 0 ; i < cTotal ; ++ i )
    score += ( colors['a'][i] == colors['b'][i] ? +1 : -1 ) ;
  return score ;
}

function show_score(score)
{
  document.getElementById("score").innerHTML = `Score: ${score} points (+1/-1 for each correct/incorrect color).`;  
}

function set_next_cell_color(color)
{
  if ( gIdx < cTotal )
  {
    colors['a'][gIdx] =color ;

    ++ gIdx ;
    if ( gIdx < cTotal )
      ready_for_next_choice();
  }

  if ( gIdx >= cTotal )
  {
    setup_choice_grid();
    show_grids();
    show_score( calculate_score() );
  }
}

function set_next_cell_as_white()
{
  set_next_cell_color("white");
}

function set_next_cell_as_black()
{
  set_next_cell_color("black");
}

function reset()
{
  gIdx = 0 ;
  setup_random_grid()
  hide_grids();
  clear_hint_image();
  show_score(0);
}

function ready_for_next_choice()
{
  if ( gIdx > 0 )
    set_cell_color_by_idx('a',gIdx-1,"LightGray");
  set_cell_color_by_idx('a',gIdx,"gray");
  setup_hint_image();

  even = random_even_odd(); 
  color1 = even ? 'WHITE' : 'BLACK' ;
  color2 = even ? 'BLACK' : 'WHITE' ;

  r = Math.floor(gIdx / cSize);
  c = gIdx - ( r * cSize ) ;

  setInfo
  (
  `
Now you have to guess whether the (hidden) computer generated color at row ${r+1} and column ${c+1},
shown above as a drak-gray cell, is either black or white.
   
In order to figure that out, imagine that there is an invisible person sitting right next to you.
He knows the correct color and is telling you which is it. But secretly, so that no one else knows it too.

That (imaginary) invisible person is telling you the correct color by hiding a non-written, symbolic message in the fuzzy image shown above. 

Imagine the hidden message somehow saying, BUT WIHTOUT USING WORDS, that the correct color is either ${color1} or ${color2}.
Try as hard as you can to discover the hidden message in the image. 
  
TAKE YOUR TIME.
  
Once you FEEL that you've got the correct answer, click on the large ${color2} or ${color1} box.
The program will move to the next cell after each color selection, until your have guessed all 25 cells.
At the end, the hidden pattern will be revealed for you to compare, and a score will be calculated.
  `
  )

}

function start_choosing()
{
  reset();  
  gIdx = 0 ;
  ready_for_next_choice();
}

function init()
{
  setup_grids();
  reset();
  
  setInfo
  (
  `
  Click on FIRST TIME INSTRUCTIONS if you have never used this before.
  Click on Start if you already know what to do.
  `
  )

}

init();
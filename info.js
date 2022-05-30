var cnv = document.getElementById('gameCanvas');
var ctx = cnv.getContext('2d');

var unit = [];
unit[0] = {x: 10, y: 10, r: 10, vx: 0, vy: 0};
unit[1] = {x: -30, y: -30, r: 20, vx: 0, vy: 0};
unit[2] = {x: -300, y: 240, r: 300, vx: 0, vy: 0};
unit[3] = {x: 0, y: -2000, r: 800, vx: 0, vy: 0};
var gravity = 0.99; //Slowing down rate

var key = {};
var mouse = {
  x: 0,
  y: 0
}

//Creates all circles
for (x=100; x<2000; x+=10 ) {
  for(y=100; y<400; y+=10) {
    unit[unit.length] = {x: x, y: y, r: 4, vx: 0, vy: 0};
  }
}

//keys
$(function() {
  $(document).keydown(function(evt) {
    switch(evt.keyCode) {
      case 87: // W key
        key.w = true;
        break;
      case 83: // S key
        key.s = true;
        break;
      case 68: // D key
        key.d = true;
        break;
      case 65: // A key
        key.a = true;
        break;
      case 16:
        key.shift = true;
        break;
    }
  }).keyup(function(evt) {
    switch(evt.keyCode) {
      case 87: // W key
        key.w = false;
        break;
      case 83: // S key
        key.s = false;
        break;
      case 68: // D key
        key.d = false;
        break;
      case 65: // A key
        key.a = false;
        break;
      case 16:
        key.shift = false;
        break;
      case 88:
        player.hidden = !player.hidden;
        break;
    }
  });
});

document.onmousemove = function(evt) {
  mouse.x = evt.pageX;
  mouse.y = evt.pageY;
}

Math.dist=function(x1, y1, x2, y2) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

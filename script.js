var possUnit = 0; //possessed particle

var squares = [];

setInterval(function() {
  velocity();
  movement();
  createCollisionBoundary();
  collision();
  drawCanvas();
}, 10);

function drawCanvas() {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;

  ctx.clearRect(0, 0, cnv.width, cnv.height);

  //Draw grid
  // for(x=-1000; x<=2000; x+= 250) {
  //   for(y=-1000; y<2000; y+= 250) {
  //     ctx.rect(x-unit[possUnit].x, y-unit[possUnit].y, 250, 250);
  //     ctx.stroke();
  //     }
  //   }

  //Draw circles
  for(i=0; i<unit.length; i++) {
    ctx.beginPath();
    ctx.arc(unit[i].x+cnv.width/2-unit[possUnit].x, unit[i].y+cnv.height/2-unit[possUnit].y, unit[i].r, 0, 2*Math.PI);
    ctx.stroke();
  }
}

function velocity() {
  //move possessed circle
  if (key.d == true && unit[possUnit].vx <= 10) {
    unit[possUnit].vx += 0.2;
  }

  if (key.a == true && unit[possUnit].vx >= -10) {
    unit[possUnit].vx -= 0.2;
  }

  if (key.s == true && unit[possUnit].vy <= 10) {
    unit[possUnit].vy += 0.2;
  }

  if (key.w == true && unit[possUnit].vy >= -10) {
    unit[possUnit].vy -= 0.2;
  }

  //Boulder
  if (unit[2].vx < 5) {
    unit[2].vx += 0.1;
  }
}

function movement() {

  for (i=0; i<unit.length; i++) {
    unit[i].x += unit[i].vx; //Move in dir of velocity
    unit[i].y += unit[i].vy;
    if (unit[i].vx != 0) {unit[i].vx *= gravity;}
    if (unit[i].vy != 0) {unit[i].vy *= gravity;}
    if (Math.abs(unit[i].vx) < 0.01 && Math.abs(unit[i].vx) > 0) {unit[i].vx = 0;}
    if (Math.abs(unit[i].vy) < 0.01 && Math.abs(unit[i].vy) > 0) {unit[i].vy = 0;}
  }
}

function createCollisionBoundary() { //dividing up entire space into a number of squares and only checking for collision in those squares also test nearby squares
  //square size = 250
  //play area is (-1000, -1000) to (2000, 2000)
  squares = []; //resets info

  for(x=-1000; x<=2000; x+= 250) { //12 squares per row
    for(y=-1000; y<2000; y+= 250) {
      squares[squares.length] = [];
      for (i=0; i<unit.length; i++) {
        if (unit[i].x+unit[i].r >= x && unit[i].x-unit[i].r <= x+250 && unit[i].y+unit[i].r >= y && unit[i].y-unit[i].r <= y+250) {
          squares[squares.length-1][squares[squares.length-1].length] = i;
        }
      }
    }
  }
}

function collision() {
  for (i=0; i<unit.length; i++) {
    if (unit[i].x < -1000) {unit[i].x = -1000; unit[i].vx = -unit[i].vx;}
    if (unit[i].x > 2000) {unit[i].x = 2000; unit[i].vx = -unit[i].vx;}
    if (unit[i].y < -1000) {unit[i].y = -1000; unit[i].vy = -unit[i].vy;}
    if (unit[i].y > 2000) {unit[i].y = 2000; unit[i].vy = -unit[i].vy;}
  }

  for (i=0; i<squares.length; i++) {
    if (squares[i].length > 1) {
      for(c=0; c<squares[i].length; c++) {
        for (c2=0; c2<squares[i].length; c2++) {
          if (c != c2) {
            var id = squares[i][c];
            var id2 = squares[i][c2];

            if (Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y) <= unit[id].r+unit[id2].r) {
              var angle = Math.atan2(unit[id].x - unit[id2].x, -(unit[id].y - unit[id2].y)) - Math.PI/2;

              //Static Collision
              var distance = Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);

              var overlapDis = (distance - unit[id].r - unit[id2].r)/2;

              // if (unit[id].r == unit[id2].r) {
              //   //Move circle #1
              //   unit[id].x -= overlapDis * (unit[id].x - unit[id2].x) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              //   unit[id].y -= overlapDis * (unit[id].y - unit[id2].y) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              //
              //   //Move circle #2
              //   unit[id2].x += overlapDis * (unit[id].x - unit[id2].x) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              //   unit[id2].y += overlapDis * (unit[id].y - unit[id2].y) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              // } else if (unit[id].r > unit[id2].r) {
              //   //Move circle #2
              //   unit[id2].x += overlapDis * (unit[id].x - unit[id2].x) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              //   unit[id2].y += overlapDis * (unit[id].y - unit[id2].y) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              // } else {
              //   //Move circle #1
              //   unit[id].x -= overlapDis * (unit[id].x - unit[id2].x) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              //   unit[id].y -= overlapDis * (unit[id].y - unit[id2].y) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              // }


                //move circle #1
                unit[id].x -= overlapDis * (unit[id].x - unit[id2].x) / distance;
                unit[id].y -= overlapDis * (unit[id].y - unit[id2].y) / distance;

                //Move circle #2
                unit[id2].x += overlapDis * (unit[id].x - unit[id2].x) / distance;
                unit[id2].y += overlapDis * (unit[id].y - unit[id2].y) / distance;

              //Dynamic Collison
              //Normal Vectors
              var nx = (unit[id2].x - unit[id].x) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              var ny = (unit[id2].y - unit[id].y) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);

              //Tangetal Vectors
              var tx = -ny;
              var ty = nx;

              //Dot Product Tangent
              var dpTan1 = unit[id].vx * tx + unit[id].vy * ty;
              var dpTan2 = unit[id2].vx * tx + unit[id2].vy * ty;

              //Dot Product Normal
              var dpNorm1 = unit[id].vx * nx + unit[id].vy * ny;
              var dpNorm2 = unit[id2].vx * nx + unit[id2].vy * ny;

              //Conservation of meomentum in 1D
              var m1 = (dpNorm1 * (unit[id].r - unit[id2].r) + 2 * unit[id2].r * dpNorm2) / (unit[id].r + unit[id2].r);
              var m2 = (dpNorm2 * (unit[id2].r - unit[id].r) + 2 * unit[id].r * dpNorm1) / (unit[id].r + unit[id2].r);

              unit[id].vx = tx * dpTan1 + nx * m1;
              unit[id].vy = ty * dpTan1 + ny * m1;
              unit[id2].vx = tx * dpTan2 + nx * m2;
              unit[id2].vy = ty * dpTan2 + ny * m2;
            }
          }
        }
      }
    }
  }
  //or at the beggining and every while compare all circles distances and only test for nearby circles
}

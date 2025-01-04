var possUnit = 0; //possessed particle
var squareSize = 25;
var worldSize = 8000;

var squares = [];

setInterval(function() {
  console.time();
  velocity();
  movement();
  createCollisionBoundary();
  collision();
  drawCanvas();
  console.timeEnd();
}, 10);

function drawCanvas() {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;

  //ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  //Draw circles
  ctx.fillStyle = "white";
  for(i=0; i<unit.length; i++) {
	var x = unit[i].x+cnv.width/2-unit[possUnit].x;
	var y = unit[i].y+cnv.height/2-unit[possUnit].y;
	var r = unit[i].r;
	if (x + r >= 0 && x - r <= cnv.width && y + r >= 0 && y - r <= cnv.height) {
	    ctx.beginPath();
	    ctx.arc(x, y, r, 0, 2*Math.PI);
	    ctx.fill();
	}
  }
  
/*
  //Draw grid
  ctx.strokeStyle = "yellow";
  for(x=0; x<worldSize; x+= squareSize) {
    for(y=0; y<worldSize; y+= squareSize) {
		ctx.rect(x-unit[possUnit].x, y-unit[possUnit].y, squareSize, squareSize);
		ctx.stroke();
	}
  }
*/
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
  if (unit[0].vx < 5) {
    //unit[0].vx += 0.1;
  }
}

function movement() {

  for (i=0; i<unit.length; i++) {
    unit[i].x += unit[i].vx; //Move in dir of velocity
    unit[i].y += unit[i].vy;
    if (unit[i].vx != 0) {unit[i].vx *= gravity;}
    if (unit[i].vy != 0) {unit[i].vy *= gravity; }//unit[i].vy += 1;}
    if (Math.abs(unit[i].vx) < 0.01 && Math.abs(unit[i].vx) > 0) {unit[i].vx = 0;}
    if (Math.abs(unit[i].vy) < 0.01 && Math.abs(unit[i].vy) > 0) {unit[i].vy = 0;}
  }
}

function createCollisionBoundary() { //dividing up entire space into a number of squares and only checking for collision in those squares also test nearby squares
  //square size = squareSize
  //play area is (-1000, -1000) to (2000, 2000)
  squares = []; //resets info

/*
  for(x=0; x<=worldSize; x+= squareSize) { //12 squares per row
    for(y=0; y<worldSize; y+= squareSize) {
      squares[squares.length] = [];
      for (i=0; i<unit.length; i++) {
        if (unit[i].x+unit[i].r >= x && unit[i].x-unit[i].r <= x+squareSize && unit[i].y+unit[i].r >= y && unit[i].y-unit[i].r <= y+squareSize) {
          squares[squares.length-1][squares[squares.length-1].length] = i;
        }
      }
    }
  }
*/

	var numSquaresHorizontal = worldSize / squareSize;
	var numSquares = numSquaresHorizontal * numSquaresHorizontal;
	for (i = 0; i < numSquares; i++) {
		squares[i] = [];
	}

	for (i = 0; i < unit.length; i++) {
		l = Math.max(0, Math.floor((unit[i].x - unit[i].r) / squareSize));
		r = Math.min(numSquaresHorizontal - 1, Math.floor((unit[i].x + unit[i].r) / squareSize));
		t = Math.max(0, Math.floor((unit[i].y - unit[i].r) / squareSize));
		b = Math.min(numSquaresHorizontal - 1, Math.floor((unit[i].y + unit[i].r) / squareSize));
		for (x = l; x <= r; x++) {
			for (y = t; y <= b; y++) {
				j = x + y * worldSize / squareSize;
				squares[j][squares[j].length] = i;
			}
		}
	}
}

function collision() {
  for (i=0; i<unit.length; i++) {
    if (unit[i].x < 0) {unit[i].x = 0; unit[i].vx = -unit[i].vx;}
    if (unit[i].x > worldSize) {unit[i].x = worldSize; unit[i].vx = -unit[i].vx;}
    if (unit[i].y < 0) {unit[i].y = 0; unit[i].vy = -unit[i].vy;}
    if (unit[i].y > worldSize) {unit[i].y = worldSize; unit[i].vy = -unit[i].vy;}
  }

  for (i=0; i<squares.length; i++) {
    if (squares[i].length > 1) {
      for(c=0; c<squares[i].length; c++) {
        for (c2=0; c2<squares[i].length; c2++) {
          if (c != c2) {
            var id = squares[i][c];
            var id2 = squares[i][c2];

		var dx = unit[id].x - unit[id2].x;
		var dy = unit[id].y - unit[id2].y;
		var distSqr = dx * dx + dy * dy;
		var rTot = unit[id].r + unit[id2].r;
            //if (Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y) <= unit[id].r+unit[id2].r) {
	if (distSqr <= rTot * rTot) {
              var angle = Math.atan2(unit[id].x - unit[id2].x, -(unit[id].y - unit[id2].y)) - Math.PI/2;

              //Static Collision
		var distance = Math.sqrt(distSqr);
              //var distance = Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);

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
              //var nx = (unit[id2].x - unit[id].x) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
              //var ny = (unit[id2].y - unit[id].y) / Math.dist(unit[id].x, unit[id].y, unit[id2].x, unit[id2].y);
		var nx = dx / distance;
		var ny = dy / distance;

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

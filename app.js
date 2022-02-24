// Accessing html canvas element by id
const canvas = document.querySelector("#tetris");
// 2d creates a CanvasRenderingContext2D object, enabling drawing with JS.
const context = canvas.getContext("2d");
// Two values given to context variable scale the canvas with x and y axis
context.scale(20, 20);

// MP3 sound effects accessed by html audio ids
const move = document.querySelector("#move");
const clear = document.querySelector("#clear");
const gameOver = document.querySelector("#game-over");
// Pause button functionality
const pause = document.querySelector("#pause");

// Event listener for pause button
// Put this inside playeMove or playerDrop function
// Or use player.pos.pause()
pause.addEventListener("click", (event) => {
  console.log("pause");
});

//  Function for clearing canvas of tetris shapes once stacked to the top
function arenaSweep() {
  let rowCount = 1;
  // Nested for loops with the outer for loop told to continue running
  outer: for (let y = arena.length - 1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    /* Arena length spliced, at index y, at first row, it is 
filled with zeros and clears canvas of shapes */

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;

    /* Player score gets 10 points every row cleared 
and then doubled each time to add to player's score
Game over sound effect plays once this happens */

    player.score += rowCount * 10;
    rowCount *= 2;
    gameOver.play();
  }
}

/* This function stops the player from moving the shapes too far left or
    right out of the canvas boundaries. Y is equal to rows and X is equal to 
    columns. If a collision is detected, the tetris shape position is moved
    back to the top of the canvas */

function collide(arena, player) {
  /* Destructuring assignment synatax of square brackets that makes it 
    possible to unpack values from arrays, or properties from objects, into distinct variables */
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

/* This function is for keeping the matrix width consistently blank
    by filling with zeros while the height decreases so that the 
    game clears itself of shapes */

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

/*  Creating tetris shape pieces by drawing an array of numbers 
    with mathematical canvas, you can see the letters formed if
    you look at the nested arrays that are returned as whole block 
    The numbers from 0 to 7 to represent the index of the array */

function createPiece(type) {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

/* draw function for drawing the canvas to hold the tetris shapes 
    
    drawMatrix function called inside this function to set width and
    height properties for the canvas and how the player will be able to
    move the tetris shapes within the x and y axis co-ordinates */

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.clientWidth, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

/*  Function for drawing shapes using x axis and y axis 
        inside the canvas also filling them with colour 
        from color array. Also references the player object to set
        the position of shapes */

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

/* Merge function is recreating all the values from player
       into arena to change position of shapes */

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}
/* pausePlay function pauses the game */

// function pausePlay() {
//   if(dropInterval === 0) {
//       gamePaused = true;
//   console.log("pause");
// }
/* playerDrop function is for moving the tetris shapes down continously */

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
    //   } else if (dropInterval === 0) {
    //     player.pos.pause();
  }
  dropCounter = 0;
}

/* playerMove function stops shapes from moving left and right 
        and colliding into other shapes. To rotate shapes, convert
        all rows into columns, then reverse the rows */

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
    //   } else if (dropInterval === 0) {
    //     player.pos.pause();
  }
}

/* playerReset function is for making sure that a different tetris shape 
    appears at the top of the canvas each time, using Math.floor or Math.random 
    accessing the createPiece function
    
    If the tetris shapes collide, the arena is filled with zeros which makes it empty
    and clears the row, the player score is updated with updateScore function and the
    clear sound effect is played as well for the entertainment of the user */
function playerReset() {
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(
    pieces[(pieces.length * Math.random()) | Math.floor()]
  );
  player.pos.y = 0;
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
    clear.play();
  }
}

/* playerRotate function is for moving the shapes around to fit inside the other shapes */

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, dir);
      player.pos.x = pos;
      return;
    }
  }
  // Move sound effect plays when user presses on the ArrowUp key
  move.play();
}

/* Rotate function is for the matrix direction. 
        Swapping the position of the rows and columns the 
        shapes are made from and then the reverse row rotates them */

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

/* Drop counter variable set to zero to accumulate the player score, dropInterval
    variable set to 1000 milliseconds so that the shapes drop once a second */

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let gamePaused = false;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

/* Update player score by Dom manipulation from html element */

function updateScore() {
  document.querySelector("#score").innerText = `Score ${player.score}`;
}

/* Array for the colours of tetris shapes */

const colors = [
  null,
  "#07F02A",
  "#3b68f0",
  "#ab8ff9",
  "#f9082f",
  "#8641e3",
  "#F59E21",
  "#FC09C8",
];

/* Tetris arena is assigned to createMatrix function with set width and height in parentheses */

const arena = createMatrix(12, 20);

/* Object for player to have the position and matrix set to null
    and player score set to 0 that increases with updateScore function */

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

/* Event listener for player key controls when user presses down on specific keys.

    Then by calling the function playerMove, playerDrop and playerRotate they all move
    direction according to the key pressed. The playerDrop function has the feature of 
    running continously, a great addition to classic Tetris game, if you want to move 
    the tetris shape faster.
    

    event.preventDefault is to stop the page scrolling up 
    when ArrowUp key is pressed by the user */

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    playerMove(-1);
  } else if (event.key === "ArrowRight") {
    playerMove(+1);
  } else if (event.key === "ArrowDown") {
    playerDrop();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    playerRotate(-1);
  }
});

/* Call functions outside of local scope so they always run */

playerReset();
updateScore();
update();

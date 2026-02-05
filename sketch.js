/*
Week 4 — Example 1: Grid + Static Maze
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

PURPOSE: This is the simplest possible p5.js sketch that demonstrates:
1. How a 2D array represents a maze/game level
2. Nested loops to iterate through grid rows/columns
3. Converting grid coordinates (r,c) → screen coordinates (x,y)
4. Tile-based rendering (every cell = one rectangle)
*/

const TS = 32; // TILE SIZE: pixels per grid cell (32x32 squares)

/*
GRID LEGEND (how numbers map to visuals):
- 0 = floor (walkable, light gray)
- 1 = wall (blocked, dark teal)
*/
const grid = [
  // Row 0 (top edge - all walls)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  // Row 1 (open hallway with wall in middle)
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],

  // Row 2 (complex maze pattern)
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],

  // Row 3
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],

  // Row 4
  [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],

  // Row 5
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],

  // Row 6
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],

  // Row 7
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],

  // Row 8
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],

  // Row 9
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],

  // Row 10 (bottom edge - all walls)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

/*
p5.js SETUP: Runs once when sketch loads
*/
function setup() {
  // Canvas size = grid dimensions × tile size
  // grid[0].length = 16 columns, grid.length = 11 rows
  // Canvas = 16×32 = 512px wide, 11×32 = 352px tall
  createCanvas(grid[0].length * TS, grid.length * TS);

  // Drawing style setup
  noStroke(); // No black outlines on tiles (clean look)
  textFont("sans-serif"); // Clean font for UI text
  textSize(14); // Small text size for HUD
}

/*
p5.js DRAW: Runs 60 times per second (game loop)
*/
function draw() {
  // Clear screen with light gray background each frame
  background(240);

  /*
  CORE RENDERING LOOP: Draw every tile in the grid
  
  Nested loops:
  - Outer loop: iterate ROWS (r = 0 to 10)
  - Inner loop: iterate COLUMNS in each row (c = 0 to 15)
  */
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      // TILE TYPE CHECK: What kind of tile is at grid[r][c]?
      if (grid[r][c] === 1) {
        // WALL TILE: Dark teal colour (RGB: 30, 50, 60)
        fill(30, 50, 60);
      } else {
        // FLOOR TILE: Light gray (RGB: 230, 230, 230)
        fill(230);
      }

      /*
      CONVERT GRID COORDS → SCREEN COORDS:
      - Grid: r=0,c=3     → Screen: x=96, y=0
      - Grid: r=5,c=7     → Screen: x=224, y=160
      - x = column × TS    y = row × TS
      */
      rect(c * TS, r * TS, TS, TS);
    }
  }

  // UI LABEL: Explain what students are seeing
  fill(0); // Black text
  text("Static array → grid render", 10, 16);
}

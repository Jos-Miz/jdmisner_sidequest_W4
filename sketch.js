/*
Week 4 — Example 5: Blob Platformer (JSON + Classes)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

Adds:
- START screen (press SPACE to start)
- END screen (press N to restart)
- A "money" goal loaded from JSON
- If blob touches money -> next level
*/

let data; // raw JSON data
let levelIndex = 0;
let startImg;
let endImg;

let world; // WorldLevel instance (current level)
let player; // BlobPlayer instance

function preload() {
  data = loadJSON("levels.json");
  startImg = loadImage("Money_Emoji.jpeg"); // if you already have this
  endImg = loadImage("You_Won_Emoji.jpeg");
}

function setup() {
  createCanvas(640, 360);

  // Create the player once (it will be respawned per level)
  player = new BlobPlayer();

  // Load the first level (START screen should be index 0)
  loadLevel(0);

  // Shared style
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  // START SCREEN
  if (world.name === "START") {
    drawStartScreen();
    return; // stop the game from running behind the start screen
  }

  // END SCREEN
  if (world.name === "END") {
    drawEndScreen();
    return; // stop updates
  }

  // 1) Draw the world (background + platforms)
  world.drawWorld();

  // 2) Draw the money goal
  drawMoneyGoal();

  // 3) Update + draw player
  player.update(world.platforms);
  player.draw(world.theme.blob);

  // 4) Check collision with money -> next level / end
  checkMoneyCollision();

  // 5) HUD (make readable on dark levels too)
  fill(255);
  text(world.name, 10, 18);
  text("Move: A/D or ←/→ • Jump: Space/W/↑", 10, 36);
}

function drawStartScreen() {
  background("white");

  // 1️⃣ Draw image FIRST
  imageMode(CENTER);
  image(startImg, width / 2, height / 1.9, 200, 175);

  // 2️⃣ Draw text ON TOP
  fill("black");
  textAlign(CENTER, CENTER);

  textSize(52);
  text("Make Bands Game", width / 2, 60);

  textSize(18);
  text("Press SPACE to Start", width / 2, height - 40);

  // Reset
  textAlign(LEFT, BASELINE);
  textSize(14);
}

function drawEndScreen() {
  background("white");

  // Draw image first
  imageMode(CENTER);
  image(endImg, width / 2, height / 1.8, 360, 240);

  // Draw text on top
  fill("black");
  textAlign(CENTER, CENTER);

  textSize(52);
  text("You won 3k!!", width / 2, 60);

  textSize(18);
  text("Press N to Restart", width / 2, height - 40);

  // Reset text settings
  textAlign(LEFT, BASELINE);
  textSize(14);
}

function keyPressed() {
  // START "button": press SPACE to start (go to level 1)
  if (world.name === "START" && key === " ") {
    loadLevel(1);
    return;
  }

  // END screen: press N to restart (back to START)
  if (world.name === "END" && (key === "n" || key === "N")) {
    loadLevel(0);
    return;
  }

  // Jump keys (only during real levels)
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  // Optional: cycle levels with N (during gameplay only) — BUT never into START/END
  if (
    (key === "n" || key === "N") &&
    world.name !== "START" &&
    world.name !== "END"
  ) {
    let next = levelIndex + 1;

    // Skip START (0) if you accidentally loop
    if (next >= data.levels.length) next = 1;

    loadLevel(next);
  }
}

function loadLevel(i) {
  levelIndex = i;

  // Create the world object from the JSON level object
  world = new WorldLevel(data.levels[levelIndex]);

  // Ensure money exists + reset collected flag
  world.money = data.levels[levelIndex].money || null;
  world.moneyCollected = false;

  // Fit canvas to world geometry (or defaults)
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  // Respawn player using level start + physics
  player.spawnFromLevel(world);
}

/* -------------------------
   MONEY GOAL FUNCTIONS
-------------------------- */

function drawMoneyGoal() {
  if (!world.money) return;
  if (world.moneyCollected) return;

  push(); // prevents textAlign/textSize from messing up HUD
  textSize(40);
  textAlign(CENTER, BOTTOM);
  text("💰", world.money.x, world.money.y + 25);
  pop();
}

function checkMoneyCollision() {
  if (!world.money) return;
  if (world.moneyCollected) return;

  const touching =
    dist(player.x, player.y, world.money.x, world.money.y) <
    player.r + world.money.r;

  if (touching) {
    world.moneyCollected = true;

    const next = levelIndex + 1;

    // If next level exists, go there
    if (next < data.levels.length) {
      loadLevel(next);
      return;
    }

    // Otherwise, we beat the last level -> go to END (index 2 if you have START, L1, L2, END)
    // If your JSON has END as the last level, this will still work:
    // loadLevel(data.levels.length - 1);

    // SAFEST: if you made END a level in your JSON, jump to it by name
    const endIndex = data.levels.findIndex((l) => l.name === "END");
    if (endIndex !== -1) {
      loadLevel(endIndex);
    }
  }
}

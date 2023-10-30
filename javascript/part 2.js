// [START PART 2/2]
// wRight)
// (hero.style.backgroundPosition = "-220px 0"),
//     (playerX += 0.007 * step * speed);
// else if (KEYS.ArrowLeft)
//     (hero.style.backgroundPosition = "0 0"),
//         (playerX -= 0.007 * step * speed);
// else hero.style.backgroundPosition = "-110px 0";
//
// playerX = playerX.clamp(-3, 3);
//
// // Set a constant speed (e.g., 100) for the player
// const constantSpeed = 50;
// speed = constantSpeed;
//
// if (Math.abs(playerX) > 0.55 && speed >= maxOffSpeed) {
//     speed = accelerate(speed, offDecel, step);
// }
//
// speed = speed.clamp(0, maxSpeed);
//
// // update map
// let current = map[mapIndex];
// let use = current.from < scoreVal && current.to > scoreVal;
// if (use) sectionProg += speed * step;
// lines[endPos].curve = use ? current.curve(sectionProg) : 0;
// lines[endPos].y = use ? current.height(sectionProg) : 0;
// lines[endPos].special = null;
//
// if (current.to <= scoreVal) {
//     mapIndex++;
//     sectionProg = 0;
//
//     lines[endPos].special = map[mapIndex].special;
// }
//
// // win / lose + UI
//
// if (!inGame) {
//     speed = accelerate(speed, breaking, step);
//     speed = speed.clamp(0, maxSpeed);
// } else if (countDown <= 0 || lines[startPos].special) {
//     tacho.style.display = "none";
//
//     home.style.display = "block";
//     road.style.opacity = 0.4;
//     text.innerText = "START GAME";
//
//     // highscores.push(lap.innerText);
//     highscores.sort();
//     updateHighscore();
//
//     inGame = false;
// } else {
//     time.innerText = (countDown | 0).pad(3);
//     score.innerText = (scoreVal | 0).pad(8);
//     tacho.innerText = speed | 0;
//
//     //let cT = new Date(timestamp() - start);
//     // lap.innerText = `${cT.getMinutes()}'${cT.getSeconds().pad(2)}"${cT
//     //     .getMilliseconds()
//     //     .pad(3)}`;
// }
//
// // sound
// if (speed > 0) audio.play("engine", speed * 4);
//
// // draw cloud to make it move from accordingly
// cloud.style.backgroundPosition = `${
//     (cloudOffset -= lines[startPos].curve * step * speed * 0.13) | 0
// }px 0`;
//
// //draw for buildings
// buildings.style.backgroundPosition = `${
//     (cloudOffset -= lines[startPos].curve * step * speed * 0.13) | 0
// }px 0`;
//
// // other cars
// for (let car of cars) {
//     car.pos = (car.pos + enemy_speed * step) % N;
//
//     // respawn
//     if ((car.pos | 0) === endPos) {
//         if (speed < 30) car.pos = startPos;
//         else car.pos = endPos - 2;
//         car.lane = randomProperty(LANE);
//     }
//
//     // collision
//     const offsetRatio = 5;
//     if (
//         (car.pos | 0) === startPos &&
//         isCollide(playerX * offsetRatio + LANE.B, 0.5, car.lane, 0.5)
//     ) {
//         speed = Math.min(hitSpeed, speed);
//         if (inGame) audio.play("honk");
//     }
// }
//
// // draw road
// let maxy = height;
// let camH = H + lines[startPos].y;
// let x = 0;
// let dx = 0;
//
// for (let n = startPos; n < startPos + N; n++) {
//     let l = lines[n % N];
//     let level = N * 2 - n;
//
//     // update view
//     l.project(
//         playerX * roadW - x,
//         camH,
//         startPos * segL - (n >= N ? N * segL : 0)
//     );
//     x += dx;
//     dx += l.curve;
//
//     // clear assets
//     l.clearSprites();
//
//     // first draw section assets
//     if (n % 10 === 0) l.drawSprite(level, 0, ASSETS.IMAGE.TREE, -2);
//     if ((n + 5) % 10 === 0)
//         l.drawSprite(level, 0, ASSETS.IMAGE.TREE, 1.3);
//
//     if (l.special)
//         l.drawSprite(level, 0, l.special, l.special.offset || 0);
//
//     for (let car of cars)
//         if ((car.pos | 0) === n % N)
//             l.drawSprite(level, car.element, car.type, car.lane);
//
//     // update road
//
//     if (l.Y >= maxy) continue;
//     maxy = l.Y;
//
//     let even = ((n / 2) | 0) % 2;
//     let grass = ASSETS.COLOR.GRASS[even * 1];
//     let rumble = ASSETS.COLOR.RUMBLE[even * 1];
//     let tar = ASSETS.COLOR.TAR[even * 1];
//
//     let p = lines[(n - 1) % N];
//
//     drawQuad(
//         l.elements[0],
//         level,
//         grass,
//         width / 4,
//         p.Y,
//         halfWidth + 2,
//         width / 4,
//         l.Y,
//         halfWidth
//     );
//     drawQuad(
//         l.elements[1],
//         level,
//         grass,
//         (width / 4) * 3,
//         p.Y,
//         halfWidth + 2,
//         (width / 4) * 3,
//         l.Y,
//         halfWidth
//     );
//
//     drawQuad(
//         l.elements[2],
//         level,
//         rumble,
//         p.X,
//         p.Y,
//         p.W * 1.15,
//         l.X,
//         l.Y,
//         l.W * 1.15
//     );
//     drawQuad(l.elements[3], level, tar, p.X, p.Y, p.W, l.X, l.Y, l.W);
//
//     if (!even) {
//         drawQuad(
//             l.elements[4],
//             level,
//             ASSETS.COLOR.RUMBLE[1],
//             p.X,
//             p.Y,
//             p.W * 0.4,
//             l.X,
//             l.Y,
//             l.W * 0.4
//         );
//         drawQuad(
//             l.elements[5],
//             level,
//             tar,
//             p.X,
//             p.Y,
//             p.W * 0.35,
//             l.X,
//             l.Y,
//             l.W * 0.35
//         );
//     }
// }
// }
//
// // ------------------------------------------------------------
// // init
// // ------------------------------------------------------------
//
// function reset() {
//     inGame = false;
//
//     start = timestamp();
//     countDown = map[map.length - 2].to / 130 + 10;
//
//     playerX = 0;
//     speed = 0;
//     scoreVal = 0;
//
//     pos = 0;
//     cloudOffset = 0;
//     sectionProg = 0;
//     mapIndex = 0;
//
//     for (let line of lines) line.curve = line.y = 0;
//
//     text.innerText = "START GAME";
//     text.classList.add("blink");
//
//     road.style.opacity = 0.4;
//     hud.style.display = "none";
//     home.style.display = "block";
//     tacho.style.display = "block";
// }
//
// function updateHighscore() {
//     let hN = Math.min(12, highscores.length);
//     for (let i = 0; i < hN; i++) {
//         highscore.children[i].innerHTML = `${(i + 1).pad(2, "&nbsp;")}. ${
//             highscores[i]
//         }`;
//     }
// }
//
// function init() {
//     game.style.width = width + "px";
//     game.style.height = height + "px";
//
//     hero.style.top = height - 80 + "px";
//     hero.style.left = halfWidth - ASSETS.IMAGE.HERO.width / 2 + "px";
//     hero.style.background = `url(${ASSETS.IMAGE.HERO.src})`;
//     hero.style.width = `${ASSETS.IMAGE.HERO.width}px`;
//     hero.style.height = `${ASSETS.IMAGE.HERO.height}px`;
//
//     cloud.style.backgroundImage = `url(${ASSETS.IMAGE.SKY.src})`;
//     buildings.style.backgroundImage = `url(${ASSETS.IMAGE.BUILDINGS.src})`;
//     klcc.style.backgroundImage = `url(${ASSETS.IMAGE.KLCC.src})`;
//
//     audio = new Audio();
//     Object.keys(ASSETS.AUDIO).forEach((key) =>
//         audio.load(ASSETS.AUDIO[key], key, (_) => 0)
//     );
//
//     cars.push(new Car(0, ASSETS.IMAGE.CAR, LANE.C));
//     cars.push(new Car(10, ASSETS.IMAGE.CAR, LANE.B));
//     cars.push(new Car(20, ASSETS.IMAGE.CAR, LANE.C));
//     cars.push(new Car(35, ASSETS.IMAGE.CAR, LANE.C));
//     cars.push(new Car(50, ASSETS.IMAGE.CAR, LANE.A));
//     cars.push(new Car(60, ASSETS.IMAGE.CAR, LANE.B));
//     cars.push(new Car(70, ASSETS.IMAGE.CAR, LANE.A));
//
//     for (let i = 0; i < N; i++) {
//         var line = new Line();
//         line.z = i * segL + 270;
//
//         for (let j = 0; j < 6 + 2; j++) {
//             var element = document.createElement("div");
//             road.appendChild(element);
//             line.elements.push(element);
//         }
//
//         lines.push(line);
//     }
//
//     for (let i = 0; i < 12; i++) {
//         var element = document.createElement("p");
//         highscore.appendChild(element);
//     }
//     updateHighscore();
//
//     reset();
//
//     // Modify the game loop to update the game state only when inGame is true
//     (function loop() {
//         requestAnimationFrame(loop);
//
//         let now = timestamp();
//         let delta = now - then;
//
//         if (delta > targetFrameRate && inGame) { // Only update when inGame is true
//             then = now - (delta % targetFrameRate);
//             update(delta / 1000);
//         }
//     })();
// }
//
// init();
//
//
//
// styles.css:
// body {
//     background: #222;
//     font-family: "Press Start 2P", monospace;
//     font-smooth: never;
//     height: 98vh;
// }
//
// /* UI */
// .topUI {
//     position: absolute;
//     z-index: 1000; /* need this cause clip-path changes stack context */
//     transform: translate(-50%, 25px);
//     text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
//     letter-spacing: 2px;
//     color: #fff;
//     font-size: 17px;
// }
// .topUI::before {
//     display: inline-block;
//     height: 17px;
//     padding: 1px 2px;
//     line-height: 19px;
//     font-size: 17px;
//     background: #fff;
//     text-shadow: none;
//     font-weight: 900;
//     letter-spacing: 0;
//     border-radius: 6px;
//     margin-right: 30px;
//     border: 2px solid #7dd8c9;
// }
// #time {
//     left: 13%;
//     color: #f4f430;
// }
// #time::before {
//     content: "TIME";
//     color: #f57214;
// }
// #score {
//     left: 45%;
// }
// #score::before {
//     content: "SCORE";
//     color: #a61a9d;
// }
// #lap {
//     left: 88%;
//     width: 45%;
// }
// #lap::before {
//     content: "LAP";
//     color: #0082df;
// }
//
// #tacho {
//     position: absolute;
//     text-align: right;
//     width: 23%;
//     bottom: 5%;
//     z-index: 2000;
//     color: #e62e13;
//     text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
//     letter-spacing: 2px;
//     font-size: 23px;
// }
// #tacho::after {
//     content: "km/h";
//     color: #fab453;
//     font-size: 18px;
//     margin-left: 5px;
// }
//
// /*
// road
// */
// #game {
//     position: relative;
//     margin: 0 auto;
//     overflow: hidden;
//     background: #ffffff;
//     user-select: none;
//     transition: opacity 10s;
// }
// #road {
//     transition: opacity 2s;
//     transition-timing-function: steps(8, end);
// }
// #road * {
//     position: absolute;
//     /*image-rendering: pixelated;*/
// }
// #hero {
//     background-repeat: no-repeat;
//     background-position: -110px 0;
//     z-index: 4000;
//     transform: scale(1.4);
// }
//
// #cloud {
//     background-size: auto 100%;
//     width: 100%;
//     height: 57%;
// }
//
// #buildings {
//     background-size: auto 50%;
//     width: 100%;
//     height: 160%;
// }
//
// #KLCC {
//     background-size: auto 70%;
//     width: 100%;
//     height: 75%;
//     background-repeat: no-repeat;
//     background-position: center;
//
// }
//
// /*
// home
// */
// #road {
//     position: absolute;
//     width: 100%;
//     height: 100%;
// }
//
// #home {
//     position: absolute;
//     color: #fff;
//     width: 100%;
//     height: 100%;
//
//     z-index: 1000; /* need this cause clip-path changes stack context */
// }
//
// #highscore {
//     position: absolute;
//     width: 100%;
//     height: 20%;
//     bottom: 0;
//     column-count: 3;
//     column-fill: auto;
// }
//
// #highscore * {
//     color: #9e95a8;
// margin: 0 0 6px 27px;
// }
//
// h1 {
//     position: absolute;
//     left: 50%;
//     top: 25%;
//     transform: translate(-50%, -50%);
//     font-size: 3em;
//
//     background: -webkit-linear-gradient(#763f98, #00a19c);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
// }
//
// #text {
//     position: absolute;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//     font-size: 1.2em;
//     color: #d9bbf3;
//     text-shadow: 0 0 black, 0 2px black, 2px 0 black, 0 0 black;
// }
//
// .blink {
//     animation: blinker 2s steps(4, end) infinite;
// }
// @keyframes blinker {
//     50% {
//         opacity: 0;
//     }
// }
//
// /*
// Guide
// */
// #controls {
//     color: #868686;
//     font-size: 13px;
//     line-height: 13px;
//     margin: 10px;
//     text-align: center;
// }
//
// #controls > span {
//     margin-left: 20px;
// }
// #controls > span > span {
//     border: 2px solid #868686;
//     border-radius: 5px;
//     padding: 7px;
//     margin-right: 10px;
//     display: inline-block;
// }
//
// [END PART 2/2]
// Request processing may now proceed as all necessary parts have been provided.
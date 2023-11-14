const ASSETS = {
    COLOR: {
        TAR: ["#959298", "#9c9a9d"],
        RUMBLE: ["#959298", "#f5f2f6"],
        GRASS: ["#aec232", "#dff676"],
    },

    IMAGE: {
        HEART: {
            src: "images/heart.png",
            width: 118,
            height: 102,
        },

        TREE: {
            src: "images/tree.png",
            width: 132,
            height: 192,
        },

        HERO: {
            src: "images/male.png",
            width: 580,
            height: 688,
        },

        CAR: {
            src: "images/car04.png",
            width: 50,
            height: 36,
        },

        FINISH: {
            src: "images/finish.png",
            width: 339,
            height: 180,
            offset: -0.5,
        },

        SKY: {
            src: "images/cloud2.png",
        },

        BUILDINGS: {
            src: "images/buildings2.png",
        },

        KLCC: {
            src: "images/klcc.png",
        },

        FLAG_A: {
            src: "images/flagA.png"
        },
        FLAG_B: {
            src: "images/flagB.png"
        },
        FLAG_C: {
            src: "images/flagC.png"
        },
    },

    AUDIO: {
        theme:
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/theme.mp3",
        engine:
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/engine.wav",
        honk: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/honk.wav",
        beep: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/beep.wav",
    },
};

let game = document.getElementById("game");
let buildings = document.getElementById("buildings");
let klcc = document.getElementById("KLCC");
let hero = document.getElementById("hero");
let road = document.getElementById("road");
let cloud = document.getElementById("cloud");
let time = document.getElementById("time");
let score = document.getElementById("score");
let home = document.getElementById("home");
let highscore = document.getElementById("highscore");

let text = document.getElementById("text");
const links = document.querySelector('#home #links');
const gameOverText2 = document.querySelector('#home #gameover-text');

// Get character selection elements by their IDs
const femaleCharacter = document.getElementById("female-character");
const maleCharacter = document.getElementById("male-character");
const characterSelection = document.getElementById("characterSelection");

// Add event listeners to character selection elements
femaleCharacter.addEventListener('click', () => updateCharacter('female'));
maleCharacter.addEventListener('click', () => updateCharacter('male'));

maleCharacter.classList.add('glow');

function updateCharacter(gender) {
    // Remove glow from all characters
    femaleCharacter.classList.remove('glow');
    maleCharacter.classList.remove('glow');

    // Update the hero image source
    if (gender === 'female') {
        ASSETS.IMAGE.HERO.src = 'images/female.png';
        femaleCharacter.classList.add('glow');  // Add glow to clicked character
    } else if (gender === 'male') {
        ASSETS.IMAGE.HERO.src = 'images/male.png';
        maleCharacter.classList.add('glow');  // Add glow to clicked character
    }

    // Update the hero element's background image
    hero.style.background = `url(${ASSETS.IMAGE.HERO.src})`;
}

// ------------------------------------------------------------
// helper functions
// ------------------------------------------------------------


Number.prototype.pad = function (numZeros, char = 0) {
    let n = Math.abs(this);
    let zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
    let zeroString = Math.pow(10, zeros)
        .toString()
        .substr(1)
        .replace(0, char);
    return zeroString + n;
};

Number.prototype.clamp = function (min, max) {
    return Math.max(min, Math.min(this, max));
};

const timestamp = (_) => new Date().getTime();
const accelerate = (v, accel, dt) => v + accel * dt;
const isCollide = (x1, w1, x2, w2) => (x1 - x2) ** 2 <= (w2 + w1) ** 2;

function getRand(min, max) {
    return (Math.random() * (max - min) + min) | 0;
}

function randomProperty(obj) {
    let keys = Object.keys(obj);
    return obj[keys[(keys.length * Math.random()) << 0]];
}

function drawQuad(element, layer, color, x1, y1, w1, x2, y2, w2) {
    element.style.zIndex = layer;
    element.style.background = color;
    element.style.top = y2 + `px`;
    element.style.left = x1 - w1 / 2 - w1 + `px`;
    element.style.width = w1 * 3 + `px`;
    element.style.height = y1 - y2 + `px`;

    let leftOffset = w1 + x2 - x1 + Math.abs(w2 / 2 - w1 / 2);
    element.style.clipPath = `polygon(${leftOffset}px 0, ${
        leftOffset + w2
    }px 0, 66.66% 100%, 33.33% 100%)`;
}

const KEYS = {};
const keyUpdate = (e) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault();
    }
    KEYS[e.code] = e.type === `keydown`;
};

addEventListener(`keydown`, keyUpdate);
addEventListener(`keyup`, keyUpdate);

function sleep(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout((_) => resolve(), ms);
    });
}

// ------------------------------------------------------------
// objects
// ------------------------------------------------------------

// Global variable for lives
let lives = 3;

function updateLivesDisplay() {
    // Clear current hearts
    document.getElementById('lives').innerHTML = '';
    // Add back the correct number of hearts
    for (let i = 0; i < lives; i++) {
        let heartImg = document.createElement('img');
        heartImg.src = 'images/heart.png';
        heartImg.classList.add('heart');
        document.getElementById('lives').appendChild(heartImg);
    }
}

// Call this function whenever the user gets a question wrong
function loseLife() {
    if (lives > 0) {
        lives--;
        console.log("heart removed")
        updateLivesDisplay();
        if (lives === 0) {
            console.log("game over")
            inGame = false;  // End the game
            removeLastSetOfFlags();
            
            // Display the score
            road.style.opacity = 0.4;
            hud.style.display = "none";
            home.style.display = "block";
            text.classList.remove('blink');
            updateDisplay();
            text.innerText = `Your Score: ${scoreVal}`;

            // Optionally, you can also hide the quiz UI
            quiz.quizBox.style.display = 'none';
        }
    }
}

class Line {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.X = 0;
        this.Y = 0;
        this.W = 0;

        this.curve = 0;
        this.scale = 0;

        this.elements = [];
        this.special = null;
    }

    project(camX, camY, camZ) {
        this.scale = camD / (this.z - camZ);
        this.X = (1 + this.scale * (this.x - camX)) * halfWidth;
        this.Y = Math.ceil(((1 - this.scale * (this.y - camY)) * height) / 2);
        this.W = this.scale * roadW * halfWidth;
    }

    clearSprites() {
        for (let e of this.elements) e.style.background = "transparent";
    }

    drawSprite(depth, layer, sprite, offset) {
        let destX = this.X + this.scale * halfWidth * offset;
        let destY = this.Y + 4;
        let destW = (sprite.width * this.W) / 265;
        let destH = (sprite.height * this.W) / 265;

        destX += destW * offset;
        destY += destH * -1;

        let obj = layer instanceof Element ? layer : this.elements[layer + 6];
        obj.style.background = `url('${sprite.src}') no-repeat`;
        obj.style.backgroundSize = `${destW}px ${destH}px`;
        obj.style.left = destX + `px`;
        obj.style.top = destY + `px`;
        obj.style.width = destW + `px`;
        obj.style.height = destH + `px`;
        obj.style.zIndex = depth;
    }
}

/* FOR QUIZ */
let canStartQuiz = false;  // This flag is initially set to false

class UpgradeItem {
    constructor(type, lane, pos) {
        this.type = type;
        this.lane = lane;
        this.pos = pos;   // position along the road
        this.hit = false;  // flag to indicate whether the item has been hit
        var element = document.createElement("div");
        road.appendChild(element);
        this.element = element;
    }

    setSpeed(newSpeed) {
        item_speed = newSpeed;  // Assuming item_speed is a global variable
    }

     setHit() {
        this.hit = true;
        quiz.currentQuestionIndex++;
        canStartQuiz = true;  // Set the canStartQuiz flag to true when a flag is hit
        if (quiz.currentQuestionIndex < quiz.questions.length) {
            quiz.displayQuestion();
        }
    }

    triggerReset() {
        setTimeout(() => {
            this.resetHit();
        }, 3000);
    }

    resetHit() {
        this.hit = false;
    }
}

function resetFlags() {
    for (let item of upgradeItems) {
        item.resetHit();  // assuming resetHit() sets the flag to its initial state
    }
}

// ------------------------------------------------------------
// global varriables
// ------------------------------------------------------------

const highscores = [];

const width = 800;
const halfWidth = width / 2;
const height = 500;
const roadW = 4000;
const segL = 200;
const camD = 0.2;
const H = 1500;
const N = 70;

const maxSpeed = 200;
const accel = 38;
const breaking = -80;
const decel = -40;
const maxOffSpeed = 40;
const offDecel = -70;
const enemy_speed = 8;
let item_speed = 1;
const hitSpeed = 20;

const LANE = {
    A: -2.3,
    B: -0.5,
    C: 1.2,
};

const mapLength = 15000;

// loop
let then = timestamp();
const targetFrameRate = 1000 / 25; // in ms

let audio;

// game
let inGame = false, start, playerX, speed, scoreVal, pos, cloudOffset, sectionProg, mapIndex, countDown;
let lines = [];
let newSpeed = 1;

// ------------------------------------------------------------
// map
// ------------------------------------------------------------

function getFun(val) {
    return (i) => val;
}

function genMap() {
    let map = [];

    for (var i = 0; i < mapLength; i += getRand(0, 50)) {
        let randHeight = getRand(-5, 5);
        let randInterval = getRand(20, 40);

        let section = {
            from: i,
            to: (i = i + getRand(300, 600)),
            curve: (_) => 0,  // Set curve to 0 to make the road straight
            height: Math.random() > 0.8 ? (i) => Math.sin(i / randInterval) * 1000 : (_) => randHeight  // Keep the random height logic
        };

        map.push(section);
    }

    map.push({
        from: i,
        to: i + N,
        curve: (_) => 0,  // Set curve to 0 to make the road straight
        height: (_) => 0,  // Set height to 0 for the finish line section
        special: ASSETS.IMAGE.FINISH,
    });
    map.push({ from: Infinity });
    return map;
}

let map = genMap();

function updateDisplay() {
    // Get references to the HTML elements
    const title = document.querySelector('#home #title-img');
    const tutorial = document.querySelector('#home #tutorial');
    const charSelection = document.getElementById('character-selection');
    const gameOverText = document.getElementById('text');

    // If the game is over
    if (!inGame) {
        // Hide the title and character selection
        // feedbackElement.style.display = 'none';
        title.style.display = 'none';
        tutorial.style.display = 'none';
        charSelection.style.display = 'none';

        // Show the game over text
        links.style.display = 'block';
        gameOverText.innerText = `Your Score: ${scoreVal}`;
        gameOverText2.classList.add("blink");
        gameOverText.style.display = 'block';
        gameOverText2.style.display = 'block';
    }
    // If the game is not over
    else {
        // Show the title and character selection
        title.style.display = 'block';
        charSelection.style.display = 'block';

        // Hide the game over text
        gameOverText.style.display = 'none';
        gameOverText2.style.display = 'none';
        links.style.display = 'none';
    }
}

// ------------------------------------------------------------
// additional controls
// ------------------------------------------------------------

let gameStartTime = null;

document.getElementById('start-game-button').addEventListener('click', function() {
    // Your existing game start logic that was previously under if (e.code === 'KeyC') { ... } goes here.
    if (!inGame) {
        sleep(0)
            .then((_) => {
                text.classList.remove('blink');
                text.innerText = 3;
                audio.play('beep');
                return sleep(1000);
            })
            .then((_) => {
                text.innerText = 2;
                audio.play('beep');
                return sleep(1000);
            })
            .then((_) => {
                reset();
                road.style.opacity = 1;
                hero.style.display = 'block';
                hud.style.display = 'block';
                audio.play('beep', 500);
                inGame = true; // Start the game
                resetGame();
                quiz.quizBox.style.display = 'block';
                quiz.displayQuestion()
                gameStartTime = timestamp();  // Store the game start timestamp
            });
    }
});

/// QUIZ QUESTIONS SECTION

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.quizBox = document.getElementById('quizBox');  // Update this line
        this.questionBox = document.getElementById('questionBox');  // Update this line
        this.optionsBox = document.getElementById('optionsBox');  // Update this line
        document.getElementById('game').appendChild(this.quizBox);
        this.quizBox.style.display = 'none';
        this.displayQuestion();
    }

    displayQuestion() {
        let currentQuestion = this.questions[this.currentQuestionIndex];
        this.questionBox.innerText = currentQuestion.question;
        this.optionsBox.innerHTML = '';
        
        for (let i = 0; i < currentQuestion.options.length; i++) {
            let optionButton = document.createElement('div');
            optionButton.innerText = currentQuestion.options[i];
            optionButton.addEventListener('click', () => this.checkAnswer(i));
            this.optionsBox.appendChild(optionButton);
        }
    }

    areAllQuestionsAnswered() {
        return this.currentQuestionIndex >= this.questions.length;
    }

    checkAnswer(index) {
        let currentQuestion = this.questions[this.currentQuestionIndex];

        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            console.log("All questions answered");
        }
    }
}

// QUESTIONS LIST
let quizQuestions =  [
    {
        question: 'Q1: What are Agile Enterprise’s focus area. \nHint: About AE',
        options: ['A: Shape Leadership, Mindset & Culture', 'B: Enterprise Agility', 'C: Agile Insights'],
        correctAnswer: 0
    },
    {
        question: 'Q2: What is the other Agile Enterprise’s focus area. \nHint: About AE',
        options: ['A: Agile Capability', 'B: Strengthen Agile teams & Capability ', 'C: Sustainable development'],
        correctAnswer: 1
    },
    {
        question: 'Q3: What is being Agile? \nHint: Agile in PETRONAS',
        options: ['A: Scrum methodology', 'B: Organisational transformation', 'C: Mindset and behaviour shift to build agility'],
        correctAnswer: 2
    },
    {
        question: 'Q4: What is doing Agile? \nHint: Agile in PETRONAS',
        options: ['A: Practice agile methodology ', 'B: Mindset and values', 'C: Project methodology'],
        correctAnswer: 0
    },
    {
        question: 'Q5: Name one of the four Agile values. \nHint: Agile in PETRONAS ',
        options: ['A: Maintain simplicity ', 'B: Customer collaboration over contract negotiation ', 'C: Trust and support'],
        correctAnswer: 1
    },
    {
        question: 'Q6: What is one of the 12 Principles in Agile Manifesto?  \nHint: Agile in PETRONAS ',
        options: ['A: Self-organizing teams', 'B: Focused collaboration', 'C: Be enterprising'],
        correctAnswer: 0
    },
    {
        question: 'Q7: How many Agile Adventures comic have we released so far?\n' +
            'Hint: Media library ',
        options: ['A: 12', 'B: 14', 'C: 15'],
        correctAnswer: 0
    },
    {
        question: 'Q8: Which company uses CLOU? \nHint: Media library',
        options: ['A: Haier', 'B: Morning Star', 'C: Netflix'],
        correctAnswer: 1
    },
    {
        question: 'Q9: Name another one of the 3 handbooks we have published under Agile WoW Handbook series. \nHint: What we offer',
        options: ['A: Digital Agenda', "B: A Beginner's Guide to Agile", 'C: Progressive Organisations'],
        correctAnswer: 2
    },
    {
        question: 'Q10: What is one of the 8 trends of progressive organisations? \nHint: What we offer',
        options: ['A: Directive leadership', 'B: Profit Driven', 'C: Radical transparency'],
        correctAnswer: 2
    },
    {
        question: 'Q11: Name one of the 3 handbooks we have published under Agile WoW Handbook series. \nHint: What we offer',
        options: ['A: Agile Heroes', 'B: Agile Leadership', 'C: Agile Ways'],
        correctAnswer: 0
    }


];

// ------------------------------------------------------------
// game loop
// ------------------------------------------------------------

let lastUpgradeTime = 0;
const MIN_UPGRADE_INTERVAL = 20000;

// QUIZ
// Create instances of UpgradeItem for each lane
let upgradeItems = [];
let quiz = new Quiz(quizQuestions);
let posIncrement = 10;  // Initial gap increment
let lastUpgradePos = 0;  // Last position where flags were placed
const MIN_GAP = 20;
let currentTime = timestamp();
let elapsedTime = currentTime - gameStartTime;

let feedbackElement = document.getElementById('feedback');

function removeLastSetOfFlags() {
    // Loop through each upgradeItem and remove its element from the DOM
    for (let item of upgradeItems) {
        if (item.element && item.element.parentNode) {
            item.element.parentNode.removeChild(item.element);
        }
    }
    // Clear the upgradeItems array
    upgradeItems = [];
}


function update(step) {
    // prepare this iteration
    pos += speed;
    while (pos >= N * segL) pos -= N * segL;
    while (pos < 0) pos += N * segL;

    var startPos = (pos / segL) | 0;
    let endPos = (startPos + N - 1) % N;
    countDown -= step;

    // left / right position
    playerX -= (lines[startPos].curve / 5000) * step * speed;

    //for the image/frame selection
    if (KEYS.ArrowRight)
        (hero.style.backgroundPosition = "-1160px 0"),
            (playerX += 0.01 * step * speed);
    else if (KEYS.ArrowLeft)
        (hero.style.backgroundPosition = "0 0"),
            (playerX -= 0.01 * step * speed);
    else hero.style.backgroundPosition = "-580px 0";

    playerX = playerX.clamp(-3, 3);

    // Set a constant speed (e.g., 100) for the car
    const constantSpeed = 50;
    speed = constantSpeed;

    if (Math.abs(playerX) > 0.55 && speed >= maxOffSpeed) {
        speed = accelerate(speed, offDecel, step);
    }

    speed = speed.clamp(0, maxSpeed);

    // update map
    let current = map[mapIndex];
    let use = current.from < scoreVal && current.to > scoreVal;
    if (use) sectionProg += speed * step;
    lines[endPos].curve = use ? current.curve(sectionProg) : 0;
    lines[endPos].y = use ? current.height(sectionProg) : 0;
    lines[endPos].special = null;

    if (current.to <= scoreVal) {
        mapIndex++;
        sectionProg = 0;

        lines[endPos].special = map[mapIndex].special;
    }

    // win / lose + UI

    if (!inGame) {
        speed = accelerate(speed, breaking, step);
        speed = speed.clamp(0, maxSpeed);
    } else if (countDown <= 0 || lines[startPos].special) {
    } else {
        time.innerText = (countDown | 0).pad(3);
        score.innerText = (scoreVal | 0).pad(8);
    }

    // sound
    if (speed > 0) audio.play("engine", speed * 4);

    // draw cloud to make it move from accordingly
    /*cloud.style.backgroundPosition = `${
        (cloudOffset -= lines[startPos].curve * step * speed * 0.13) | 0
    }px 0`;*/

    //draw for buildings
   /* buildings.style.backgroundPosition = `${
        (cloudOffset -= lines[startPos].curve * step * speed * 0.13) | 0
    }px 0`;*/
    
    if (elapsedTime >= 5000 && currentTime - lastUpgradeTime >= MIN_UPGRADE_INTERVAL) {
        // Reset the hit flag of all existing UpgradeItem instances
        for (let item of upgradeItems) {
            item.hit = false;
        }

        // Check the gap to the last set of flags
        let gap = pos - lastUpgradePos;
        if (gap >= MIN_GAP || gap < 0) {  
            // Create new UpgradeItem instances
            upgradeItems.push(new UpgradeItem('A', LANE.A, pos));
            upgradeItems.push(new UpgradeItem('B', LANE.B, pos));
            upgradeItems.push(new UpgradeItem('C', LANE.C, pos));
            lastUpgradeTime = currentTime;
            lastUpgradePos = pos;  // Update the position of the last set of flags
        }
    }
    
    // Assuming 'currentQuestion' is the current question object from your quizQuestions array
    let currentQuestion = quiz.questions[quiz.currentQuestionIndex];

    // Method to get the correct flag based on the answer
    function getCorrectFlag() {
        switch (currentQuestion.correctAnswer) {
            case 0: return 'A';
            case 1: return 'B';
            case 2: return 'C';
            default: throw new Error('Invalid correct answer index');
        }
    }
    
    for (let item of upgradeItems) {
        //enemy_speed = upgradeItems speed
        item.pos = (item.pos - item_speed * step + N) % N;  // update items to be toward the player
        let l = lines[item.pos | 0];  // find the line the item is on
        
        // Calculate the width based on the lane width, and cap it at 100
        let calculatedWidth = l.W;
        let cappedWidth = Math.min(calculatedWidth, 50);  // This will ensure the width never exceeds 100
        l.drawSprite(4000, item.element, {src: `images/flag${item.type}.png`, width: cappedWidth, height: 100}, item.lane);
    }

    // collision detection logic
    for (let item of upgradeItems) {
        if (!item.hit && (item.pos | 0) === startPos && isCollide(playerX * 5 + LANE.B, 0.5, item.lane, 0.5)) {
            console.log(`${item.type} has been chosen`);
            item.setHit();
            item.triggerReset();

            // Check if the hit item is the correct flag for the current question
            if (item.type === getCorrectFlag()) {
                scoreVal += 500;
                console.log('Added 500 points!');
                console.log('Correct Answer!');

                feedbackElement.innerText = "+500";
                feedbackElement.style.color = '#00a19c'
                
                setTimeout(() => {
                    feedbackElement.innerText = '';  
                }, 1000);

                // Progress to the next question or level
            } else {
                console.log('Wrong Answer!');

                feedbackElement.innerText = "Incorrect";
                feedbackElement.style.color = 'red'
                setTimeout(() => {
                    feedbackElement.innerText = '';  
                }, 1000);
                
                loseLife();
            }
            if (quiz.areAllQuestionsAnswered()) {
                removeLastSetOfFlags();
                inGame = false;  // End the game

                // Display the score
                upgradeItems = [];
                removeLastSetOfFlags();
                updateDisplay();
                road.style.opacity = 0.4;
                hud.style.display = "none";
                home.style.display = "block";
                text.classList.remove('blink');
                
                text.innerText = `Your Score: ${scoreVal}`;
                console.log('all questions answered')

                quiz.quizBox.style.display = 'none';
            }
        }
    }

    // draw road
    let maxy = height;
    let camH = H + lines[startPos].y;
    let x = 0;
    let dx = 0;

    for (let n = startPos; n < startPos + N; n++) {
        let l = lines[n % N];
        let level = N * 2 - n;

        // update view
        l.project(
            playerX * roadW - x,
            camH,
            startPos * segL - (n >= N ? N * segL : 0)
        );
        x += dx;
        dx += l.curve;

        // clear assets
        l.clearSprites();

        // first draw section assets
        if (n % 10 === 0) l.drawSprite(level, 0, ASSETS.IMAGE.TREE, -2);
        if ((n + 5) % 10 === 0)
            l.drawSprite(level, 0, ASSETS.IMAGE.TREE, 1.3);

        if (l.special)
            l.drawSprite(level, 0, l.special, l.special.offset || 0);


        if (l.Y >= maxy) continue;
        maxy = l.Y;

        let even = ((n / 2) | 0) % 2;
        let grass = ASSETS.COLOR.GRASS[even * 1];
        let rumble = ASSETS.COLOR.RUMBLE[even * 1];
        let tar = ASSETS.COLOR.TAR[even * 1];

        let p = lines[(n - 1) % N];

        drawQuad(
            l.elements[0],
            level,
            grass,
            width / 4,
            p.Y,
            halfWidth + 2,
            width / 4,
            l.Y,
            halfWidth
        );
        drawQuad(
            l.elements[1],
            level,
            grass,
            (width / 4) * 3,
            p.Y,
            halfWidth + 2,
            (width / 4) * 3,
            l.Y,
            halfWidth
        );

        drawQuad(
            l.elements[2],
            level,
            rumble,
            p.X,
            p.Y,
            p.W * 1.15,
            l.X,
            l.Y,
            l.W * 1.15
        );
        drawQuad(l.elements[3], level, tar, p.X, p.Y, p.W, l.X, l.Y, l.W);

        if (!even) {
            drawQuad(
                l.elements[4],
                level,
                ASSETS.COLOR.RUMBLE[1],
                p.X,
                p.Y,
                p.W * 0.4,
                l.X,
                l.Y,
                l.W * 0.4
            );
            drawQuad(
                l.elements[5],
                level,
                tar,
                p.X,
                p.Y,
                p.W * 0.35,
                l.X,
                l.Y,
                l.W * 0.35
            );
        }
    }
}

// ------------------------------------------------------------
// init
// ------------------------------------------------------------

function reset() {
    
    inGame = false;

    removeLastSetOfFlags();

    start = timestamp();
    // countDown = map[map.length - 2].to / 130 + 10;

    playerX = 0;
    speed = 0;
    scoreVal = 0;

    pos = 0;
    cloudOffset = 0;
    sectionProg = 0;
    mapIndex = 0;

    for (let line of lines) line.curve = line.y = 0;

    text.innerText = "";
    text.classList.add("blink");
    links.style.display = 'none';
    gameOverText2.style.display = 'none';

    road.style.opacity = 0.4;
    hud.style.display = "none";
    home.style.display = "block";

}


function updateHighscore() {
    let hN = Math.min(12, highscores.length);
    for (let i = 0; i < hN; i++) {
        highscore.children[i].innerHTML = `${(i + 1).pad(2, "&nbsp;")}. ${
            highscores[i]
        }`;
    }
}

function resetGame() {
    // Reset lives, score, and question index
    lives = 3;
    scoreVal = 0;
    quiz.currentQuestionIndex = 0;

    // Reset the map and related variables if necessary
    map = genMap();
    mapIndex = 0;
    sectionProg = 0;
    pos = 0;

    // Hide the game over screen and show the game UI
    home.style.display = 'none';
    road.style.opacity = 1;
    hero.style.display = 'block';
    hud.style.display = 'block';

    // Reset other UI elements if necessary
    updateLivesDisplay();
    time.innerText = "000";
    score.innerText = "00000";

    currentTime = timestamp();
    elapsedTime = currentTime - gameStartTime;
    
    
}

function init() {
    game.style.width = width + "px";
    game.style.height = height + "px";

    hero.style.top = (height - ASSETS.IMAGE.HERO.height + 220) + "px";
    hero.style.left = halfWidth - ASSETS.IMAGE.HERO.width / 2 + "px";
    hero.style.background = `url(${ASSETS.IMAGE.HERO.src})`;
    hero.style.width = `${ASSETS.IMAGE.HERO.width}px`;
    hero.style.height = `${ASSETS.IMAGE.HERO.height}px`;

    cloud.style.backgroundImage = `url(${ASSETS.IMAGE.SKY.src})`;
    buildings.style.backgroundImage = `url(${ASSETS.IMAGE.BUILDINGS.src})`;
    klcc.style.backgroundImage = `url(${ASSETS.IMAGE.KLCC.src})`;

    audio = new Audio();
    Object.keys(ASSETS.AUDIO).forEach((key) =>
        audio.load(ASSETS.AUDIO[key], key, (_) => 0)
    );

    for (let i = 0; i < N; i++) {
        var line = new Line();
        line.z = i * segL + 270;

        for (let j = 0; j < 6 + 2; j++) {
            var element = document.createElement("div");
            road.appendChild(element);
            line.elements.push(element);
        }
        lines.push(line);
    }

    for (let i = 0; i < 12; i++) {
        var element = document.createElement("p");
        highscore.appendChild(element);
    }
    updateHighscore();

    reset();

    // Modify the game loop to update the game state only when inGame is true
    (function loop() {
        requestAnimationFrame(loop);

        let now = timestamp();
        let delta = now - then;

        if (delta > targetFrameRate && inGame) { // Only update when inGame is true
            then = now - (delta % targetFrameRate);
            update(delta / 1000);
        }
    })();
}

init();
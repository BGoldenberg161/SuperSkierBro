document.addEventListener('DOMContentLoaded', () => {
    // golbals
    let body = document.querySelector('body')
    let levelDisplay = document.getElementById('level')
    let healthDisplay = document.getElementById('hp')
    let pointsDisplay = document.getElementById('points')
    let game = document.getElementById('game')
    let canvas = document.querySelector('canvas')
    // set canvas configs
    game.setAttribute('height', '400px')
    game.setAttribute('width', '700px')
    let ctx = game.getContext('2d')
    //bring in characters
    let skier = new Skier(325, 250)
    let badGuy = new Snowboarder(800, 275, Math.random()*15+5)
    let badGuy2 = new SkiPatrol(550, 275, Math.random()*15+5)
    let weapon = new SkiPole(800, 800, false)
    // initialize music
    let music = new Sounds('./Audio/Superman-Goldfinger.mp3')
    const musicEle = document.querySelector('audio')
    musicEle.volume = 0.05
    
    // game variables
    let gravity = 4
    let killCount = 0
    let backLocation = 0
    let highScore = 0
    let currentScore = 0
    let currentHealth = 100
    let prevHealth = 100

    // game loop
    const gameLoop = () => {
        //clear canvas
        ctx.clearRect(0, 0, game.width, game.height)
        // if skier dead => pop up game over screen
        if (skier.health <= 0) {
            music.stop()
            gameOver()
        }
        //update displays
        levelDisplay.innerText = `SkierBro Level: ${skier.level} \n Haters Resolved: ${killCount}`
        healthDisplay.innerText = `Health: \n ${skier.health}`
        pointsDisplay.innerText = `Points: ${skier.points} \n Exp: ${skier.exp}`
        // run character game loops
        badGuy.gameLoop()
        badGuy2.gameLoop()
        weapon.gameLoop()
        skier.gameLoop()
        // render skierBro
        skier.render()
        // run gravity  momentum  friction  background movement
        gravityFun()
        momentum()
        friction()
        moveBackground()
    }
    //functions
    // gravity
    const gravityFun = e => {
        // 'acceleration'
        if (skier.y + skier.height < game.height) gravity = gravity * 1.1
        // if on ground reset to base gravity value
        else if (skier.y + skier.height >= game.height - 20) gravity = 4
        // move skierBro
        if (skier.y < game.height - skier.height) skier.y += gravity
    }
    // movement left/right
    const momentum = e => {
        if (skier.x > 0 && skier.x < game.width - skier.width) skier.x += skier.accl // change speed based on inputs
        if (skier.x <= 0) {
            skier.x += 10 // bounce off wall 
            skier.accl = -skier.accl * .5
        }// reverse half momentum
        if (skier.x >= game.width - skier.width) {
            skier.x -= 10 // bounce off wall
            skier.accl = -skier.accl * .5
        } // reverse half momentum
    }
    // friction
    const friction = e => {
        if (skier.y >= game.height - skier.height) skier.accl = skier.accl * .8 // on ground
        else skier.accl = skier.accl * .97 // in air
    }
    // move background image and character with it
    const moveBackground = e => {
        backLocation -= 2
        canvas.style.backgroundPosition = backLocation + 'px'
        if (skier.x >= 0) skier.x -= 2
    }
    // skier movement
    const movementHandler = e => {
        // console.log(e.keyCode)
        switch (e.keyCode) {
            case (87): // w - jump
                if (skier.y >= game.height - skier.height)
                    skier.y -= 175
                break
            case (83):// s - down
                if (skier.y < game.height - skier.height)
                    skier.y += 3
                break
            case (65):// a - accelerate left 
                if (skier.accl > -18 && skier.y >= game.height - skier.height)
                    skier.accl -= 3
                break
            case (68):// d - accelerate right
                if (skier.accl < 18 && skier.y >= game.height - skier.height)
                    skier.accl += 3
                break
            case (32):// space - attack
                if (weapon.inGame === false)    
                    weapon = new SkiPole(skier.x + 50, skier.y + Math.floor(Math.random() * 75) + 20, true)
                break
            // defalut:
            //     console.log('invalid keystroke')
        }
    }

    function doDamage(damage) {
        // remove health from skier
        skier.health = skier.health - damage
    }
    // sounds object
    function Sounds(src) {
        this.sound = document.createElement('audio');
        this.sound.src = src;
        this.sound.setAttribute('preload', 'auto');
        this.sound.setAttribute('controls', 'none');
        this.sound.style.display = 'none';
        body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
        }
    }
    //define skierBro image
    const skierBro = document.createElement('img')
    skierBro.setAttribute('src', './img/superSkierBro_2_150.png')
    // characters
    function Skier(x, y) {
        this.x = x
        this.y = y
        this.health = 100
        this.level = 1
        this.points = 0
        this.width = 135
        this.height = 155
        this.accl = 0
        this.exp = 0
        this.levelCap = 50
        this.hatersResolved = 0
        this.render = function () {
            ctx.drawImage(skierBro, this.x, this.y)
        }
        this.gameLoop = () => {
            // level up if exp > levelCap & increase levelCap
            if (skier.exp >= skier.levelCap) {
                skier.exp = skier.exp - skier.levelCap
                skier.level++
                skier.levelCap = Math.floor(skier.levelCap * 1.5)
            }
            currentHealth = skier.health
            // check if taking damage, if so, turn red
            if (currentHealth < prevHealth) {
            // turn skier red
            skierBro.setAttribute('src', './img/superSkierBro_2_150_red.png')
            } else {
                // turn skier red
            skierBro.setAttribute('src', './img/superSkierBro_2_150.png')
            }

            // track health for damage(red) function
            prevHealth = currentHealth
        }
    }
    //define snowboarder image
    const snowboardBro = document.createElement('img')
    snowboardBro.setAttribute('src', './img/snowboardBro_125.png')
    function Snowboarder(x, y, speed) {
        this.x = x
        this.y = y
        this.points = 10
        this.damage = 2
        this.value = Math.floor(Math.random() * speed * 2 + 10)
        this.health = 50
        this.width = 85
        this.height = 125
        this.render = function () {
            ctx.drawImage(snowboardBro, this.x, this.y)
        }
        this.movement = function () {
            this.x = this.x - speed
        }
        this.detectWeapon = () => {
            if (weapon.y < this.y + this.height &&
                weapon.y + weapon.height > this.y &&
                weapon.x + weapon.width > this.x &&
                weapon.x < this.x + this.width &&
                weapon.inGame === true) {
                this.health -= 25
                weapon.inGame = false
                if (this.health <= 0) {
                    skier.exp += this.value
                }
            }
        }
        this.detectHit = () => {
            if (skier.y < this.y + this.height &&
                skier.y + skier.height > this.y &&
                skier.x + skier.width - 40 > this.x &&
                skier.x + 60 < this.x + this.width) {
                doDamage(this.damage)
            }
        }
        // detect attack, bounce, get points
        this.detectJumpAttack = () => {
            if (this.y < skier.y + skier.height &&
                skier.y + skier.height < this.y + 25 &&
                skier.x + skier.width - 40 > this.x &&
                skier.x + 40 < this.x + this.width) {
                skier.y -= 40
                this.health -= 50
                skier.points += this.points
                skier.exp += this.value

            }
        }
        this.gameLoop = () => {
            //check if BadGuy is alive, move baddies, check for hits
            if (badGuy.health > 0) {
                badGuy.movement()
                badGuy.render()
                badGuy.detectJumpAttack()
                badGuy.detectHit()
                badGuy.detectWeapon()
            } else {
                // else spawn new baddy
                killCount += 1
                skier.hatersResolved += 1
                badGuy = new Snowboarder(700 + Math.floor(Math.random() * 400), 275, Math.random()*20+5)
            }
            // of baddy runs off screen spawn new baddy
            if (badGuy.x < -badGuy.width) {
                badGuy = new Snowboarder(800, 275, Math.random()*20+5)
            }
        }
    }
    //define skiPatrol image
    const skiPatrolBro = document.createElement('img')
    skiPatrolBro.setAttribute('src', './img/skiPatrol_125.png')
    function SkiPatrol(x, y, speed) {
        this.x = x
        this.y = y
        this.speed = 10
        this.points = 25
        this.damage = 3
        this.value = Math.floor(Math.random() * speed * 3 + 10)
        this.health = 150
        this.width = 115
        this.height = 125
        this.render = function () {
            ctx.drawImage(skiPatrolBro, this.x, this.y)
        }
        this.movement = function () {
            this.x = this.x + this.speed
        }
        this.detectHit = () => {
            if (skier.y < this.y + this.height &&
                skier.y + skier.height > this.y &&
                skier.x + skier.width - 40 > this.x &&
                skier.x + 60 < this.x + this.width) {
                doDamage(this.damage)
            }
        }
        this.detectWeapon = () => {
            if (weapon.y < this.y + this.height &&
                weapon.y + weapon.height > this.y &&
                weapon.x + weapon.width > this.x &&
                weapon.x < this.x + this.width &&
                weapon.inGame === true) {
                this.health -= 25
                weapon.inGame = false
                if (this.health <= 0) {
                    skier.exp += this.value
                }
            }
        }
        // detect attack, bounce, get points
        this.detectJumpAttack = () => {
            if (this.y < skier.y + skier.height &&
                skier.y + skier.height < this.y + 25 &&
                skier.x + skier.width - 40 > this.x &&
                skier.x + 40 < this.x + this.width) {
                skier.y -= 70
                this.health -= 50
                skier.points += this.points
                skier.exp += this.value

            }
        }
        this.gameLoop = () => {
            // add skiPatrol if over level 5
            if (skier.level > 4 && badGuy2.health > 0) {
                badGuy2.movement()
                badGuy2.render()
                badGuy2.detectJumpAttack()
                badGuy2.detectHit()
                badGuy2.detectWeapon()
            } else if (skier.level > 4) {
                killCount += 1
                skier.hatersResolved += 1
                badGuy2 = new SkiPatrol(600, 275, Math.random()*20+5)
            }
            // if badGuy2 runs off screen, run other way
            if (badGuy2.x >= game.width || badGuy2.x < 10){
                badGuy2.speed = badGuy2.speed * -1
            }
        }
    }
     //define skiPatrol image
    const skiPole = document.createElement('img')
    skiPole.setAttribute('src', './img/skiPole_100.png')
     function SkiPole(x, y, ingame) {
        this.x = x
        this.y = y
        this.speed = 25
        this.width = 100
        this.height = 20
        this.damage = 25
        this.inGame = ingame
        this.render = function () {
            ctx.drawImage(skiPole, this.x, this.y)
        }
        this.movement = function () {
            this.x = this.x + this.speed
        }
        this.gameLoop = () => {
            if (weapon.inGame === true) {
            weapon.render()
            weapon.movement()
            }
            // stop rendering weapon if off screen
            if (weapon.x + weapon.width > game.width) {
                weapon.inGame = false
            }
        }
    }
    // game over function 
    function gameOver() {
        // log variables
        currentScore = skier.points
        currentHaters = skier.hatersResolved
        if (currentScore > highScore) {
            highScore = currentScore
        }

        // stop game loop
        clearInterval(runGame)
        // clear board
        ctx.clearRect(0, 0, game.width, game.height)
        let GameOverBlock = document.createElement('div')
        GameOverBlock.classList.add('gameOver')
        // message game over
        let GameOverMsg = document.createElement('h2')
        GameOverMsg.textContent = 'GAME OVER'
        GameOverBlock.appendChild(GameOverMsg)
        // give stats
        let gameStats = document.createElement('p')
        gameStats.classList.add('stats')
        gameStats.textContent = `You made it to level ${skier.level} with ${skier.points} points!`
        GameOverBlock.appendChild(gameStats)
        let gameStats2 = document.createElement('p')
        gameStats2.classList.add('stats')
        gameStats2.textContent = `You resolved ${currentHaters} haters this round`
        GameOverBlock.appendChild(gameStats2)
        // tell user if new high score/talk smack if not
        if (currentScore < highScore) {
            let gameStats3 = document.createElement('p')
            gameStats3.classList.add('stats')
            gameStats3.textContent = `IF YOU AIN'T FIRST, YOU LAST`
            GameOverBlock.appendChild(gameStats3)
        } else if (currentScore == highScore) {
            let gameStats3 = document.createElement('p')
            gameStats3.classList.add('stats')
            gameStats3.textContent = `NEW HIGH SCORE!!!`
            GameOverBlock.appendChild(gameStats3)
        }
        // show high score
        let gameStats4 = document.createElement('p')
        gameStats4.classList.add('stats')
        gameStats4.textContent = `High Score: ${highScore}`
        GameOverBlock.appendChild(gameStats4)
        // restart button
        let restart = document.createElement('button')
        restart.classList.add('restart')
        restart.setAttribute('type', 'reset')
        restart.textContent = 'Try Again?'
        GameOverBlock.appendChild(restart)

        body.appendChild(GameOverBlock)
        //listen for click
        restart.addEventListener('click', reset)
        pause.removeEventListener('click', instructionsPause)
    }
    
    function reset() {
        currentHaters = 0
        skier = new Skier(325, 250)
        badGuy = new Snowboarder(800, 275, Math.random()*15+5)
        runGame = setInterval(gameLoop, 60)
        let StartOver = document.querySelector('.gameOver')
        body.removeChild(StartOver)
        pause.addEventListener('click', instructionsPause)
    }
    // insctructions
    function instructionsPause() {
        // stop game loop
        clearInterval(runGame)
        // ctx.clearRect(0, 0, game.width, game.height)
        let instructionsBlock = document.createElement('div')
        instructionsBlock.classList.add('instructions')
        // message game over
        let instructionsMsg = document.createElement('h2')
        instructionsMsg.textContent = 'How to Play'
        instructionsBlock.appendChild(instructionsMsg)
        // give stats
        let gameKeys = document.createElement('p')
        gameKeys.classList.add('keys')
        gameKeys.innerText = 'Move with: A & D \n Jump with: W'
        instructionsBlock.appendChild(gameKeys)
        let gameQuote = document.createElement('p')
        gameQuote.classList.add('quote')
        gameQuote.innerText = `Help make the world a better place,\n take out as many haters as possible.`
        instructionsBlock.appendChild(gameQuote)
        // restart button
        let start = document.createElement('button')
        start.classList.add('ready')
        start.setAttribute('type', 'reset')
        start.textContent = 'Ready'
        instructionsBlock.appendChild(start)
        // append to page
        body.appendChild(instructionsBlock)
        //listen for click
        pause.removeEventListener('click', instructionsPause)
        start.addEventListener('click', play)
        music.stop()
    }

    function play() {
        let instructions = document.querySelector('.instructions')
        body.removeChild(instructions)
        pause.addEventListener('click', instructionsPause)
        runGame = setInterval(gameLoop, 60)
        music.play()
    }
    

// set game speed  && run game
let runGame = setInterval(gameLoop, 60)
//listen for key inputs
document.addEventListener('keydown', movementHandler)
// listen for pause button
let pause = document.querySelector('.pause')
pause.addEventListener('click', instructionsPause)
// start game then pause instantly to show instructions
instructionsPause()
})
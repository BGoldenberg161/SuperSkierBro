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
    let badGuy = new Snowboarder(800, 275)
    
    // game variables
    let gravity = 4
    let killCount = 0
    let backLocation = 0

    // game loop
    const gameLoop = () => {
        //clear canvas
        ctx.clearRect(0, 0, game.width, game.height)
        // if skier dead => pop up game over screen
        if (skier.health <= 0) {
            gameOver()
            console.log('GameOver')
        }
        //update displays
        levelDisplay.textContent = `SkierBro Level: ${skier.level} \n Haters Resolved: ${killCount}`
        healthDisplay.textContent = `Health: \n ${skier.health}`
        pointsDisplay.textContent = `Points: ${skier.points} \n Exp: ${skier.exp}`
        //check if BadGuy is alive, move baddies, check for hits
        if (badGuy.health > 0) {
            badGuy.movement()
            badGuy.render()
            badGuy.detectJumpAttack()
            badGuy.detectHit()
        } else {
            // else spawn new baddy
            killCount += 1
            badGuy = new Snowboarder(700 + Math.floor(Math.random() * 400), 275)
        }
        // of baddy runs off screen spawn new baddy
        if (badGuy.x < -badGuy.width) {
            badGuy = new Snowboarder(800, 275)
        }
        // level up if exp > levelCap & increase levelCap
        if (skier.exp >= skier.levelCap) {
            skier.exp = skier.exp - skier.levelCap
            skier.level++
            skier.levelCap = Math.floor(skier.levelCap * 1.5)
        }
        // render skierBro
        skier.render()
        // run gravity and momentum
        gravityFun()
        momentum()
        friction()
        moveBackground()
    }
    //functions
    // gravity
    const gravityFun = e => {
        if (skier.y + skier.height < game.height) gravity = gravity + .05
        else if (skier.y + skier.height == game.height) gravity = 4
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
                if (skier.accl > -15 && skier.y >= game.height - skier.height)
                    skier.accl -= 3
                // canvas.style.backgroundPositionX -= 10
                break
            case (68):// d - accelerate right
                if (skier.accl < 15 && skier.y >= game.height - skier.height)
                    skier.accl += 3
            // case (32):// space - attack
            //     attackForward()
            //     setTimeout(attackForward, 500)
            //     break
            // defalut:
            //     console.log('invalid keystroke')
        }
    }

    // space bar attack
    function attackForward() {
        if (!attack) {
            skier.width += 10
            attack = true
        } else {
            skier.width -= 10
            attack = false
        }
    }

    function doDamage(damage) {
        skier.health = skier.health - damage
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
        this.height = 150
        this.accl = 0
        this.exp = 0
        this.levelCap = 50
        this.render = function () {
            ctx.drawImage(skierBro, this.x, this.y)
        }
    }
    //define snowboarder image
    const snowboardBro = document.createElement('img')
    snowboardBro.setAttribute('src', './img/snowboardBro_125.png')
    function Snowboarder(x, y) {
        this.x = x
        this.y = y
        this.points = 10
        this.damage = 2
        this.value = Math.floor(Math.random() * 40 + 10)
        this.health = 50
        this.width = 85
        this.height = 125
        this.render = function () {
            ctx.drawImage(snowboardBro, this.x, this.y)
        }
        this.movement = function () {
            this.x = this.x - Math.floor(Math.random() * 15)
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
    }
    function SkiPatrol(x, y) {
        this.x = x
        this.y = y
        this.points = 25
        this.damage = 5
        this.value = Math.floor(Math.random() * 75 + 25)
        this.health = 100
        this.width = 40
        this.height = 40
        this.color = 'red'
        this.moveLeft = true
        this.render = function () {
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
        this.movement = function () {
            if (this.x <= 20) {
                this.moveLeft = false
            } else if (this.x >= game.width - this.width - 20) {
                this.moveLeft = true
            }
            if (this.moveLeft) {
                this.x = this.x - Math.floor(Math.random() * 5)
            }
            else {
                this.x = this.x + Math.floor(Math.random() * 5)
            }

        }
    }

    // game over function 
    function gameOver() {

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
        // current level, talk smack
        let gameStats = document.createElement('p')
        gameStats.classList.add('stats')
        gameStats.textContent = `You made it to level ${skier.level}! \n True skiers: lvl 20+`
        GameOverBlock.appendChild(gameStats)
        // restart button
        let restart = document.createElement('button')
        restart.classList.add('restart')
        restart.setAttribute('type', 'reset')
        GameOverBlock.appendChild(restart)

        body.appendChild(GameOverBlock)
    }

// set game speed
let runGame = setInterval(gameLoop, 60)
//listen for key inputs
document.addEventListener('keydown', movementHandler)

})
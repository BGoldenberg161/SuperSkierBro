// golbals
let levelDisplay
let healthDisplay
let game
let ctx
let skier
let badGuy
let attack = false
let skierLocateX =[]
let skierLocateY =[]
let levelCount = 1
let killCount = 0
let backLocation = 0


// game loop
const gameLoop = () => {
    //clear canvas
    ctx.clearRect(0, 0, game.width, game.height)
    //update displays
    levelDisplay.textContent = `SkierBro Level: ${levelCount}\nSnowboarders resolved: ${killCount}`
    healthDisplay.textContent = `Health: ${skier.health}`
    pointsDisplay.textContent = `Points: ${skier.points}\nExp: ${skier.exp}`
    //check if BadGuy is alive, move baddies, check for hits
    if (badGuy.health > 0) {
        badGuy.movement()
        badGuy.render()
        detectJumpAttack()
        detectHit()
    } else {
        // else spawn new baddy
        killCount += 1
        badGuy = new Snowboarder(750, 360, Math.floor(Math.random()*40+10))
    }
    // of baddy runs off screen spawn new baddy
    if (badGuy.x < -badGuy.width) {
        badGuy = new Snowboarder(800, 360, Math.floor(Math.random()*40+10))
    }
    // level up if exp > levelCap & increase levelCap
    if (skier.exp >= skier.levelCap) {
        skier.exp = skier.exp - skier.levelCap
        levelCount++
        skier.levelCap = Math.floor(skier.levelCap * 1.5)
    }
    // render skierBro
    skier.render()
    // run gravity and momentum
    gravity()
    momentum()
    friction()
    moveBackground()
    
    // if skier dead => pop up game over screen
    if (skier.health <= 0){
        console.log('GameOver')
    }
}
//functions
const detectHit = () => {
    if( skier.y < badGuy.y + badGuy.height &&
        skier.y + skier.height > badGuy.y && 
        skier.x + skier.width > badGuy.x &&
        skier.x < badGuy.x + badGuy.width) {
        doDamage()
     }
}

// detect attack, bounce, get points
const detectJumpAttack = () => {
    if( badGuy.y < skier.y + skier.height&&
        skier.y + skier.height < badGuy.y + 5 && 
        skier.x + skier.width > badGuy.x &&
        skier.x < badGuy.x + badGuy.width) {
        skier.y -= 30
        badGuy.health -= 50
        skier.points += 10
        skier.exp += badGuy.value

    }
}
// gravity
const gravity = e => {
    if (skier.y < game.height - skier.height) skier.y += 3
}
// movement left/right
const momentum = e => {
    if (skier.x > 0 && skier.x < game.width - skier.width) skier.x += skier.accl // change speed based on inputs
    if (skier.x <= 0) {skier.x += 10 // bounce off wall 
                       skier.accl = -skier.accl * .5}// reverse half momentum
    if (skier.x >= game.width - skier.width) {skier.x -= 10 // bounce off wall
                                              skier.accl = -skier.accl * .5} // reverse half momentum
}
// friction
const friction = e => {
    if (skier.y >= game.height-skier.height) skier.accl = skier.accl*.8 // on ground
    else skier.accl = skier.accl*.97 // in air
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
            if (skier.y >= game.height-skier.height) 
            skier.y -= 75
            break
        case (83):// s - down
            if (skier.y < game.height - skier.height) 
            skier.y += 3 
            break
        case (65):// a - accelerate left 
            if (skier.accl > -15 && skier.y >= game.height-skier.height) 
            skier.accl -= 3
            // canvas.style.backgroundPositionX -= 10
            break
        case (68):// d - accelerate right
            if (skier.accl < 15 && skier.y >= game.height-skier.height) 
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
    if (!attack){
        skier.width += 10
        attack = true
    } else {
        skier.width -= 10
        attack = false
    }
}

function doDamage() {
    skier.health = skier.health - 1
}

function Skier(x, y) {
    this.x = x
    this.y = y
    this.health = 100
    this.points = 0
    this.width = 50
    this.height = 50
    this.color = 'forestgreen'
    this.accl = 0
    this.exp = 0
    this.levelCap = 50
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
function Snowboarder(x, y, exp) {
    this.x = x
    this.y = y
    this.value = exp
    this.health = 50
    this.width = 40
    this.height = 40
    this.color = 'brown'
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    this.movement = function () {
        this.x = this.x - Math.floor(Math.random() * 15)
    }
}
function SkiPatrol(x, y, exp) {
    this.x = x
    this.y = y
    this.value = exp
    this.health = 100
    this.width = 40
    this.height = 40
    this.color = 'red'
    this.moveLeft = true
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    this.movement = function () {
        if (this.x <= 20) {
            this.moveLeft = false
        } else if (this.x >=game.width - this.width - 20) {
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



document.addEventListener('DOMContentLoaded', () => {
    levelDisplay = document.getElementById('level')
    healthDisplay = document.getElementById('hp')
    pointsDisplay = document.getElementById('points')
    game = document.getElementById('game')
    canvas = document.querySelector('canvas')
    // set some canvas configs
    game.setAttribute('height', '400px')
    game.setAttribute('width', '700px')
    ctx = game.getContext('2d')

    skier = new Skier(325, 350)
    badGuy = new Snowboarder(800, 360, Math.floor(Math.random()*40+10))
    document.addEventListener('keydown', movementHandler)

    let runGame = setInterval(gameLoop, 60)
})
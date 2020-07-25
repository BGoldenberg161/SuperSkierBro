// golbals
let levelDisplay;
let healthDisplay;
let game;
let ctx;
let skier;
let badGuy;
let SkierLocateX;
let SkierLocateY;

//functions
const detectHit = () => {
    if( skier.y < badGuy.y + badGuy.height &&
        skier.y + skier.height > badGuy.y && 
        skier.x + skier.width > badGuy.x &&
        skier.x < badGuy.x + badGuy.width) {
            skier.health = skier.health - 1
            console.log(SkierLocateX)
            console.log(SkierLocateY)
    }
}

const gameLoop = () => {
    //clear canvas
    ctx.clearRect(0, 0, game.width, game.height)
    //update displays
    levelDisplay.textContent = `X:${skier.x}\nY:${skier.y}`
    healthDisplay.textContent = `Health:${skier.health}`
    pointsDisplay.textContent = `Points:${skier.points}`
    //check if BadGuy is alive
    if (badGuy.alive) {
        // check for collision
        badGuy.render()
        detectHit()
    }
    // render skierBro
    skier.render()
    // run gravity
    gravity()
    
}

const gravity = e => {
    if (skier.y < game.height - skier.height) skier.y += 5
}

const movementHandler = e => {

    switch (e.keyCode) {
        case (87): // w - up
            if (skier.y > 0) skier.y -= 75
            break
        case (83):// s - down
            if (skier.y < game.height - skier.height) skier.y += 5
            break
        case (65):// a - left
            if (skier.x > 0) skier.x -= 10
            break
        case (68):// d - right
            if (skier.x < game.width - skier.width) skier.x += 10
            break
        // defalut:
        //     console.log('invalid keystroke')
    }
}

function Skier(x, y, color) {
    this.x = x
    this.y = y
    this.health = 100
    this.points = 0
    this.width = 50
    this.height = 50
    this.color = color
    this.alive = true
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
function BadGuy(x, y) {
    this.x = x
    this.y = y
    this.health = 50
    this.width = 40
    this.height = 40
    this.color = 'brown'
    this.alive = true
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}



document.addEventListener('DOMContentLoaded', () => {
    levelDisplay = document.getElementById('movement')
    healthDisplay = document.getElementById('hp')
    pointsDisplay = document.getElementById('points')
    game = document.getElementById('game')
    // set some canvas configs
    game.setAttribute('height', '350px')
    game.setAttribute('width', '700px')
    ctx = game.getContext('2d')

    skier = new Skier(325, 300, 'red')
    badGuy = new BadGuy(500, 310)
    document.addEventListener('keydown', movementHandler)

    let runGame = setInterval(gameLoop, 60)

})
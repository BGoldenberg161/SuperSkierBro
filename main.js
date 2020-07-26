// golbals
let levelDisplay;
let healthDisplay;
let game;
let ctx;
let skier;
let badGuy;
let attack = false;
let skierLocateX =[];
let skierLocateY =[];
let levelCount = 1;

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
        badGuy.alive = false
        skier.points += 10

    }
}

const gameLoop = () => {
    //clear canvas
    ctx.clearRect(0, 0, game.width, game.height)
    //update displays
    levelDisplay.textContent = `Level: ${levelCount}`
    healthDisplay.textContent = `Health:${skier.health}`
    pointsDisplay.textContent = `Points:${skier.points}`
    //check if BadGuy is alive
    if (badGuy.alive) {
        // check for collision
        badGuy.movement()
        badGuy.render()
        detectJumpAttack()
        detectHit()
    } else {
        badGuy = new BadGuy(750, 360)
    }
    if (badGuy.x < -badGuy.width) {
        badGuy = new BadGuy(800, 360)
    }
    if (skier.points % 50 === 0 && skier.points !== 0) {
        levelCount++
    }
    // render skierBro
    skier.render()
    // run gravity
    gravity()
    
    // track skier location
    // for (i = 0; i < 5000; i++) {
    //     if (i === 5000){
    //         i = 0
    //     }
    //     if (i % 100 == false) {
    //     skierLocateX[i] = skier.x
    //     skierLocateY[i] = skier.y
    //     }
    // }
}

const gravity = e => {
    if (skier.y < game.height - skier.height) skier.y += 3
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
        case (65):// a - left 
            if (skier.x > 0) 
            skier.x -= 10
            // canvas.style.backgroundPositionX -= 10
            break
        case (68):// d - right
            if (skier.x < game.width - skier.width) 
            skier.x += 10
        // case (32):// space - attack
        //     attackForward()
        //     setTimeout(attackForward, 500)
        //     break
        // defalut:
        //     console.log('invalid keystroke')
    }
}
// build array for test for directionality
// let test = [1, 1, 1, 3, 3, 3, 5, 5, 5, 5, 7, 7, 7, 7, 7, 9]
// function findDiffNumbs(array) {
//     let result = array.filter(e => (e !== )
//         console.log(result)
//     })
// }
// console.log(findDiffNumbs(test))

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
    skier.health = skier.health - 25
    // console.log(skierLocateX)
    // console.log(skierLocateY)
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
    this.movement = function () {
        this.x = this.x - Math.floor(Math.random() * 5)
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

    skier = new Skier(325, 350, 'red')
    badGuy = new BadGuy(800, 360)
    document.addEventListener('keydown', movementHandler)

    let runGame = setInterval(gameLoop, 60)

})
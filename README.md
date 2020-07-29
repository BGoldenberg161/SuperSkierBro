# SuperSkierBro
____
Project 1 General Assembly 713 Squad
## Requirements
* Display a game in the browser
* Switch turns between two players, or have the user play the computer (AI or obstacles)
* Design logic for winning & visually display which player won
* Include separate HTML / CSS / JavaScript files
* Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
* Use Javascript for DOM manipulation
* Deploy your game online, where the rest of the world can access it
* Use semantic markup for HTML and CSS (adhere to best practices)

## Concept
I wanted to create a spin off of a classic, but I knew that one week is not a ton of time and I wanted to ensure I was happy with my final product so I picked something familiar. I went for an old school SuperMario feel where the player can jump on 'bad guys' to do damage while gaining experience points to level up. As I got my game working, I began to add more features like a weapon, as well as more game feedback such as high score tracking. 
____

## Blockers
Working through the blockers is what makes writing code rewarding. In this project I certainly had my fair share.

#### Jump Attack
Working out the colision detection so that the player was delt damage if hitting an ememy from the side vs. doing damage to the enemy if colliding from the top. To accomplish this, I ended up using logic to define when only the very top of the enemy collides with the very bottom of the player.
``` javascript
this.detectHit = () => {
            if (skier.y < this.y + this.height &&
                skier.y + skier.height > this.y &&
                skier.x + skier.width - 40 > this.x &&
                skier.x + 60 < this.x + this.width) {
                doDamage(this.damage)
            }
        }
```
I had to play with the x axis when referencing my skier because I didn't want the skis to do damage, just his feet. 

#### Multiple Enemies
Having more than one enemy on the screen ment that I had to individually define each character with their own hitDetect functions for each case. So when I added my ski pole weapon, I also added a function for that. Below is the constructor function for my ski patroler:
```javascript
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
    }
```
To condense I kept the game loop function out of the object above. I moved this function into the object to clean up the main game loop and make it easier to read. Keeping all functionality relative to each character within it.





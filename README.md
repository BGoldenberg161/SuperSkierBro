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
## Music
To tribute to the throwback feel. I went with a TonyHawk Pro Skater 1 song. Superman by Goldfinger
____
## How to Play
Move Left - A  
Move Right - D  
Jump - W  
Throw Ski Pole - Space Bar

Resolve haters by throwing ski poles and/or jumping on top of them. Experience points are randomly generated based on the enemies speed. Ski poles do half the damage of a jump. Snowboarders are resolved with 1 jump, ski patrol with 3 jumps and the yeti takes 5 jumps.... If you get there.

Deployed with github here: [SuperSkierBro](https://bgoldenberg161.github.io/SuperSkierBro/)
____
## Blockers
Working through the blockers is what makes writing code rewarding. In this project I certainly had my fair share.

### Jump Attack
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

### Multiple Enemies
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
To condense I kept the game loop function out of the object above. I moved this function into the object to clean up the main game loop and make it easier to read. Keeping all functionality relative to each character contained within it.

### Character and Background Images
After searching for hours online for something resembling the characters I had in my mind, I changed paths and decided to draw my own! Althought this was a daunting task at first, I am mighty impressed with myself! The process was rather drawn out, but I love how it turned out so I will detail what happened for each character below:
1. Draw them in pencil
2. Give them a darker outline with a marker
3. Take a picture phone
4. Import to Gimp
5. Cut out, color, and scale character
____
## Thanks for Playing!
Any feedback is welcomed and appreciated. Feel free to fork and clone this repo. Although I am busy, I will periodically check in for any pull requests! I would love for this game to continue to improve over time, but at the very least...  Enjoy!
____
## Author
* Branden Goldenberg - Initial creator
* Would love to add more names below!

### Shoutouts
Thanks to the Shit Skiers Say youtube video for the bro sound effect, and to Get Safe! by Camp Gnartron for the ski patrol and yeti voices. And obviously mucho thanks to the many classmates for the creative ideas!!


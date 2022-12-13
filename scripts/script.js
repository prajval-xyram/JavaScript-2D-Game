window.addEventListener('load', function(){
    //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    //keeps track of user entered inputs
    class InputHandler{

        constructor(game){

            this.game = game;

            //arrow function used
            //"this" inside arrow function always represents the object in which the arrow function is defined
            //can access this.game

            //listens for pressed key
            window.addEventListener('keydown', e => {
                if( ((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) && (this.game.keys.indexOf(e.key) === -1) ){ //ensures that 'ArrowUp' is only added once to array
                    this.game.keys.push(e.key);
                }
                else if(e.key === ' '){ //spacebar
                    this.game.player.shootTop();
                }
                // console.log(this.game.keys);                
            });

            //listens for released key
            window.addEventListener('keyup', e => {

                //indexOf() method returns first index at which given element can be found in array
                //indexOf() method returns -1 if element is not present 
                if (this.game.keys.indexOf(e.key) > -1){

                    //splice() method removes/replaces existing elements 
                    //removes 1 element at index this.game.keys.indexOf(e.key) 
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                // console.log(this.game.keys);
            });

        }

    }

    //lasers
    class Projectile{
        constructor(game, x, y){
            this.game = game;
            this.x = x; 
            this.y = y; 
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        
        update(){
            this.x += this.speed;

            //if projectile has moved across 80% of game area, it can be deleted
            if (this.x > this.game.width * 0.8){
                this.markedForDeletion = true;
            }
        }

        //drawing projectile
        draw(context){
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }

    }

    //falling stuff
    class Particle{

    }

    //main character
    class Player{
       
        //special method of class
        //when called, it will create a new object and assign it properties 
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20; //x position
            this.y = 100; //y position
            this.speedY = 0;
            this.maxSpeed = 3;
            this.projectiles = []; //projectiles array
        }
        
        //update method
        update(){
            //includes() method determines if an array includes a certain value among its entries
            //includes() method returns true or false
            //ArrowUp and ArrowDown will make block move
            if(this.game.keys.includes('ArrowUp')){
                this.speedY = -this.maxSpeed;
            }
            else if(this.game.keys.includes('ArrowDown')){
                this.speedY = this.maxSpeed;
            }
            else{
                this.speedY = 0;
            }

            this.y += this.speedY;

            //handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update(); 
            });

            //filter() method creates new array with all elements that pass the test implemented by provided function
            //every time markedForDeletion == true on a projectile, it will get removed from projectiles[]
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }

        //draw method
        //context specifies which canvas element to draw on
        draw(context){
            context.fillStyle = 'black';
            context.fillRect(this.x, this.y, this.width, this.height);

            this.projectiles.forEach(projectile => {
                projectile.draw(context); 
            });
        }
        shootTop(){
            if(this.game.ammo > 0){
                //push new projectiles in array
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                console.log(this.projectiles);

                //ammo reduced everytime it gets used
                this.game.ammo--;
            }
        }
    }

    //enemy types
    class Enemy{

    }

    //background layers
    class Layer{

    }

    //put all layers together
    class Background{

    }

    //score, timer, etc
    class UI{

        constructor(game){
            this.game = game;
            this.fontsize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }
            
            draw(context){
                //ammo
                context.fillStyle = this.color;
                
                for(let i = 0; i < this.game.ammo; i++){
                    context.fillRect(20 + 5 * i, 50, 3, 20);
                }
            }

    }
 

    //main brain
    class Game{

        //run once the class is instantiated using the "new" keyword
        //will create a new blank object with the values and properties defined inside the blueprint
        constructor(width, height){
            this.width = width;
            this.height = height;
            //creates an instance of Player
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.ammo = 20;
            this.maxAmmo = 50; //max ammo 
            this.ammoTimer = 0; 
            this.ammoInterval = 500; //interval to replenish ammo
        } 

        update(deltaTime){
            this.player.update();

            if (this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo){
                    this.ammo++;
                }
                this.ammoTimer = 0;
            }
            else{
                this.ammoTimer += deltaTime;
            }
        }

        draw(context){
            this.player.draw(context);
            this.ui.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    //animate loop
    //chose timeStamp as variable name for requestAnimationFrame() time stamp 
    function animate(timeStamp){

        //timeStamp comes from requestAnimationFrame(), which passes a time stamp as an argument to the function is calls
        const deltaTime = timeStamp - lastTime; //difference in ms

        console.log(deltaTime); //around 16.6ms, (1000ms/16.6ms) = 60FPS

        lastTime = timeStamp; //update lastTime for next loop

        //deletes all canvas drawings between each animation frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime); //run periodic events in game or measure game time
        game.draw(ctx);
        //requests browser to call a specified funtion to update an animation before the next repaint
        //argument is the function animate
        requestAnimationFrame(animate);
    }

    animate(0); //pass zero as the first time stamp

});

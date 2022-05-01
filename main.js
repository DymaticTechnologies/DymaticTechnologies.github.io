var DymaticLogoThickness = 20;
var LogoMinColor = 0.8;
var LogoFarColor = 0.1;

var frameTime = 1/60;

function lerp(a, b, t) {
    return (1 - t) * b + t * a;
}

function GetRandomInRange(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function OnCreate()
{
    var div = document.getElementById("DymaticLogo");

    for (let i = 0; i < DymaticLogoThickness; i++)
    {
        var element = div.appendChild(div.children[0].cloneNode(true));
        element.style.zIndex = -i;
        element.style.transform = "translateZ(" + -i * +"px)";
        var color = lerp(LogoMinColor, LogoFarColor, i / DymaticLogoThickness);
        element.style.filter = "brightness(" + color + ")";
    }
    div.children[0].remove();
}

var mouseX = 0;
var mouseY = 0;
document.onmousemove = function(e){ mouseX = e.clientX; mouseY = e.clientY; }
var currentTime = 0.0;

setInterval(function(){
    currentTime += frameTime;

    var div = document.getElementById("DymaticLogo");

    for (let i = 0; i < DymaticLogoThickness; i++)
    {
        var element = div.children[i].children[0];
        var multiplier = 2.0 * ((i - DymaticLogoThickness / 2) * (1 / ((1 / 1000) * Math.pow(i - DymaticLogoThickness / 2, 2) + 1)));
        element.style.transform = "translate(" + ((mouseX - (element.getBoundingClientRect().left)) / window.screen.width) * (multiplier) +"px, " + ((mouseY - (element.getBoundingClientRect().top)) / window.screen.height) * multiplier + "px)";

        // Update Ring
        element.children[0].style.transform = "scale(" + (Math.sin(currentTime * 3.5) * 0.25 + 1.5) + ")";
    }
}, frameTime * 1000);


// Particles
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    let particleArray;
    
    // get mouse mouse position ///////////////////////////////
    let mouse = {
        x: null,
        y: null,
        radius: ((canvas.height/80) * (canvas.width/80))
    }
    window.addEventListener('mousemove', 
	function(event){
        mouse.x = event.x;
		mouse.y = event.y;
    });
    
    // create Particle
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.speedX = this.directionX;
            this.speedY = this.directionY;
        }
        // create method to draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI * 2, false);
            
            var a = Math.sqrt(Math.pow(this.x - window.screen.width / 2, 2) + Math.pow(this.y - window.screen.height / 2, 2)) < 100 ? 0 : 1;

            ctx.fillStyle = 'rgba(175,175,175, ' + a + ')';
            ctx.fill();
        }
        
        // check particle position, check mouse position, move the paticle, draw the particle
        update() {
            // check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0){
                this.directionX = -this.directionX;
                this.speedX = this.directionX;
            } if (this.y + this.size > canvas.height || this.y - this.size < 0){
                this.directionY = -this.directionY;
                this.speedY = this.directionY;
            }
            // check mouse position/particle position - collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size){
                if(mouse.x < this.x && this.x < canvas.width - this.size*10){
                    this.x+=1;
                }
                if (mouse.x > this.x && this.x > this.size*10){
                    this.x-=1;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size*10){
                    this.y+=1;
                }
                if (mouse.y > this.y && this.y > this.size*10){
                    this.y-=1;
                }
            }
            // move particle
            this.x += this.directionX;
            this.y += this.directionY;
            // call draw method
        this.draw();
    }
}

// check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++){
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
            +   ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));
            if  (distance < (canvas.width/7) * (canvas.height/7))
            {   
                opacityValue = 1-(distance/10000);
                ctx.strokeStyle='rgba(255,255,255,' + opacityValue +')';
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
                
            }    
        }
    }
}

// create particle array 
function init(){
    particleArray = [];
    let numberOfParticles = (canvas.height*canvas.width)/9000;
    for (let i=0; i<numberOfParticles; i++){
        let size = (Math.random()*5)+1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        
        let color = 'gold';
        particleArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// create animation loop
function animate(){
    requestAnimationFrame(animate);
	ctx.clearRect(0,0,innerWidth,innerHeight);
	
	for (let i = 0; i < particleArray.length; i++){
        particleArray[i].update();
	}
    connect();
}
init();
animate();


// RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
window.addEventListener('resize',
function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height/80) * (canvas.width/80));
    init();
	}
    )
    // 2) SET MOUSE POSITION AS UNDEFINED when it leaves canvas//////
    window.addEventListener('mouseout',
	function(){
        mouse.x = undefined;
	    mouse.y = undefined;
        console.log('mouseout');
	}
    )
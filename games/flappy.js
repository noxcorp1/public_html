game = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function(width,height) {
        if (!this.init) {
            this.init = true;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style = "background: blue";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("fb");
            place.appendChild(this.canvas);
            this.score = 0;
            this.loop = setInterval(tick,20);
        }
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    reset: function() {
        this.score = 0;
    }
}

player = {
    size: 20,
    bsize: 8,
    x: 20,
    y: game.canvas.height/2,
    yvel: 0,
    dead: false,
    render: function() {
        game.ctx.fillStyle = "yellow";
        game.ctx.fillRect(this.x,this.y,this.size,this.size);
        game.ctx.fillStyle = "orange";
        game.ctx.fillRect(this.x+this.size,this.y+(this.size/2),this.bsize,this.bsize);
        game.ctx.fillStyle = "black";
        game.ctx.fillRect(this.x+(this.size/2),this.y+(this.size/2),Math.round(this.size/4),Math.round(this.size/4));
    },
    update: function() {
        this.yvel -= 0.1;
        this.y -= this.yvel;
        if (this.y > game.canvas.height) {
            this.dead = true;
        }
        if (this.x+this.size > pipe.x && this.x < pipe.x+20 && (this.y+this.size > pipe.y+pipe.gap || this.y < pipe.y-pipe.gap)) {
            this.dead = true;
        }
    },
    reset: function() {
        this.dead = false;
        this.x = 10;
        this.y = game.canvas.height/2;
        this.yvel = 0;
    }
}

pipe = {
    gap: 35,
    x: game.canvas.width,
    y: Math.floor(Math.random()*(game.canvas.height-this.gap*4))+this.gap*2,
    render: function() {
        game.ctx.fillStyle = "green";
        game.ctx.fillRect(this.x,0,20,this.y-this.gap);
        game.ctx.fillRect(this.x-5,this.y-this.gap-10,30,10);
        game.ctx.fillRect(this.x,this.y+this.gap,20,game.canvas.height-this.y+this.gap);
        game.ctx.fillRect(this.x-5,this.y+this.gap,30,10);
    },
    update: function() {
        this.x -= 2
        if (this.x < -20) {
            this.reset();
            game.score += 1
        }
    },
    reset: function() {
        this.x = game.canvas.width;
        this.y = Math.floor(Math.random()*(game.canvas.height-this.gap*4))+this.gap*2;
    }
}

function init() {
    game.start(400,200);
    pipe.reset();
    document.addEventListener("keydown", function(event) {
        if (game.init) {
            if (event.key == "w") {
                player.yvel = 3;
            }
        }
    });
}

function tick() {
    game.clear();
    if (!player.dead) {
        player.update();
        pipe.update();
        player.render();
        pipe.render();
        game.ctx.font = "15px serif";
        game.ctx.fillStyle = "white";
        game.ctx.fillText(game.score.toString(),5,15);
    } else {
        game.ctx.font = "48px serif";
        game.ctx.fillStyle = "red";
        game.ctx.fillText("GAME OVER",50,50);
        game.ctx.fillText("Score: "+game.score.toString(),50,90);
    }
}

function reset() {
    pipe.reset();
    player.reset();
    game.reset();
}

function stop() {
    if (game.init) {
        document.getElementById("fb").removeChild(game.canvas);
        clearInterval(game.loop);
        reset();
        game.init = false;
    }
}
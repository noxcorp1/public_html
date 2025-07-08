const world = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function(width, height) {
        if (!this.init) {
            this.init = true;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style = "background: black; border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("world");
            place.appendChild(this.canvas);
            this.loop = setInterval(wtick,20);
        }
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

const maze = new wLevel(20,20);

function wLevel(width,height) {
    this.width = width;
    this.height = height;
    this.map = [];
    for (let i = 0; i < width; i++) {
        this.map.push(new Array(height));
    }
    this.gen = function() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.set(x,y,"wall");
            }
        }
        this.makeRoom(0,0,7,7,"start");
        this.set(6,3,"door");
        this.makeRoom(6,0,15,10,"start");
    }
    this.makeRoom = function(x,y,w,h,type) {
        for (let mx = x+1; mx < x+w-1; mx++) {
            for (let my = y+1; my < y+h-1; my++) {
                if (this.valid(mx,my)) {
                    this.set(mx,my,"floor");
                }
            }
        }
        if (type == "start") {
            this.set(x+Math.floor(w/2),y+Math.floor(h/2),"ladder");
        }
    }
    this.set = function(x,y,val) {
        this.map[x][y] = val;
    }
    this.get = function(x,y) {
        return this.map[x][y];
    }
    this.valid = function(x,y) {
        return (x>-1 && x<this.width && y>-1 && y<this.height);
    }
    this.draw = function(offx,offy,tsize) {
        for (let x = -1; x<Math.ceil(world.canvas.width/tsize)+1; x++) {
            for (let y = -1; y<Math.ceil(world.canvas.height/tsize)+1; y++) {
                const tx = x+Math.floor(offx/tsize);
                const ty = y+Math.floor(offy/tsize);
                const sx = tx*tsize-offx;
                const sy = ty*tsize-offy;
                if (this.valid(tx,ty)) {
                    const tile = this.get(tx,ty)
                    if (tile == "wall") {
                        world.ctx.fillStyle = "darkgrey";
                        world.ctx.fillRect(sx,sy,tsize,tsize);
                    } else if (tile == "floor") {
                        world.ctx.fillStyle = "white";
                        world.ctx.fillRect(sx,sy,tsize,tsize);
                    } else if (tile == "ladder") {
                        world.ctx.fillStyle = "white";
                        world.ctx.fillRect(sx,sy,tsize,tsize);
                        const rsize = Math.floor(tsize/5);
                        world.ctx.fillStyle = "brown";
                        world.ctx.fillRect(sx,sy,rsize,tsize);
                        world.ctx.fillRect(sx+tsize-rsize,sy,rsize,tsize);
                        world.ctx.fillRect(sx,sy+rsize,tsize,rsize);
                        world.ctx.fillRect(sx,sy+tsize-rsize*2,tsize,rsize);
                    } else if (tile == "door") {
                        world.ctx.fillStyle = "brown";
                        world.ctx.fillRect(sx,sy,tsize,tsize);
                    }
                }
            }
        }
    }
}

wplayer = {
    x: 0,
    y: 0,
    reset: function() {
        this.x = 0
        this.y = 0
    }
}

function winit() {
    if (!world.init) {
        world.start(400,200);
        maze.gen();
        document.addEventListener("keypress", function(event) {
            if (event.key == "w") {
                wplayer.y -= 4;
            }
            if (event.key == "s") {
                wplayer.y += 4;
            }
            if (event.key == "a") {
                wplayer.x -= 4;
            }
            if (event.key == "d") {
                wplayer.x += 4;
            }
        });
    }
}

function wtick() {
    world.clear();
    maze.draw(wplayer.x,wplayer.y,40);
}

function wreset() {
    maze.gen();
    wplayer.reset();
}

function wstop() {
    document.getElementById("world").removeChild(world.canvas);
    clearInterval(world.loop);
    wreset();
    world.init = false;
}
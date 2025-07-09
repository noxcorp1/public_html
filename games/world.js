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

const maze = new wLevel(50,50);

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
        this.makeRoom(0,0,7,7,"start",0,0);
    }
    this.makeRoom = function(x,y,w,h,type,dx,dy) {
        for (let mx = x+1; mx < x+w-1; mx++) {
            for (let my = y+1; my < y+h-1; my++) {
                if (this.valid(mx,my)) {
                    this.set(mx,my,"floor");
                }
            }
        }
        if (type == "start") {
            this.set(x+Math.floor(w/2),y+Math.floor(h/2),"ladder");
            this.set(x+w-1,y+Math.floor(w/2),"door");
            this.makeRoom(x+w-1,y,7,7,"",x+w,y+Math.floor(w/2));
        } else if (type == "library") {
            for (let mx = x+1; mx < x+w-1; mx++) {
                this.set(mx,y+1,"bookshelf");
            }
            let gap = 0;
            for (let my = y+4; my < y+h-1; my+=3) {
                if (Math.round(Math.random()*15) != 0 && my != dy) {
                    gap = Math.round(Math.random()*(w-4))+1;
                    for (let mx = x+1; mx < x+gap-1; mx++) {
                        this.set(mx,my,"bookshelf");
                    }
                    for (let mx = x+gap+2; mx < x+w-1; mx++) {
                        this.set(mx,my,"bookshelf");
                    }
                }
            }
            if (this.validRoom(x+gap-3,y+h-1,7,7)) {
                this.makeRoom(x+gap-3,y+h-1,7,7);
                this.set(x+gap,y+h-1,"door");
            }
        } else {
            if (Math.round(Math.random()) == 0) {
                let done = 0;
                while (done<5) {
                    const dir = Math.round(Math.random()*3);
                    if (dir == 0 && this.validRoom(x,y-h+1,w,h)) {
                        this.set(x+Math.floor(w/2),y,"door");
                        this.makeRoom(x,y-h+1,w,h);
                        return;
                    }
                    if (dir == 1 && this.validRoom(x,y+h-1,w,h)) {
                        this.set(x+Math.floor(w/2),y+h-1,"door");
                        this.makeRoom(x,y+h-1,w,h);
                        return;
                    }
                    if (dir == 2 && this.validRoom(x+w-1,y,w,h)) {
                        this.set(x+w-1,y+Math.floor(w/2),"door");
                        this.makeRoom(x+w-1,y,w,h);
                        return;
                    }
                    if (dir == 3 && this.validRoom(x-w+1,y,w,h)) {
                        this.set(x,y+Math.floor(w/2),"door");
                        this.makeRoom(x-w+1,y,w,h);
                        return;
                    }
                    done += 1;
                }
            } else {
                const wth = Math.round(Math.random()*5)+9;
                const hgt = Math.round(Math.random()*5)+7;
                if (this.validRoom(x+w-1,y,wth,hgt)) {
                    this.set(x+w-1,y+Math.floor(w/2),"door");
                    this.makeRoom(x+w-1,y,wth,hgt,"library",x+w,y+Math.floor(w/2));
                }
            }
        }
    }
    this.validRoom = function(x,y,w,h) {
        for (let mx = x+1; mx < x+w-1; mx++) {
            for (let my = y+1; my < y+h-1; my++) {
                if (!this.valid(mx,my) || this.get(mx,my) != "wall") {
                    return false;
                }
            }
        }
        return true;
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
                    } else if (tile == "bookshelf") {
                        world.ctx.fillStyle = "brown";
                        world.ctx.fillRect(sx,sy,tsize,tsize);
                        const rsize = Math.floor(tsize/9);
                        world.ctx.fillStyle = "black";
                        world.ctx.fillRect(sx+rsize,sy+rsize,tsize-rsize*2,rsize*3);
                        world.ctx.fillRect(sx+rsize,sy+tsize-rsize*4,tsize-rsize*2,rsize*3);
                        world.ctx.fillStyle = "red";
                        world.ctx.fillRect(sx+rsize,sy+rsize,rsize,rsize*3);
                        world.ctx.fillStyle = "blue";
                        world.ctx.fillRect(sx+rsize*2,sy+rsize,rsize,rsize*3);
                        world.ctx.fillStyle = "green";
                        world.ctx.fillRect(sx+rsize*4,sy+rsize,rsize,rsize*3);
                        world.ctx.fillStyle = "purple";
                        world.ctx.fillRect(sx+rsize*5,sy+rsize*3,rsize*3,rsize);
                        world.ctx.fillRect(sx+rsize*2,sy+tsize-rsize*4,rsize,rsize*3);
                        world.ctx.fillStyle = "blue";
                        world.ctx.fillRect(sx+rsize*3,sy+tsize-rsize*4,rsize,rsize*3);
                        world.ctx.fillStyle = "orange";
                        world.ctx.fillRect(sx+rsize*4,sy+tsize-rsize*4,rsize,rsize*3);
                        world.ctx.fillStyle = "white";
                        world.ctx.fillRect(sx+rsize*7,sy+tsize-rsize*4,rsize,rsize*3);
                        world.ctx.fillStyle = "red";
                        world.ctx.fillRect(sx+rsize*8,sy+tsize-rsize*4,rsize,rsize*3);
                    }
                }
            }
        }
    }
}

const wplayer = {
    x: 0,
    y: 0,
    reset: function() {
        this.x = 0
        this.y = 0
    }
}

const inputs = {
    w: false,
    s: false,
    a: false,
    d: false,
    handle: function() {
        if (this.w) {
            wplayer.y -= 4;
        }
        if (this.s) {
            wplayer.y += 4;
        }
        if (this.a) {
            wplayer.x -= 4;
        }
        if (this.d) {
            wplayer.x += 4;
        }
    }
}

function winit() {
    if (!world.init) {
        world.start(400,200);
        maze.gen();
        document.addEventListener("keydown", function(event) {
            if (event.key == "w") {
                inputs.w = true;
            }
            if (event.key == "s") {
                inputs.s = true;
            }
            if (event.key == "a") {
                inputs.a = true;
            }
            if (event.key == "d") {
                inputs.d = true;
            }
        });
        document.addEventListener("keyup", function(event) {
            if (event.key == "w") {
                inputs.w = false;
            }
            if (event.key == "s") {
                inputs.s = false;
            }
            if (event.key == "a") {
                inputs.a = false;
            }
            if (event.key == "d") {
                inputs.d = false;
            }
        });
    }
}

function wtick() {
    world.clear();
    maze.draw(wplayer.x,wplayer.y,40);
    inputs.handle();
}

function wreset() {
    maze.gen();
    wplayer.reset();
}

function wstop() {
    if (world.init) {
        document.getElementById("world").removeChild(world.canvas);
        clearInterval(world.loop);
        wreset();
        world.init = false;
    }
}
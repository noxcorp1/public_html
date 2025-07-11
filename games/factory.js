const fac = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function() {
        if (!this.init) {
            fgrid.init(50,50,40);
            this.init = true;
            this.canvas.width = 800;
            this.canvas.height = 400;
            this.canvas.style = "background: black; border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("factory");
            place.appendChild(this.canvas);
            this.loop = setInterval(fac.tick,50);
        }
    },
    stop: function() {
        if (this.init) {
            document.getElementById("factory").removeChild(this.canvas);
            this.init = false;
            clearInterval(this.loop);
        }
    },
    reset: function() {
        fgrid.reset();
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    tick: function() {
        fac.clear();
        fgrid.render(0,0);
    }
}

const fgrid = {
    init: function(width, height,tsize) {
        this.width = width;
        this.height = height;
        this.ground = [];
        this.tsize = tsize;
        for (let x = 0; x < width; x++) {
            this.ground.push(new Array());
            for (let y = 0; y < height; y++) {
                this.ground[x][y] = "grass";
            }
        }
        this.genPatch(4,4,"coal",3);
        this.genPatch(8,7,"iron",2);
        this.genPatch(15,6,"copper",2);
    },
    reset: function() {
        this.ground = [];
        for (let x = 0; x < this.width; x++) {
            this.ground.push(new Array());
            for (let y = 0; y < this.height; y++) {
                this.ground[x][y] = "grass";
            }
        }
        this.genPatch(3,3,"coal",3);
        this.genPatch(8,7,"iron",2);
        this.genPatch(15,6,"copper",2);
    },
    genPatch(x,y,ore,size) {
        for (let tx = x-1; tx < x+2; tx++) {
            for (let ty = y-1; ty < y+2; ty++) {
                if (Math.random() > 0.2 && this.valCord(tx,ty)) {
                    this.setg(tx,ty,ore);
                }
            }
        }
        if (size > 1) {
            this.genPatch(x+Math.floor(Math.random()*3)-1,y+Math.floor(Math.random()*3)-1,ore,size-1);
        }
    },
    getg: function(x,y) {
        return this.ground[x][y];
    },
    setg: function(x,y,val) {
        this.ground[x][y] = val;
    },
    valCord: function(x,y) {
        return (x > -1 && x < this.width && y > -1 && y < this.height);
    },
    render: function(offx,offy) {
        for (let x = -1; x < Math.ceil(fac.canvas.width/this.tsize)+1; x++) {
            for(let y = -1; y < Math.ceil(fac.canvas.width/this.tsize)+1; y++) {
                const tx = x+Math.floor(offx/this.tsize);
                const ty = y+Math.floor(offy/this.tsize);
                const sx = x*this.tsize-offx;
                const sy = y*this.tsize-offy;
                if (this.valCord(tx,ty)) {
                    const tile = this.getg(x,y);
                    if (tile == "grass") {
                        fac.ctx.fillStyle = "green";
                    } else if (tile == "iron") {
                        fac.ctx.fillStyle = "white";
                    } else if (tile == "copper") {
                        fac.ctx.fillStyle = "orange";
                    } else if (tile == "coal") {
                        fac.ctx.fillStyle = "rgb(20,20,20)";
                    }
                    fac.ctx.strokeStyle = "black";
                    fac.ctx.lineWidth = 2;
                    fac.ctx.fillRect(sx,sy,this.tsize,this.tsize);
                    fac.ctx.strokeRect(sx,sy,this.tsize,this.tsize);
                }
            }
        }
    }
}

fitems = [];

class fBelt {
    constructor(x,y,dir) {
        this.x = x;
        this.y = y;
        this.dir = dir
    }
}

class fItem {
    constructor(tx,ty,item) {
        this.x = fgrid.tsize*tx;
        this.y = fgrid.tsize*ty;
        this.tx = x;
        this.ty = y;
        this.item = item;
        fitems.push(this);
    }
    render() {
        if (this.item == "coal") {
            fac.ctx.beginPath();
            fac.ctx.arc(0,0,this.tsize*0.8,0,2*Math.PI);
            fac.ctx.fillStyle = "rgb(20,20,20)";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fill();
            fac.ctx.stroke();
        }
        if (this.item == "iron") {
            fac.ctx.beginPath();
            fac.ctx.arc(0,0,this.tsize*0.8,0,2*Math.PI);
            fac.ctx.fillStyle = "white";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fill();
            fac.ctx.stroke();
        }
        if (this.item == "copper") {
            fac.ctx.beginPath();
            fac.ctx.arc(0,0,this.tsize*0.8,0,2*Math.PI);
            fac.ctx.fillStyle = "orange";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fill();
            fac.ctx.stroke();
        }
    }
    update() {
        if (x == tx && y == ty) {

        } else {
            if (tx > x) {
                this.x += 1;
            } else if (tx < x) {
                this.x -= 1;
            } else if (ty > y) {
                this.y += 1;
            } else if (ty < y) {
                this.y -= 1;
            }
        }
    }
}
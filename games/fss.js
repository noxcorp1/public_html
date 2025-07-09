fss = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function(width, height) {
        if (!this.init) {
            this.init = true;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style = "background: darkgrey; border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("fss");
            place.appendChild(this.canvas);
            this.loop = setInterval(stick,30);
        }
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

grid = {
    init: function(tsize) {
        this.tsize = tsize;
        this.width = Math.ceil(fss.canvas.width/tsize);
        this.height = Math.ceil(fss.canvas.height/tsize);
        this.map = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.map[x] = new Array(this.height);
            for (let y = 0; y < this.height; y++) {
                this.map[x][y] = new Empty();
            }
        }
    },
    get: function(x,y) {
        return this.map[x][y];
    },
    set: function(x,y,elm) {
        this.map[x][y] = elm
    },
    swap: function(x1,y1,x2,y2) {
        t1 = this.get(x1,y1);
        this.set(x1,y1,this.get(x2,y2));
        this.set(x2,y2,t1);
    },
    render: function() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                fss.ctx.fillStyle = this.get(x,y).color;
                fss.ctx.fillRect(x*this.tsize,fss.canvas.height-(y*this.tsize)-this.tsize,this.tsize,this.tsize);
            }
        }
    },
    update: function() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.get(x,y).active = true;
            }
        }
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.get(x,y).active) {
                    this.get(x,y).active = false;
                    if (y > 0 && this.get(x,y).type == "powder") {
                        if (this.get(x,y-1).dens > this.get(x,y).dens) {
                            this.swap(x,y,x,y-1);
                        } else if (x > 0 && this.get(x-1,y-1).dens > this.get(x,y).dens) {
                            this.swap(x,y,x-1,y-1);
                        } else if (x < this.width-1 && this.get(x+1,y-1).dens > this.get(x,y).dens) {
                            this.swap(x,y,x+1,y-1);
                        }
                    }
                }
            }
        }
    }
}

let sel = Sand;

function Empty() {
    this.type = "solid";
    this.dens = 10;
    this.color = "black";
}

function Sand() {
    this.type = "powder";
    this.dens = 1;
    this.color = "tan";
}

function Stone() {
    this.type = "solid";
    this.dens = 1;
    this.color = "grey";
}

function stick() {
    fss.clear();
    grid.render();
    grid.update();
}

function sinit() {
    fss.start(800,400);
    grid.init(20);
    stick();
    document.addEventListener("mousedown", function(event) {
        if (fss.init) {
            const rect = fss.canvas.getBoundingClientRect();
            const mx = Math.floor(event.clientX-rect.x);
            const my = Math.floor(event.clientY-rect.y);
            if (mx > -1 && mx < fss.canvas.width && my > -1 && my < fss.canvas.height) {
                grid.set(Math.floor(mx/grid.tsize),grid.height-Math.floor(my/grid.tsize)-1,new sel());
            }
        }
    });
    document.addEventListener("keydown", function(event) {
        if (event.key == "0") {
            sel = Empty;
        } else if (event.key == "1") {
            sel = Sand;
        } else if (event.key == "2") {
            sel = Stone;
        }
    });
}

function sstop() {
    if (fss.init) {
        document.getElementById("fss").removeChild(fss.canvas);
        fss.init = false;
        clearInterval(fss.loop);
    }
}
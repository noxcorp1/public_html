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
    clear: function() {
        for (let x = 0; x < this.width; x++) {
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
                        } else if (Math.floor(Math.random()*2) == 0) {
                            if (x > 0 && this.get(x-1,y-1).dens > this.get(x,y).dens) {
                                this.swap(x,y,x-1,y-1);
                            } else if (x < this.width-1 && this.get(x+1,y-1).dens > this.get(x,y).dens) {
                                this.swap(x,y,x+1,y-1);
                            }
                        } else {
                            if (x < this.width-1 && this.get(x+1,y-1).dens > this.get(x,y).dens) {
                                this.swap(x,y,x+1,y-1);
                            } else if (x > 0 && this.get(x-1,y-1).dens > this.get(x,y).dens) {
                                this.swap(x,y,x-1,y-1);
                            }
                        }
                    } else if (y > 0 && this.get(x,y).type == "liquid") {
                        if (this.get(x,y-1).dens > this.get(x,y).dens) {
                            this.swap(x,y,x,y-1);
                        } else {
                            if (Math.floor(Math.random()*2) == 0) {
                                if (x > 0 && this.get(x-1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x-1,y);
                                } else if (x < this.width-1 && this.get(x+1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x+1,y);
                                }
                            } else {
                                if (x < this.width-1 && this.get(x+1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x+1,y);
                                } else if (x > 0 && this.get(x-1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x-1,y);
                                }
                            }
                        }
                    } else if (y < this.height-1 && this.get(x,y).type == "gas") {
                        if (this.get(x,y+1).dens > this.get(x,y).dens) {
                            this.swap(x,y,x,y+1);
                        } else {
                            if (Math.floor(Math.random()*2) == 0) {
                                if (x > 0 && this.get(x-1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x-1,y);
                                } else if (x < this.width-1 && this.get(x+1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x+1,y);
                                }
                            } else {
                                if (x < this.width-1 && this.get(x+1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x+1,y);
                                } else if (x > 0 && this.get(x-1,y).dens > this.get(x,y).dens) {
                                    this.swap(x,y,x-1,y);
                                }
                            }
                        }
                    } else if (this.get(x,y).type == "fire") {
                        let r = Math.floor(Math.random()*55)+200;
                        let g = Math.floor(Math.random()*200)+0;
                        let b = 0;
                        this.get(x,y).color = "rgb("+r+", "+g+", "+b+")";
                        if (x > 0 && this.get(x-1,y).burn != -1 && Math.floor(Math.random()*this.get(x-1,y).burn) == 0) {
                            this.set(x-1,y,new Fire());
                        }
                        if (x < this.width-1 && this.get(x+1,y).burn != -1 && Math.floor(Math.random()*this.get(x+1,y).burn) == 0) {
                            this.set(x+1,y,new Fire());
                        }
                        if (y > 0 && this.get(x,y-1).burn != -1 && Math.floor(Math.random()*this.get(x,y-1).burn) == 0) {
                            this.set(x,y-1,new Fire());
                        }
                        if (y > 0 && this.get(x,y-1).burn != -1 && Math.floor(Math.random()*this.get(x,y-1).burn) == 0) {
                            this.set(x,y-1,new Fire());
                        }
                        if (Math.floor(Math.random()*100) == 0) {
                            this.set(x,y,new Ash());
                        }
                        if (y < this.height-1 && this.get(x,y+1) instanceof Empty && Math.floor(Math.random()*50) == 0) {
                            this.set(x,y+1,new Smoke());
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
    this.burn = -1;
    this.dens = 10;
    this.color = "black";
}

function Sand() {
    this.type = "powder";
    this.burn = -1;
    this.dens = 1;
    let shift = Math.floor(Math.random()*40)-10
    let r = 244+shift;
    let g = 164+shift;
    let b = 96+shift;
    this.color = "rgb("+r+", "+g+", "+b+")";
}

function Stone() {
    this.type = "solid";
    this.burn = -1;
    this.dens = 1;
    let shift = Math.floor(Math.random()*20)-10
    let r = 170+shift;
    let g = 170+shift;
    let b = 170+shift;
    this.color = "rgb("+r+", "+g+", "+b+")";
}

function Water() {
    this.type = "liquid";
    this.burn = -1;
    this.dens = 2;
    let shift = Math.floor(Math.random()*20)
    let r = shift;
    let g = shift;
    let b = 200+shift;
    this.color = "rgb("+r+", "+g+", "+b+")";
}

function Smoke() {
    this.type = "gas";
    this.burn = -1;
    this.dens = 5;
    let shift = Math.floor(Math.random()*20)-10
    let r = 120+shift;
    let g = 120+shift;
    let b = 120+shift;
    this.color = "rgb("+r+", "+g+", "+b+")";
}

function Fire() {
    this.type = "fire";
    this.burn = -1;
    this.dens = 10;
    let r = Math.floor(Math.random()*55)+200;
    let g = Math.floor(Math.random()*200)+0;
    let b = 0;
    this.color = "rgb("+r+", "+g+", "+b+")";
}

function Wood() {
    this.type = "solid";
    this.burn = 30;
    this.dens = 1;
    let shift = Math.floor(Math.random()*30)-20
    let r = 160+shift;
    let g = 70+shift;
    let b = 20+shift;
    this.color = "rgb("+r+", "+g+", "+b+")";
}

function Ash() {
    this.type = "powder";
    this.burn = -1;
    this.dens = 1;
    let shift = Math.floor(Math.random()*50)-20
    let r = 50+shift;
    let g = 50+shift;
    let b = 50+shift;
    this.color = "rgb("+r+", "+g+", "+b+")";
}
 
function stick() {
    fss.clear();
    grid.render();
    grid.update();
    if (fss.init && mdown) {
        if (mx > -1 && mx < fss.canvas.width && my > -1 && my < fss.canvas.height) {
            grid.set(Math.floor(mx/grid.tsize),grid.height-Math.floor(my/grid.tsize)-1,new sel());
        }
    }
}

let mdown = false;
let mx = 0;
let my = 0;

function sinit() {
    fss.start(800,400);
    grid.init(10);
    stick();
    document.addEventListener("mousedown", function(event) {
        mdown = true;
    });
    document.addEventListener("mouseup", function(event) {
        mdown = false;
    });
    document.addEventListener("mousemove", function(event) {
        const rect = fss.canvas.getBoundingClientRect();
        mx = Math.floor(event.clientX-rect.x);
        my = Math.floor(event.clientY-rect.y);
    });
    document.addEventListener("keydown", function(event) {
        if (event.key == "0") {
            sel = Empty;
        } else if (event.key == "1") {
            sel = Sand;
        } else if (event.key == "2") {
            sel = Stone;
        } else if (event.key == "3") {
            sel = Water;
        } else if (event.key == "4") {
            sel = Smoke;
        } else if (event.key == "5") {
            sel = Fire;
        } else if (event.key == "6") {
            sel = Wood;
        } else if (event.key == "7") {
            sel = Ash;
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

function sreset() {
    grid.clear();
}
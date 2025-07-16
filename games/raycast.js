rc = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function(width, height) {
        if (!this.init) {
            this.canvas.addEventListener("click", async function() {
                await rc.canvas.requestPointerLock();
            })
            this.init = true;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style = "background: rgb(200,200,200); border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("ray");
            place.appendChild(this.canvas);
            this.loop = setInterval(rtick,100);
        }
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,2,0,0,3,0,0,0,3,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,2,1,1,1,1,2,1,1],
    [1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,1,0,3,0,1],
    [1,0,3,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

swall = [
    ["grey","grey","grey","grey","dgrey","grey","grey","grey","grey"],
    ["grey","grey","grey","grey","dgrey","grey","grey","grey","grey"],
    ["grey","grey","grey","grey","dgrey","grey","grey","grey","grey"],
    ["grey","grey","grey","grey","dgrey","grey","grey","grey","grey"],
    ["dgrey","dgrey","dgrey","dgrey","dgrey","dgrey","dgrey","dgrey","dgrey"],
    ["grey","grey","grey","grey","grey","grey","grey","grey","dgrey"],
    ["grey","grey","grey","grey","grey","grey","grey","grey","dgrey"],
    ["grey","grey","grey","grey","grey","grey","grey","grey","dgrey"],
    ["grey","grey","grey","grey","grey","grey","grey","grey","dgrey"]
]
door = [
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","yellow","yellow","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"],
    ["brown","dbrown","brown","brown","dbrown","brown","brown","dbrown","brown"]
]
roof = [
    ["brown","brown","brown","brown","brown","brown","brown","dbrown","brown","brown"],
    ["brown","brown","brown","brown","brown","brown","brown","dbrown","brown","brown"],
    ["brown","brown","brown","brown","brown","brown","brown","dbrown","brown","brown"],
    ["brown","brown","brown","brown","brown","brown","brown","dbrown","brown","brown"],
    ["dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown"],
    ["brown","brown","brown","dbrown","brown","brown","brown","brown","brown","brown"],
    ["brown","brown","brown","dbrown","brown","brown","brown","brown","brown","brown"],
    ["brown","brown","brown","dbrown","brown","brown","brown","brown","brown","brown"],
    ["brown","brown","brown","dbrown","brown","brown","brown","brown","brown","brown"],
    ["dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown","dbrown"]
]

coin = [
    ["black","black","black","black","black"],
    ["black","yellow","yellow","yellow","black"],
    ["black","yellow","yellow","yellow","black"],
    ["black","yellow","yellow","yellow","black"],
    ["black","black","black","black","black"],
]

rcolors = new Map([
    ["grey",[170,170,170]],
    ["dgrey",[100,100,100]],
    ["black",[0,0,0]],
    ["brown",[117,77,50]],
    ["dbrown",[69,45,30]],
    ["yellow",[255,255,0]]
])

camera = {
    init: function(fov, size, speed) {
        this.fov = fov;
        this.size = size;
        this.speed = speed;
        this.yoff = 0
        this.x = 2.5;
        this.y = 2.5;
        this.r = 0;
        this.db = new Array(rc.canvas.width);
    },
    render: function() {
        x = 0;
        for (let a = this.r-Math.round(this.fov/2); a < this.r+Math.round(this.fov/2); a+=this.fov/rc.canvas.width) {
            const rayCX = Math.sin(radians(a))/this.size;
            const rayCY = Math.cos(radians(a))/this.size;
            let rayX = this.x;
            let rayY = this.y;
            let step = 0;
            let wt = swall;
            while (step < 100) {
                step++;
                rayX += rayCX;
                rayY += rayCY;
                if (map[Math.floor(rayX)][Math.floor(rayY)] == 1) {
                    break;
                } else if (map[Math.floor(rayX)][Math.floor(rayY)] == 2) {
                    wt = door;
                    break;
                }
            }
            let b = 0;
            if (step < 50) {
                //const l = 170*(1-step/100);
                //rc.ctx.fillStyle = "rgb("+l+","+l+","+l+")";
                step *= Math.cos(radians(a-this.r));
                this.db[x] = step;
                const h = this.size/step*400;
                const tx = (Math.floor(rayX*9)+Math.floor(rayY*9))%9;
                const ph = h/9;
                for (let ty = 0; ty < 9; ty++) {
                    const l = (1-step/(50+fti));
                    const r = rcolors.get(wt[ty][tx])[0]*l*ftcolor[0];
                    const g = rcolors.get(wt[ty][tx])[1]*l*ftcolor[1];
                    const b = rcolors.get(wt[ty][tx])[2]*l*ftcolor[2];
                    rc.ctx.fillStyle = "rgb("+r+","+g+","+b+")";
                    const y = Math.floor((rc.canvas.height+this.yoff-h)/2)+ty*ph;
                    rc.ctx.fillRect(x,y+this.yoff,1,ph+1);
                }
                b = Math.floor((rc.canvas.height+this.yoff-h)/2)
            } else {
                rc.ctx.fillStyle = "black";
                step *= Math.cos(radians(a-this.r));
                this.db[x] = step
                const h = this.size/step*400;
                rc.ctx.fillRect(x,Math.floor((rc.canvas.height+this.yoff-h)/2),1,h);
                b = Math.floor((rc.canvas.height+this.yoff-h)/2)
            }
            for (let y = 0; y < b; y += 2) {
                d = (200+this.yoff)/((200+this.yoff)-y)*this.size;
                d /= this.size;
                d /= Math.cos(radians(a-this.r));
                const fx = Math.sin(radians(a))*d+this.x;
                const fy = Math.cos(radians(a))*d+this.y;
                const l = (1-d/(5+fti/10));
                const tx = Math.floor(fx*10)%10;
                const ty = Math.floor(fy*10)%10;
                const r = rcolors.get(roof[tx][ty])[0]*l*ftcolor[0];
                const g = rcolors.get(roof[tx][ty])[1]*l*ftcolor[1];
                const b = rcolors.get(roof[tx][ty])[2]*l*ftcolor[2];
                rc.ctx.fillStyle = "rgb("+r+","+g+","+b+")";
                rc.ctx.fillRect(x,y+this.yoff,1,4);
                rc.ctx.fillRect(x,(rc.canvas.height+this.yoff)-y-4,1,4)
            }
            x++;
        }
    }
}

function radians(a) {
    return a*(Math.PI/180);
}

function degrees(a) {
    return a*(180/Math.PI);
}

const rinputs = {
    w: false,
    s: false,
    a: false,
    d: false,
    la: false,
    ra: false,
    handle: function() {
        const cx = Math.sin(radians(camera.r))/camera.size*camera.speed;
        const cy = Math.cos(radians(camera.r))/camera.size*camera.speed;
        if (this.w) {
            camera.x += cx;
            camera.y += cy;
        }
        if (this.s) {
            camera.x -= cx;
            camera.y -= cy;
        }
        if (this.d) {
            camera.x += cy*0.5;
            camera.y -= cx*0.5;
        }
        if (this.a) {
            camera.x -= cy*0.5;
            camera.y += cx*0.5;
        }
        if (this.la) {
            camera.r -= 5;
        }
        if (this.ra) {
            camera.r += 5;
        }
    }
}

function rinit() {
    rc.start(800,400);
    camera.init(60,10,2);
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            if (map[x][y] == 3) {
                map[x][y] = 0;
                new fSprite(x,y,coin);
            }
        }
    }
    document.addEventListener("mousemove", function(e) {
        if (document.pointerLockElement == rc.canvas) {
            camera.r += e.movementX/5;
            //camera.yoff = Math.max(-20,Math.min(20,camera.yoff+e.movementY/5))
        }
    });
    document.addEventListener("keydown", function(event) {
        if (event.key == "w") {
            rinputs.w = true;
        }
        if (event.key == "s") {
            rinputs.s = true;
        }
        if (event.key == "a") {
            rinputs.a = true;
        }
        if (event.key == "d") {
            rinputs.d = true;
        }
        if (event.key == "ArrowLeft") {
            rinputs.la = true;
        }
        if (event.key == "ArrowRight") {
            rinputs.ra = true;
        }
        if (event.key == "e") {
            const rayCX = Math.sin(radians(camera.r))/camera.size;
            const rayCY = Math.cos(radians(camera.r))/camera.size;
            let rayX = camera.x;
            let rayY = camera.y;
            let step = 0;
            while (step < camera.size*2) {
                step++;
                rayX += rayCX;
                rayY += rayCY;
                if (map[Math.floor(rayX)][Math.floor(rayY)] == 2) {
                    map[Math.floor(rayX)][Math.floor(rayY)] = 0;
                    break;
                }
            }
        }
    });
    document.addEventListener("keyup", function(event) {
        if (event.key == "w") {
            rinputs.w = false;
        }
        if (event.key == "s") {
            rinputs.s = false;
        }
        if (event.key == "a") {
            rinputs.a = false;
        }
        if (event.key == "d") {
            rinputs.d = false;
        }
        if (event.key == "ArrowLeft") {
            rinputs.la = false;
        }
        if (event.key == "ArrowRight") {
            rinputs.ra = false;
        }
    });
}

function rstop() {
    if (rc.init) {
        document.getElementById("ray").removeChild(rc.canvas);
        rc.init = false;
        clearInterval(rc.loop);
    }
}

const ftorch = new Image();
ftorch.src = "textures/torch.png";
ftcolor = [1,0.65,0.6];
fti = 0
fsprites = []

function rtick() {
    rc.clear();
    camera.render();
    for (let i = 0; i < fsprites.length; i++) {
        fsprites[i].draw();
    }
    rc.ctx.drawImage(ftorch,450,150,350,350);
    rinputs.handle();
    fti = Math.max(-3,Math.min(3,fti+((Math.random()*2)-1)));
}

class fSprite {
    constructor(x,y,txtr) {
        this.x = x
        this.y = y
        this.txtr = txtr;
        fsprites.push(this);
    }
    draw() {
        const d = Math.sqrt((this.x-camera.x)**2+(this.y-camera.y)**2)*camera.size;
        const hwidth = this.txtr.length/d*200;
        const hheight = this.txtr[0].length/d*200;
        const ca = degrees(Math.atan2(this.x-camera.x,this.y-camera.y));
        //console.log(this.y-camera.y);
        let ra = ca-camera.r;
        if (ra < -180) {
            ra += 360;
        }
        if (ra > 180) {
            ra -= 360
        }
        const sx = Math.floor(rc.canvas.width/camera.fov*ra)+400;
        //rc.ctx.fillStyle = "red";
        //rc.ctx.fillRect(sx-1,20,3,360);
        const l = (1-d/(50+fti));
        for (let x = sx-hwidth; x < sx+hwidth; x++) {
            if (x > 0 && x < rc.canvas.width) {
                if (camera.db[Math.floor(x)] > d) {
                    for (let y = 200-hheight; y < 200+hheight; y++) {
                        const tx = Math.abs(Math.floor((x-(sx-hwidth))/(hwidth*2)*this.txtr.length)%this.txtr.length);
                        const ty = Math.abs(Math.floor((y-(200-hheight))/(hheight*2)*this.txtr[0].length)%this.txtr[0].length);
                        const r = rcolors.get(this.txtr[tx][ty])[0]*l*ftcolor[0];
                        const b = rcolors.get(this.txtr[tx][ty])[2]*l*ftcolor[2];
                        const g = rcolors.get(this.txtr[tx][ty])[1]*l*ftcolor[1];
                        rc.ctx.fillStyle = "rgb("+r+","+g+","+b+")";
                        rc.ctx.fillRect(x,y,1,1);
                    }
                }
            }
        }
    }
}
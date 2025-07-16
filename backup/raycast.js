rc = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function(width, height) {
        if (!this.init) {
            this.init = true;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style = "background: rgb(200,200,200); border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("ray");
            place.appendChild(this.canvas);
            this.loop = setInterval(rtick,50);
        }
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
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

rcolors = new Map([
    ["grey",[170,170,170]],
    ["dgrey",[100,100,100]],
    ["black",[0,0,0]]
])

camera = {
    x: 7,
    y: 7,
    r: 0,
    init: function(fov, size, speed) {
        this.fov = fov;
        this.size = size;
        this.speed = speed;
    },
    render: function() {
        x = 0
        for (let a = this.r-Math.round(this.fov/2); a < this.r+Math.round(this.fov/2); a+=this.fov/rc.canvas.width) {
            const rayCX = Math.sin(radians(a))/this.size;
            const rayCY = Math.cos(radians(a))/this.size;
            let rayX = this.x;
            let rayY = this.y;
            let step = 0;
            while (step < 100) {
                step++;
                rayX += rayCX;
                rayY += rayCY;
                if (map[Math.floor(rayX)][Math.floor(rayY)] == 1) {
                    break;
                }
            }
            if (step < 100) {
                //const l = 170*(1-step/100);
                //rc.ctx.fillStyle = "rgb("+l+","+l+","+l+")";
                step *= Math.cos(radians(a-this.r));
                const h = this.size/step*700;
                const tx = (Math.floor(rayX*9)+Math.floor(rayY*9))%9;
                const ph = h/9;
                for (let ty = 0; ty < 9; ty++) {
                    const l = (1-step/100);
                    const r = rcolors.get(swall[ty][tx])[0]*l;
                    const g = rcolors.get(swall[ty][tx])[1]*l;
                    const b = rcolors.get(swall[ty][tx])[2]*l;
                    rc.ctx.fillStyle = "rgb("+r+","+g+","+b+")";
                    const y = Math.floor((rc.canvas.height-h)/2)+ty*ph;
                    rc.ctx.fillRect(x,y,1,ph+1);
                }
            } else {
                rc.ctx.fillStyle = "black";
                step *= Math.cos(radians(a-this.r));
                const h = this.size/step*700;
                rc.ctx.fillRect(x,Math.floor((rc.canvas.height-h)/2),1,h);
            }
            x++;
        }
    }
}

function radians(a) {
    return a*(Math.PI/180);
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
            camera.x += cy;
            camera.y -= cx;
        }
        if (this.a) {
            camera.x -= cy;
            camera.y += cx;
        }
        if (this.la) {
            camera.r -= 2;
        }
        if (this.ra) {
            camera.r += 2;
        }
    }
}

function rinit() {
    rc.start(800,400);
    camera.init(60,10,2);
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

function rtick() {
    rc.clear();
    camera.render();
    rinputs.handle();
}
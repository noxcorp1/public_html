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
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
]

camera = {
    x: 3,
    y: 3,
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
                const l = 170*(1-step/100);
                rc.ctx.fillStyle = "rgb("+l+","+l+","+l+")";
            } else {
                rc.ctx.fillStyle = "black";
            }
            step *= Math.cos(radians(a-this.r));
            const h = Math.floor((1-step/100)*rc.canvas.height);
            rc.ctx.fillRect(x,Math.floor((rc.canvas.height-h)/2),1,h);
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
        if (this.a) {
            camera.r -= 2;
        }
        if (this.d) {
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
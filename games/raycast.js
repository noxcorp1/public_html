rc = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function(width, height) {
        if (!this.init) {
            this.init = true;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style = "background: white; border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("ray");
            place.appendChild(this.canvas);
            //this.loop = setInterval(stick,30);
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
    x: 2,
    y: 2,
    r: 0,
    init: function(fov, size) {
        this.fov = fov
        this.size = size
    },
    render: function() {
        x = 0
        for (let a = this.r-Math.round(this.fov/2); a < this.r+Math.round(this.fov/2); a+=this.fov/rc.canvas.width) {
            const rayCX = Math.sin(radians(a))/this.size;
            const rayCY = Math.cos(radians(a))/this.size;
            let rayX = this.x;
            let rayY = this.y;
            step = 0;
            while (step < 100) {
                step++;
                rayX += rayCX;
                rayY += rayCY;
                if (map[Math.floor(rayX)][Math.floor(rayY)] == 1) {
                    break;
                }
            }
            if (step < 100) {
                rc.ctx.setStyle = "grey";
            } else {
                rc.ctx.setStyle = "black";
            }
            
            x++;
        }
    }
}

function radians(a) {
    return a*(Math.PI/180);
}

function rinit() {
    rc.start(800,400);
    camera.init(60,10)
}

function rstop() {
    if (rc.init) {
        document.getElementById("ray").removeChild(rc.canvas);
        rc.init = false;
        //clearInterval(fss.loop);
    }
}
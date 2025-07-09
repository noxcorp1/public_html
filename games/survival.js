surv = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function(width, height) {
        if (!this.init) {
            this.init = true;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style = "background: black; border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("survival");
            place.appendChild(this.canvas);
        }
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

function sinit() {
    surv.start(800,400);
}

function sstop() {
    if (surv.init) {
        document.getElementById("survival").removeChild(surv.canvas);
        surv.init = false;
    }
}
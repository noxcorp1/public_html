farm = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function() {
        if (!this.init) {
            this.init = true;
            this.canvas.width = 800;
            this.canvas.height = 400;
            this.canvas.style = "background: darkgreen; border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("farm");
            place.appendChild(this.canvas);
            //this.loop = setInterval(rtick,50);
        }
    },
    stop: function() {
        if (this.init) {
            document.getElementById("farm").removeChild(this.canvas);
            this.init = false;
            //clearInterval(this.loop);
        }
    },
    clear: function() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}
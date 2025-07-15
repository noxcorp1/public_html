const fac = {
    canvas: document.createElement("canvas"),
    init: false,
    start: function () {
        if (!this.init) {
            fitems = [];
            fgrid.init(50, 50, 40);
            this.init = true;
            this.canvas.width = 800;
            this.canvas.height = 400;
            this.canvas.style = "background: black; border: 1px outset white;";
            this.ctx = this.canvas.getContext("2d");
            const place = document.getElementById("factory");
            place.appendChild(this.canvas);
            this.loop = setInterval(fac.tick, 50);
            document.addEventListener("keydown", function (event) {
                if (event.key == "w") {
                    finput.w = true;
                }
                if (event.key == "s") {
                    finput.s = true;
                }
                if (event.key == "a") {
                    finput.a = true;
                }
                if (event.key == "d") {
                    finput.d = true;
                }
                if (event.key == "r") {
                    fdir += 1;
                    fdir %= 4;
                }
                if (event.key == "q") {
                    fsel = "select";
                }
            });
            document.addEventListener("keyup", function (event) {
                if (event.key == "w") {
                    finput.w = false;
                }
                if (event.key == "s") {
                    finput.s = false;
                }
                if (event.key == "a") {
                    finput.a = false;
                }
                if (event.key == "d") {
                    finput.d = false;
                }
            });
            document.addEventListener("mousedown", function (event) {
                finput.click = true;
            });
            document.addEventListener("mouseup", function (event) {
                finput.click = false;
            });
            document.addEventListener("mousemove", function (event) {
                const rect = fac.canvas.getBoundingClientRect();
                finput.mx = Math.floor(event.clientX - rect.x);
                finput.my = Math.floor(event.clientY - rect.y);
            });
        }
    },
    stop: function () {
        if (this.init) {
            document.getElementById("factory").removeChild(this.canvas);
            this.init = false;
            clearInterval(this.loop);
        }
    },
    reset: function () {
        fitems = [];
        fgrid.reset();
        fui = [];
    },
    clear: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    tick: function () {
        fac.clear();
        fgrid.render(fplayer.x, fplayer.y);
        fgrid.update();
        finput.handle();
        finv.render();
        for (let i = 0; i < fui.length; i++) {
            fui[i].render();
        }
    }
}

const fgrid = {
    init: function (width, height, tsize) {
        this.width = width;
        this.height = height;
        this.ground = [];
        this.machines = [];
        this.tsize = tsize;
        for (let x = 0; x < width; x++) {
            this.ground.push(new Array());
            this.machines.push(new Array());
            for (let y = 0; y < height; y++) {
                this.ground[x][y] = "grass";
                this.machines[x][y] = null;
            }
        }
        this.genPatch(4, 4, "coal", 3);
        this.genPatch(8, 7, "iron", 2);
        this.genPatch(15, 6, "copper", 2);
    },
    reset: function () {
        this.ground = [];
        for (let x = 0; x < this.width; x++) {
            this.ground.push(new Array());
            this.machines.push(new Array());
            for (let y = 0; y < this.height; y++) {
                this.ground[x][y] = "grass";
                this.machines[x][y] = null;
            }
        }
        this.genPatch(3, 3, "coal", 3);
        this.genPatch(8, 7, "iron", 2);
        this.genPatch(15, 6, "copper", 2);
    },
    genPatch(x, y, ore, size) {
        for (let tx = x - 1; tx < x + 2; tx++) {
            for (let ty = y - 1; ty < y + 2; ty++) {
                if (Math.random() > 0.2 && this.valCord(tx, ty)) {
                    this.setg(tx, ty, ore);
                }
            }
        }
        if (size > 1) {
            this.genPatch(x + Math.floor(Math.random() * 3) - 1, y + Math.floor(Math.random() * 3) - 1, ore, size - 1);
        }
    },
    getg: function (x, y) {
        return this.ground[x][y];
    },
    setg: function (x, y, val) {
        this.ground[x][y] = val;
    },
    getm: function (x, y) {
        return this.machines[x][y];
    },
    setm: function (x, y, val) {
        this.machines[x][y] = val;
    },
    valCord: function (x, y) {
        return (x > -1 && x < this.width && y > -1 && y < this.height);
    },
    render: function (offx, offy) {
        for (let x = -1; x < Math.ceil(fac.canvas.width / this.tsize) + 1; x++) {
            for (let y = -1; y < Math.ceil(fac.canvas.width / this.tsize) + 1; y++) {
                const tx = x + Math.floor(offx / this.tsize);
                const ty = y + Math.floor(offy / this.tsize);
                const sx = tx * this.tsize - offx;
                const sy = ty * this.tsize - offy;
                if (this.valCord(tx, ty)) {
                    const tile = this.getg(tx, ty);
                    if (tile == "grass") {
                        fac.ctx.fillStyle = "green";
                    } else if (tile == "iron") {
                        fac.ctx.fillStyle = colors.iron;
                    } else if (tile == "copper") {
                        fac.ctx.fillStyle = "orange";
                    } else if (tile == "coal") {
                        fac.ctx.fillStyle = "rgb(20,20,20)";
                    }
                    fac.ctx.fillRect(sx, sy, this.tsize, this.tsize);
                    const mach = this.getm(tx, ty);
                    if (mach instanceof fMachine) {
                        fac.ctx.translate(sx, sy);
                        fac.ctx.scale(this.tsize / 10, this.tsize / 10);
                        mach.render();
                        fac.ctx.resetTransform();
                    }
                    fac.ctx.strokeStyle = "black";
                    fac.ctx.lineWidth = 2;
                    fac.ctx.strokeRect(sx, sy, this.tsize, this.tsize);
                    for (let i = 0; i < fitems.length; i++) {
                        fitems[i].render(offx, offy);
                    }
                }
            }
        }
    },
    update: function () {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                mach = this.getm(x, y);
                if (mach instanceof fMachine) {
                    mach.update();
                }
            }
        }
        for (let i = 0; i < fitems.length; i++) {
            fitems[i].update();
        }
    }
}

const colors = {
    iron: "rgb(227, 190, 175)"
}

const fplayer = {
    x: 0,
    y: 0
}

const finput = {
    w: false,
    s: false,
    a: false,
    d: false,
    click: false,
    mx: 0,
    my: 0,
    uiclick: false,
    handle: function () {
        if (this.w) {
            fplayer.y -= 4;
        }
        if (this.s) {
            fplayer.y += 4;
        }
        if (this.a) {
            fplayer.x -= 4;
        }
        if (this.d) {
            fplayer.x += 4;
        }
        if (this.click) {
            this.uiclick = false;
            finv.click();
            for (let i = 0; i < fui.length; i++) {
                fui[i].click();
            }
            if (this.uiclick) {
                this.click = false;
            }
        }
        const tx = Math.floor((this.mx + fplayer.x) / fgrid.tsize);
        const ty = Math.floor((this.my + fplayer.y) / fgrid.tsize);
        if (fsel == "belt") {
            if (this.click) {
                fgrid.setm(tx, ty, new fBelt(tx, ty, fdir));
            }
            fac.ctx.translate(tx * fgrid.tsize - fplayer.x, ty * fgrid.tsize - fplayer.y);
            fac.ctx.scale(fgrid.tsize / 10, fgrid.tsize / 10);
            new fBelt(0, 0, fdir).render();
            fac.ctx.resetTransform();
        } else if (fsel == "miner") {
            if (this.click) {
                fgrid.setm(tx, ty, new fMiner(tx, ty, fdir));
            }
            fac.ctx.translate(tx * fgrid.tsize - fplayer.x, ty * fgrid.tsize - fplayer.y);
            fac.ctx.scale(fgrid.tsize / 10, fgrid.tsize / 10);
            new fMiner(0, 0, fdir).render();
            fac.ctx.resetTransform();
        } else if (fsel == "smelter") {
            if (this.click) {
                fgrid.setm(tx, ty, new fSmelter(tx, ty, fdir));
            }
            fac.ctx.translate(tx * fgrid.tsize - fplayer.x, ty * fgrid.tsize - fplayer.y);
            fac.ctx.scale(fgrid.tsize / 10, fgrid.tsize / 10);
            new fSmelter(0, 0, fdir).render();
            fac.ctx.resetTransform();
        } else if (fsel == "inserter") {
            if (this.click) {
                fgrid.setm(tx, ty, new fInserter(tx, ty, fdir));
            }
            fac.ctx.translate(tx * fgrid.tsize - fplayer.x, ty * fgrid.tsize - fplayer.y);
            fac.ctx.scale(fgrid.tsize / 10, fgrid.tsize / 10);
            new fInserter(0, 0, fdir).render();
            fac.ctx.resetTransform();
        } else if (fsel == "crafter") {
            if (this.click) {
                fgrid.setm(tx, ty, new fCrafter(tx, ty, fdir));
            }
            fac.ctx.translate(tx * fgrid.tsize - fplayer.x, ty * fgrid.tsize - fplayer.y);
            fac.ctx.scale(fgrid.tsize / 10, fgrid.tsize / 10);
            new fCrafter(0, 0, fdir).render();
            fac.ctx.resetTransform();
        } else if (fsel == "select") {
            if (this.click && fgrid.getm(tx,ty) instanceof fCrafter) {
                new fRecelect(tx*fgrid.tsize,ty*fgrid.tsize,fgrid.getm(tx,ty));
                this.click = false;
            }
        }
    }
}

let fsel = "select";
let fdir = 0

let fitems = [];

class fMachine {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
    }
    render() {

    }
    update() {

    }
}

class fBelt extends fMachine {
    render() {
        fac.ctx.fillStyle = "rgb(70,70,70)";
        fac.ctx.fillRect(0, 0, 10, 10);
        fac.ctx.fillStyle = "red";
        if (this.dir == 0) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(5, 6);
            fac.ctx.lineTo(7, 4);
            fac.ctx.lineTo(3, 4);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 2, 10);
            fac.ctx.fillRect(8, 0, 2, 10)
        } else if (this.dir == 1) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(5, 4);
            fac.ctx.lineTo(7, 6);
            fac.ctx.lineTo(3, 6);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 2, 10);
            fac.ctx.fillRect(8, 0, 2, 10)
        } else if (this.dir == 2) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(6, 5);
            fac.ctx.lineTo(4, 7);
            fac.ctx.lineTo(4, 3);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 10, 2);
            fac.ctx.fillRect(0, 8, 10, 2)
        } else if (this.dir == 3) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(4, 5);
            fac.ctx.lineTo(6, 7);
            fac.ctx.lineTo(6, 3);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 10, 2);
            fac.ctx.fillRect(0, 8, 10, 2)
        }
    }
}

class fMiner extends fMachine {
    constructor(x, y, dir) {
        super(x, y, dir);
        this.tick = 0;
    }
    render() {
        fac.ctx.fillStyle = "grey";
        fac.ctx.fillRect(0, 0, 10, 10);
        fac.ctx.strokeStyle = "black";
        fac.ctx.fillStyle = "rgb(60,60,60)";
        fac.ctx.lineWidth = 0.5;
        fac.ctx.beginPath();
        fac.ctx.arc(5, 5, 3, 0, 2 * Math.PI);
        fac.ctx.fill();
        fac.ctx.stroke();
        fac.ctx.beginPath();
        fac.ctx.arc(5, 5, 2, 0, 2 * Math.PI);
        fac.ctx.stroke();
        fac.ctx.beginPath();
        fac.ctx.arc(5, 5, 1, 0, 2 * Math.PI);
        fac.ctx.stroke();
        fac.ctx.fillStyle = "red";
        if (this.dir == 0) {
            fac.ctx.fillRect(3, 9, 4, 1);
        } else if (this.dir == 1) {
            fac.ctx.fillRect(3, 0, 4, 1);
        } else if (this.dir == 2) {
            fac.ctx.fillRect(9, 3, 1, 4);
        } else if (this.dir == 3) {
            fac.ctx.fillRect(0, 3, 1, 4);
        }
    }
    update() { //BUG: should probably check if item is on belt currently
        this.tick += 1;
        if (this.tick > 80) {
            let tx = this.x * fgrid.tsize;
            let ty = this.y * fgrid.tsize;
            switch (this.dir) {
                case 0:
                    ty += fgrid.tsize;
                    break;
                case 1:
                    ty -= fgrid.tsize;
                    break;
                case 2:
                    tx += fgrid.tsize;
                    break;
                case 3:
                    tx -= fgrid.tsize;
                    break;
            }
            for (let i = 0; i < fitems.length; i++) {
                if (fitems[i].tx == tx && fitems[i].ty == ty) {
                    return;
                }
            }
            this.tick = 0;
            const tile = fgrid.getg(this.x, this.y);
            if (tile != "grass") {
                new fItem(tx / fgrid.tsize, ty / fgrid.tsize, tile + "_ore");
            }
        }
    }
}

class fInserter extends fMachine {
    render() {
        fac.ctx.fillStyle = "grey";
        fac.ctx.fillRect(0, 0, 10, 10);
        fac.ctx.fillStyle = "black";
        if (this.dir == 0) {
            fac.ctx.fillRect(3, 0, 4, 3);
        } else if (this.dir == 1) {
            fac.ctx.fillRect(3, 7, 4, 3);
        } else if (this.dir == 2) {
            fac.ctx.fillRect(0, 3, 3, 4);
        } else if (this.dir == 3) {
            fac.ctx.fillRect(7, 3, 3, 4);
        }
        fac.ctx.fillStyle = "red";
        if (this.dir == 0) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(5, 6);
            fac.ctx.lineTo(7, 4);
            fac.ctx.lineTo(3, 4);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 2, 10);
            fac.ctx.fillRect(8, 0, 2, 10)
        } else if (this.dir == 1) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(5, 4);
            fac.ctx.lineTo(7, 6);
            fac.ctx.lineTo(3, 6);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 2, 10);
            fac.ctx.fillRect(8, 0, 2, 10)
        } else if (this.dir == 2) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(6, 5);
            fac.ctx.lineTo(4, 7);
            fac.ctx.lineTo(4, 3);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 10, 2);
            fac.ctx.fillRect(0, 8, 10, 2)
        } else if (this.dir == 3) {
            fac.ctx.beginPath();
            fac.ctx.moveTo(4, 5);
            fac.ctx.lineTo(6, 7);
            fac.ctx.lineTo(6, 3);
            fac.ctx.fill();
            fac.ctx.fillStyle = "grey";
            fac.ctx.fillRect(0, 0, 10, 2);
            fac.ctx.fillRect(0, 8, 10, 2)
        }
    }
    update() {
        let ix = this.x * fgrid.tsize;
        let iy = this.y * fgrid.tsize;
        let ox = this.x;
        let oy = this.y;
        switch (this.dir) {
            case 0:
                iy -= fgrid.tsize;
                oy += 1;
                break;
            case 1:
                iy += fgrid.tsize;
                oy -= 1;
                break;
            case 2:
                ix -= fgrid.tsize;
                ox += 1;
                break;
            case 3:
                ix += fgrid.tsize;
                ox -= 1;
                break;
        }
        for (let i = 0; i < fitems.length; i++) {
            if (fitems[i].x == ix && fitems[i].y == iy) {
                const mach = fgrid.getm(ox, oy);
                if (mach instanceof fSmelter) {
                    if ((fitems[i].item == "copper_ore" || fitems[i].item == "iron_ore") && mach.input == null) {
                        mach.input = fitems.splice(i, 1)[0];
                    } else if (fitems[i].item == "coal_ore" && mach.fuel <= 5) {
                        mach.fuel += 1;
                        fitems.splice(i, 1)[0];
                    }
                } else if (mach instanceof fCrafter) {
                    if (mach.in1 == null) {
                        mach.in1 = fitems.splice(i, 1)[0];
                    } else if (mach.in2 == null && mach.in1.item != fitems[i].item) {
                        mach.in2 = fitems.splice(i, 1)[0];
                    }
                }
            }
        }
    }
}

class fSmelter extends fMachine {
    constructor(x, y, dir) {
        super(x, y, dir);
        this.tick = 0;
        this.input = null;
        this.fuel = 0;
    }
    render() {
        fac.ctx.fillStyle = "grey";
        fac.ctx.fillRect(0, 0, 10, 10);
        fac.ctx.fillStyle = "red";
        fac.ctx.fillRect(2, 2, 6, 2);
        fac.ctx.fillStyle = "orange";
        fac.ctx.fillRect(2, 4, 6, 2);
        fac.ctx.fillStyle = "yellow";
        fac.ctx.fillRect(2, 6, 6, 2);
        fac.ctx.fillStyle = "red";
        if (this.dir == 0) {
            fac.ctx.fillRect(3, 9, 4, 1);
        } else if (this.dir == 1) {
            fac.ctx.fillRect(3, 0, 4, 1);
        } else if (this.dir == 2) {
            fac.ctx.fillRect(9, 3, 1, 4);
        } else if (this.dir == 3) {
            fac.ctx.fillRect(0, 3, 1, 4);
        }
    }
    update() {
        this.tick += 1;
        if (this.input == null || this.fuel == 0) {
            this.tick = 0;
        }
        if (this.tick > 40) {
            let tx = this.x * fgrid.tsize;
            let ty = this.y * fgrid.tsize;
            switch (this.dir) {
                case 0:
                    ty += fgrid.tsize;
                    break;
                case 1:
                    ty -= fgrid.tsize;
                    break;
                case 2:
                    tx += fgrid.tsize;
                    break;
                case 3:
                    tx -= fgrid.tsize;
                    break;
            }
            for (let i = 0; i < fitems.length; i++) {
                if (fitems[i].tx == tx && fitems[i].ty == ty) {
                    return;
                }
            }
            this.tick = 0;
            if (this.input.item == "iron_ore") {
                new fItem(tx / fgrid.tsize, ty / fgrid.tsize, "iron_plate");
            } else if (this.input.item == "copper_ore") {
                new fItem(tx / fgrid.tsize, ty / fgrid.tsize, "copper_plate");
            }
            this.input = null;
            this.fuel -= 1;
        }
    }
}

class fCrafter extends fMachine {
    constructor(x, y, dir) {
        super(x, y, dir);
        this.tick = 0;
        this.in1 = null;
        this.in2 = null;
        this.recipe = "none";
    }
    render() {
        fac.ctx.fillStyle = "grey";
        fac.ctx.fillRect(0, 0, 10, 10);
        fac.ctx.fillStyle = "orange";
        fac.ctx.beginPath();
        fac.ctx.arc(3, 3, 2, 0, 2 * Math.PI);
        fac.ctx.fill();
        fac.ctx.beginPath();
        fac.ctx.arc(7, 7, 2, 0, 2 * Math.PI);
        fac.ctx.fill();
        fac.ctx.fillStyle = "red";
        if (this.dir == 0) {
            fac.ctx.fillRect(3, 9, 4, 1);
        } else if (this.dir == 1) {
            fac.ctx.fillRect(3, 0, 4, 1);
        } else if (this.dir == 2) {
            fac.ctx.fillRect(9, 3, 1, 4);
        } else if (this.dir == 3) {
            fac.ctx.fillRect(0, 3, 1, 4);
        }
    }
    update() {
        this.tick += 1;
        if (this.recipe == "none" || this.in1 == null) {
            this.tick = 0;
        }
        if (this.tick > 40) {
            if (this.recipe == "copper_wire" && !(this.in1.item == "copper_plate" && this.in2 == null)) {
                console.log(this.in1);
                console.log(this.in2);
                return;
            } else if (this.recipe == "circuit" && !((this.in1.item == "iron_plate" && this.in2.item == "copper_wire")||(this.in1.item == "copper_wire" && this.in2.item == "iron_plate"))) {
                return;
            }
            let tx = this.x * fgrid.tsize;
            let ty = this.y * fgrid.tsize;
            switch (this.dir) {
                case 0:
                    ty += fgrid.tsize;
                    break;
                case 1:
                    ty -= fgrid.tsize;
                    break;
                case 2:
                    tx += fgrid.tsize;
                    break;
                case 3:
                    tx -= fgrid.tsize;
                    break;
            }
            for (let i = 0; i < fitems.length; i++) {
                if (fitems[i].tx == tx && fitems[i].ty == ty) {
                    return;
                }
            }
            new fItem(tx / fgrid.tsize, ty / fgrid.tsize, this.recipe);
            this.tick = 0;
            this.in1 = null;
            this.in2 = null;
        }
    }
}

class fItem {
    constructor(x, y, item) {
        this.x = fgrid.tsize * x;
        this.y = fgrid.tsize * y;
        this.tx = this.x;
        this.ty = this.y;
        this.item = item;
        fitems.push(this);
    }
    render(offx, offy) {
        if (this.item == "coal_ore") {
            fac.ctx.beginPath();
            fac.ctx.arc(this.x + fgrid.tsize / 2 - offx, this.y + fgrid.tsize / 2 - offy, fgrid.tsize / 2 * 0.6, 0, 2 * Math.PI);
            fac.ctx.fillStyle = "rgb(20,20,20)";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fill();
            fac.ctx.stroke();
        } else if (this.item == "iron_ore") {
            fac.ctx.beginPath();
            fac.ctx.arc(this.x + fgrid.tsize / 2 - offx, this.y + fgrid.tsize / 2 - offy, fgrid.tsize / 2 * 0.6, 0, 2 * Math.PI);
            fac.ctx.fillStyle = colors.iron;
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fill();
            fac.ctx.stroke();
        } else if (this.item == "copper_ore") {
            fac.ctx.beginPath();
            fac.ctx.arc(this.x + fgrid.tsize / 2 - offx, this.y + fgrid.tsize / 2 - offy, fgrid.tsize / 2 * 0.6, 0, 2 * Math.PI);
            fac.ctx.fillStyle = "orange";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fill();
            fac.ctx.stroke();
        } else if (this.item == "iron_plate") {
            fac.ctx.fillStyle = "white";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fillRect(this.x + fgrid.tsize * 0.2 - offx, this.y + fgrid.tsize * 0.2 - offy, fgrid.tsize * 0.6, fgrid.tsize * 0.6);
            fac.ctx.strokeRect(this.x + fgrid.tsize * 0.2 - offx, this.y + fgrid.tsize * 0.2 - offy, fgrid.tsize * 0.6, fgrid.tsize * 0.6);
        } else if (this.item == "copper_plate") {
            fac.ctx.fillStyle = "orange";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fillRect(this.x + fgrid.tsize * 0.2 - offx, this.y + fgrid.tsize * 0.2 - offy, fgrid.tsize * 0.6, fgrid.tsize * 0.6);
            fac.ctx.strokeRect(this.x + fgrid.tsize * 0.2 - offx, this.y + fgrid.tsize * 0.2 - offy, fgrid.tsize * 0.6, fgrid.tsize * 0.6);;
        } else if (this.item == "copper_wire") {
            fac.ctx.beginPath();
            fac.ctx.arc(this.x + fgrid.tsize / 2 - offx, this.y + fgrid.tsize / 2 - offy, fgrid.tsize / 2 * 0.6, 0, 2 * Math.PI);
            fac.ctx.fillStyle = "orange";
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.fill();
            fac.ctx.stroke();
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 0.5;
            fac.ctx.beginPath();
            fac.ctx.arc(this.x + fgrid.tsize / 2 - offx, this.y + fgrid.tsize / 2 - offy, fgrid.tsize / 2 * 0.4, 0, 2 * Math.PI);
            fac.ctx.stroke();
            fac.ctx.beginPath();
            fac.ctx.arc(this.x + fgrid.tsize / 2 - offx, this.y + fgrid.tsize / 2 - offy, fgrid.tsize / 2 * 0.2, 0, 2 * Math.PI);
            fac.ctx.stroke();
        } else if (this.item == "circuit") {
            fac.ctx.translate(this.x-offx,this.y-offy);
            fac.ctx.scale(10/fgrid.tsize,10/fgrid.tsize);
            fac.ctx.fillStyle = "darkgreen";
            fac.ctx.fillRect(2,2,8,8);
            fac.ctx.strokeStyle = "orange";
            fac.ctx.lineWidth = 1;
            fac.ctx.beginPath();
            fac.ctx.moveTo(4,2);
            fac.ctx.lineTo(4,8);
            fac.ctx.stroke();
            fac.ctx.moveTo(2,3);
            fac.ctx.lineTo(8,3);
            fac.ctx.stroke();
            fac.ctx.lineWidth = 2;
            fac.ctx.strokeStyle = "black";
            fac.ctx.strokeRect(2,2,8,8);
            fac.ctx.resetTransform();
        }
    }
    update() {
        if (this.x == this.tx && this.y == this.ty) {
            if (fgrid.getm(Math.floor(this.x / fgrid.tsize), Math.floor(this.y / fgrid.tsize)) instanceof fBelt) {
                const belt = fgrid.getm(Math.floor(this.x / fgrid.tsize), Math.floor(this.y / fgrid.tsize))
                const otx = this.tx;
                const oty = this.ty;
                if (belt.dir == 0) {
                    this.ty += fgrid.tsize;
                } else if (belt.dir == 1) {
                    this.ty -= fgrid.tsize;
                } else if (belt.dir == 2) {
                    this.tx += fgrid.tsize;
                } else if (belt.dir == 3) {
                    this.tx -= fgrid.tsize;
                }
                if (!(fgrid.getm(this.tx / fgrid.tsize, this.ty / fgrid.tsize) instanceof fBelt)) {
                    this.tx = otx;
                    this.ty = oty;
                    return
                }
                for (let i = 0; i < fitems.length; i++) {
                    if (fitems[i] != this && this.tx == fitems[i].tx && this.ty == fitems[i].ty) {
                        this.tx = otx;
                        this.ty = oty;
                        return
                    }
                }
            }
        } else {
            if (this.tx > this.x) {
                this.x += 2;
            } else if (this.tx < this.x) {
                this.x -= 2;
            } else if (this.ty > this.y) {
                this.y += 2;
            } else if (this.ty < this.y) {
                this.y -= 2;
            }
        }
    }
}

class Inventory {
    constructor() {
        this.slots = [new Slot("belt"), new Slot("inserter"), new Slot("miner"), new Slot("smelter"), new Slot("crafter"), new Slot("none"), new Slot("none"), new Slot("none"), new Slot("none"), new Slot("none")]
    }
    render() {
        for (let i = 0; i < 10; i++) {
            fac.ctx.resetTransform();
            fac.ctx.translate(130 + i * 55, 350);
            this.slots[i].render();
            fac.ctx.resetTransform();
        }
    }
    click() {
        for (let i = 0; i < 10; i++) {
            this.slots[i].click(130 + i * 55, 350);
        }
    }
}

class Slot {
    constructor(item) {
        this.item = item;
    }
    render() {
        fac.ctx.fillStyle = "rgb(170,170,170)";
        fac.ctx.strokeStyle = "rgb(120,120,120)";
        fac.ctx.fillRect(0, 0, 45, 45);
        fac.ctx.strokeRect(0, 0, 45, 45);
        fac.ctx.translate(7.5, 7.5);
        if (this.item != "none") {
            fac.ctx.strokeStyle = "black";
            fac.ctx.lineWidth = 2;
            fac.ctx.strokeRect(0, 0, 30, 30);
        }
        fac.ctx.scale(3, 3);
        if (this.item == "belt") {
            new fBelt(0, 0, 0).render();
        } else if (this.item == "inserter") {
            new fInserter(0, 0, 0).render();
        } else if (this.item == "smelter") {
            new fSmelter(0, 0, 0).render();
        } else if (this.item == "crafter") {
            new fCrafter(0, 0, 0).render();
        } else if (this.item == "miner") {
            new fMiner(0, 0, 0).render();
        }
        fac.ctx.resetTransform();
    }
    click(x, y) {
        if (finput.mx - x > 0 && finput.mx - x < 45 && finput.my - y > 0 && finput.my - y < 45) {
            finput.uiclick = true;
            if (this.item != "none") {
                fsel = this.item;
            }
        }
    }
}

const finv = new Inventory();

class fRecelect {
    constructor(x,y,crafter) {
        this.x = x;
        this.y = y;
        this.crafter = crafter
        this.height = 100;
        fui.push(this);
    }
    render() {
        fac.ctx.fillStyle = "rgb(170,170,170)";
        fac.ctx.strokeStyle = "rgb(120,120,120)";
        fac.ctx.fillRect(this.x-fplayer.x,this.y-fplayer.y,100,this.height);
        fac.ctx.strokeRect(this.x-fplayer.x,this.y-fplayer.y,100,this.height);
        fac.ctx.translate(this.x-fplayer.x,this.y-fplayer.y);
        fac.ctx.strokeStyle = "black";
        fac.ctx.fillStyle = "red";
        fac.ctx.fillRect(83,3,14,14);
        fac.ctx.beginPath();
        fac.ctx.moveTo(85,5);
        fac.ctx.lineTo(95,15)
        fac.ctx.stroke();
        fac.ctx.moveTo(85,15);
        fac.ctx.lineTo(95,5)
        fac.ctx.stroke();
        fac.ctx.font = "10px Arial";
        fac.ctx.fillStyle = "black";
        fac.ctx.fillText("Recipie?",5,12);
        fac.ctx.strokeStyle = "black";
        fac.ctx.fillStyle = "orange";
        fac.ctx.fillRect(4,15,76,11);
        fac.ctx.strokeRect(4,15,76,11);
        fac.ctx.fillStyle = "black";
        fac.ctx.fillText("Copper Wire",5,24);
        fac.ctx.strokeStyle = "black";
        fac.ctx.fillStyle = "darkgreen";
        fac.ctx.fillRect(4,30,76,11);
        fac.ctx.strokeRect(4,30,76,11);
        fac.ctx.fillStyle = "black";
        fac.ctx.fillText("Circuit",5,39);
        fac.ctx.resetTransform();
    }
    click() {
        const rx = finput.mx - (this.x-fplayer.x);
        const ry = finput.my - (this.y-fplayer.y);
        if (rx > 0 && rx < 100 && ry > 0 && ry < this.height) {
            finput.uiclick = true;
            if (rx > 83 && rx < 97 && ry > 3 && ry < 17) {
                fui.splice(fui.indexOf(this),1);
            } else if (rx > 4 && rx < 80 && ry > 15 && ry < 26) {
                this.crafter.recipe = "copper_wire";
            } else if (rx > 4 && rx < 80 && ry > 30 && ry < 41) {
                this.crafter.recipe = "circuit";
            }
        }
    }
}

let fui = [];
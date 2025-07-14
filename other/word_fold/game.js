const boards = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
       
    },
    {
        cells: [
            ["B", "I", "G", "A", "P"],
            ["L", "O", "W", "I", "R"],
            ["L", "A", "B", "G", "I"],
            ["E", "N", "A", "P", "P"],
            ["Y", "N", "A", "I", "E"]],
        words: ["PIE", "YELLOWBANANA", "PAIR", "BIG", "PIG"]
       
    },
    {
        cells: [
            ["N", "K", "V", "I", "B"],
            ["I", "H", "T", "S", "O"],
            ["P", "G", "A", "U", "A"],
            ["L", "I", "L", "D", "R"],
            ["P", "H", "O", "N", "E"]],
        words: ["LIGHT", "PINK", "VISUAL", "PHONE", "BOARD"]
       
    },
]

function make_cell_list() {
    let cells = [...document.getElementById("cell-holder").children];
    let cell_board = [];
    for (let i = 0; i < 25; i += 5) {
        cell_board.push(cells.slice(i, i + 5))
    }
    return cell_board;
}

function setup_game(starting_cells) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = starting_cells[y][x];
        }
    }
}

const CELLS = make_cell_list()
let selected_x = -1;
let selected_y = -1;
let cboard = 0
let min = 0;
let sec = 0;
let mil = 0;
const tick = setInterval(inctime,1);

setup_game(boards[0].cells)
document.getElementById("words").innerHTML = "Words to spell: " + boards[0].words.join(", ")


function move(x, y) {
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[selected_y][selected_x].innerHTML = ""
    select(x, y);
}

function unselect(x, y) {
    CELLS[y][x].classList.remove("selected");
    selected_x = -1;
    selected_y = -1;
}

function select(x, y) {
    if (CELLS[y][x].innerHTML.length > 0) {
        if (selected_x >= 0 && selected_y >= 0)
            CELLS[selected_y][selected_x].classList.remove("selected");
        CELLS[y][x].classList.add("selected");
        selected_y = y;
        selected_x = x;
    }
}

function is_close(a, b) {
    return Math.abs(a - b) <= 1
}

function can_move(x, y) {
    let can_move = is_close(selected_x, x) && selected_y == y || is_close(selected_y, y) && selected_x == x;

    return selected_x >= 0 && selected_y >= 0 && can_move && CELLS[y][x].innerHTML.length > 0
}

function on_click(x, y) {
    winCheck(cboard);
    if (selected_x == x && selected_y == y) {
        unselect(x, y)
    }
    else if (can_move(x, y)) {
        move(x, y)
    } else {
        select(x, y)
    }
}

function winCheck(board) {
    const words = boards[board].words
    const found = [];
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (words.includes(CELLS[x][y].innerHTML)) {
                found.push(CELLS[x][y].innerHTML);
            }
        }
    }
    if (found.length == 5) {
        document.getElementById("win").innerHTML = "YOU WIN";
    }
}

function reset() {
    setup_game(boards[cboard].cells)
    document.getElementById("words").innerHTML = "Words to spell: " + boards[cboard].words.join(", ")
    mil = 0;
    sec = 0;
    min = 0;
}

function changeBoard(board) {
    cboard = board;
    reset();
}

function rboard() {
    cboard = Math.floor(Math.random()*boards.length);
    reset();
}
  
function inctime() {
    mil += 1;
    if (mil == 1000) {
        sec += 1;
        mil = 0;
        if (sec == 60) {
            sec = 0;
            min = 60;
    }
    }
    document.getElementById("timer").innerHTML = "TIMER: "+min+":"+sec+"."+mil;
}
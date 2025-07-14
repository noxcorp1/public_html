const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");

function updateScore(model) {
    scoreboard.innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

function draw_game(model) {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);
}

function draw_ball(ctx, ball) {
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(ball.posx,ball.posy,BALL_RADIUS,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function draw_paddle(ctx, paddle) {
    ctx.fillStyle = paddle.color;
    ctx.strokeStyle = "black";
    ctx.fillRect(paddle.posx,paddle.posy,PADDLE_WiDTH,PADDLE_HEIGHT);
    ctx.strokeRect(paddle.posx,paddle.posy,PADDLE_WiDTH,PADDLE_HEIGHT);
}
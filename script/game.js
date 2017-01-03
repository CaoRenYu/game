/**
 * Created by cry on 2016/11/26.
 */
//获取canvas画布
var canvas = document.getElementById("canvas");
var cxt = canvas.getContext("2d");
var w = canvas.offsetWidth;
var h = canvas.offsetHeight;

//设置关卡
var level;
if (parseInt(window.location.href.split("#")[1])){
    level = parseInt(window.location.href.split("#")[1]);
}else {
    level = 0;
}

//设置大球
var bigBallX = 300;//大球圆心x坐标
var bigBallY = 200;//大球圆心y坐标
var bigBallRadius = 50;//大球半径

var ballRadius = 10;//小球半径

//每个level的游戏配置--initNum：初始转动球数；waitNu：等待球数；speed：转动速度
var defaultOption = [
    {"initNum":3, "waitNum":5, "speed":10},
    {"initNum":4, "waitNum":8, "speed":11},
    {"initNum":5, "waitNum":5, "speed":8},
    {"initNum":3, "waitNum":5, "speed":4},
    {"initNum":4, "waitNum":8, "speed":5},
    {"initNum":5, "waitNum":5, "speed":4},
    {"initNum":6, "waitNum":7, "speed":4}
];

var option = option || defaultOption;
console.log(option);

//设置初始转动球
var initBalls = [];//存放转动球的数组
var initBallNum = option[level].initNum;//设置转动球数组长度
var distance = 130;//设置大球圆心与转动球圆心的距离
//设置转动球旋转角度
for (var i = 0; i < initBallNum; i++){
    var angle = (360 / initBallNum) * (i+1);
    initBalls.push({"angle":angle, "numText":"d"});
}

//设置等待球
var waitBalls = [];//存放等待球的数组
var waitBallNum = option[level].waitNum;//设置等待球数组长度
var waitOffsetTop = 260;//设置等待球距离上方的距离
var waitX = bigBallX;//等待球X轴坐标
var waitY = distance + waitOffsetTop;//设置等待球的Y轴坐标
//设置等待球数字文本
for (var i = waitBallNum; i > 0; i--){
    waitBalls.push({"angle":"", "numText":i})
}

//绘制中间大球的方法
function drawBigBall() {
    //绘制大球
    cxt.fillStyle = "#000";
    cxt.beginPath();
    cxt.arc(bigBallX, bigBallY, bigBallRadius, 0, Math.PI * 2);
    cxt.closePath();
    cxt.fill();
    //绘制大球文字
    if (level == option.length){
        level = option.length - 1;
    }
    var levelNum = (level + 1);
    cxt.textAlign = "center";
    cxt.textBaseline = "middle";
    cxt.font = "60px sans-serif";
    cxt.strokeStyle = "#eed5b7";
    cxt.fillStyle = "#eed5b7";
    cxt.fillText(levelNum, bigBallX, bigBallY + 2);
    cxt.strokeText(levelNum, bigBallX, bigBallY + 2);
}

//绘制转动球的方法
function drawInitBalls(deg) {
    //console.log(initBalls);
    //遍历转动球
    initBalls.forEach(function (o) {
        o.angle = o.angle + deg;
        if (o.angle >= 360){
            o.angle = 0;
        }
        var radian = o.angle * 2 * Math.PI / 360;//获取球针弧度
        var x = bigBallX + distance * Math.cos(radian);//小球x轴坐标
        var y = bigBallY + distance * Math.sin(radian);//小球y轴坐标
        cxt.globalCompositeOperation = "destination-over";//图形组合为新图在原图位置之下
        cxt.strokeStyle = "#000";
        cxt.fillStyle = "#000";
        //绘制球针
        cxt.beginPath();
        cxt.moveTo(bigBallX, bigBallY);
        cxt.lineTo(x, y);
        cxt.closePath();
        cxt.stroke();
        //绘制转动球
        cxt.beginPath();
        cxt.arc(x, y , ballRadius, 0, 2 * Math.PI);
        cxt.closePath();
        cxt.fill();
        //绘制小球文字
        if (o.numText != ""){
            cxt.globalCompositeOperation = "source-over";//新图在原图之上
            cxt.textAlign = "center";
            cxt.textBaseline = "middle";
            cxt.font = "14px sans-serif";
            cxt.strokeStyle = "#fff";
            cxt.fillStyle = "#fff";
            cxt.fillText(o.numText, x, y + 1);
            cxt.strokeText(o.numText, x, y + 1);
        }
    });
}

//绘制等待球的方法
function drawWaitBalls() {
    //console.log(waitBalls);
    cxt.clearRect(0, (bigBallY + distance + ballRadius), w, (h - bigBallY - distance - ballRadius));
    //遍历等待球
    waitBalls.forEach(function (o) {
        //绘制等待球
        cxt.fillStyle = "#000";
        cxt.beginPath();
        cxt.arc(waitX, waitY, ballRadius, 0, 2 * Math.PI);
        cxt.closePath();
        cxt.fill();
        cxt.globalCompositeOperation = "source-over";//新图在原图之上
        //绘制小球文字
        cxt.textAlign = "center";
        cxt.textBaseline = "middle";
        cxt.font = "14px sans-serif";
        cxt.strokeStyle = "#fff";
        cxt.fillStyle = "#fff";
        cxt.fillText(o.numText, waitX, waitY + 1);
        cxt.strokeText(o.numText, waitX, waitY + 1);
        //等待球间距
        waitY += 3 * ballRadius;
    });
}

//初始化方法
function init(deg) {
    //console.log(canvas.offsetWidth);
    cxt.clearRect(0, 0, w, h);
    drawBigBall();
    drawInitBalls(deg);
    drawWaitBalls();
}
init(0);

//设置旋转的速度
var runId = setInterval(function () {
    cxt.clearRect(0, 0, w, (bigBallY + distance + ballRadius));
    drawBigBall();
    drawInitBalls(1);
}, option[level].speed);

//点击插针
var state;
document.addEventListener('click', function () {
    if (waitBalls.length == 0) return;
    waitY = bigBallY + distance;
    //console.log(waitY);
    drawWaitBalls();
    //console.log(waitBalls);

    var moveBall = waitBalls.shift();//删除等待球数组第一个元素并返回值
    moveBall.angle = 90;
    var gameEnd = false;
    //条件判定
    initBalls.forEach(function (o, index) {
        //console.log(o.angle);
        if (gameEnd) return;
        var failDeg = Math.abs((o.angle - moveBall.angle) / 2 * 2 * Math.PI / 360);
        //失败或成功条件
        if (failDeg < Math.asin(ballRadius / distance)){//失败条件：两球夹角的一半小于distance与球切线角度
            console.log("失败");
            state = 0;
            gameEnd = true;
        }else if (index == initBalls.length - 1 && waitBalls.length == 0){//遍历完转动球并且等待球数组长度为0
            console.log("成功");
            gameEnd = true;
            state = 1;
        }
    });

    initBalls.push(moveBall);//添加移除的等待球到转动球数组中
    //重新绘制等待球
    waitY = waitOffsetTop + distance;
    drawWaitBalls();
    //
    if (state == 0){
        //取消动画
        clearInterval(runId);
        alert("闯关失败");
        window.location.href = "index.html#" + level;
    }else if (state == 1){
        //设置延时函数使最后一次球的针能出现
        drawInitBalls(0);
        alert("闯关成功");
        clearInterval(runId);
        level++;
        window.location.href = "index.html#"+level;
    }
});
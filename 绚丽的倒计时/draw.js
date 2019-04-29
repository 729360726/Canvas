let radius = 8,
    curTimeSeconds = 0, //当前时间戳 秒数
    magrinTop = 40,
    magrinLeft = 30,
    canvaWidth = 1200,
    canvaHeight = 768,
    balls = []


let endtime = new Date()
endtime.setTime(endtime.getTime() + 3600 * 1000)
const colors = ["#33b5e5", "#0099cc", "#aa66cc", "#99cc00", "gray", "pink"]

window.onload = function () {
    //屏幕自适应
    canvaWidth = document.documentElement.clientWidth
    canvaHeight = document.documentElement.clientHeight
    magrinLeft = Math.round(canvaWidth / 10)
    radius = Math.round(canvaWidth * 4 / 5 / 108) - 1
    magrinTop = Math.round(canvaHeight / 5)

    let canva = document.getElementById('canvas')
    context = canva.getContext('2d')
    canva.width = canvaWidth
    canva.height = canvaHeight
    curTimeSeconds = calcTime()
    setInterval(function () {
        show(context)
        update()
    }, 50)

}

function update() {
    let nextTimeSeconds = calcTime(),
        nexthour = parseInt(nextTimeSeconds / 3600),
        nextmin = parseInt((nextTimeSeconds - nexthour * 3600) / 60),
        nextsec = nextTimeSeconds % 60,
        curhour = parseInt(curTimeSeconds / 3600),
        curmin = parseInt((curTimeSeconds - curhour * 3600) / 60),
        cursec = curTimeSeconds % 60
    //如果秒数产生差值则进行刷新操作
    if (nextsec != cursec) {
        if (parseInt(nexthour % 100 / 10) != parseInt(curhour % 100 / 10)) {
            drawballs(magrinLeft, magrinTop, parseInt(curhour % 100 / 10))
        }
        if (parseInt(nexthour % 10) != parseInt(curhour % 10)) {
            drawballs(magrinLeft + 15 * (radius + 1), magrinTop, parseInt(curhour % 10))
        }
        if (parseInt(nextmin / 10) != parseInt(curmin / 10)) {
            drawballs(magrinLeft + 39 * (radius + 1), magrinTop, parseInt(curmin / 10))
        }
        if (parseInt(nextmin % 10) != parseInt(curmin % 10)) {
            drawballs(magrinLeft + 54 * (radius + 1), magrinTop, parseInt(curmin % 10))
        }
        if (parseInt(nextsec / 10) != parseInt(cursec / 10)) {
            drawballs(magrinLeft + 78 * (radius + 1), magrinTop, parseInt(cursec / 10))
        }
        if (parseInt(nextsec % 10) != parseInt(cursec % 10)) {
            drawballs(magrinLeft + 93 * (radius + 1), magrinTop, parseInt(cursec % 10))
        }
        curTimeSeconds = nextTimeSeconds
    }
    updateballs()
}

function updateballs() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx
        balls[i].y += balls[i].vy
        balls[i].vy += balls[i].g
        //碰撞检测
        if (balls[i].y >= canvaHeight - radius) {
            balls[i].y = canvaHeight - radius
            balls[i].vy = -balls[i].vy * .75
        }
        // if (balls[i].x >= canvaWidth - radius) {
        //     balls[i].x = canvaWidth - radius
        //     balls[i].vx = -balls[i].vx
        // }
    }
    //性能优化
    let count = 0
    for (let i = 0; i < balls.length; i++)
        if (balls[i].x + radius > 0 && balls[i].x - radius < canvaWidth)
            balls[count++] = balls[i]
    while (balls.length > Math.min(300, count)) {
        balls.pop()
    }
}

function calcTime() {
    let curDate = new Date()
    let ret = endtime.getTime() - curDate.getTime()
    ret = Math.round(ret / 1000) //毫秒转换成秒数
    return ret >= 0 ? ret : 0
}

function show(context) {
    context.clearRect(0, 0, canvaWidth, canvaHeight);
    let hour = parseInt(curTimeSeconds / 3600),
        min = parseInt((curTimeSeconds - hour * 3600) / 60),
        sec = curTimeSeconds % 60
    draw(magrinLeft, magrinTop, parseInt(hour % 100 / 10), context)
    draw(magrinLeft + 15 * (radius + 1), magrinTop, hour % 10, context)
    draw(magrinLeft + 30 * (radius + 1), magrinTop, 10, context)
    draw(magrinLeft + 39 * (radius + 1), magrinTop, parseInt(min / 10), context)
    draw(magrinLeft + 54 * (radius + 1), magrinTop, min % 10, context)
    draw(magrinLeft + 69 * (radius + 1), magrinTop, 10, context)
    draw(magrinLeft + 78 * (radius + 1), magrinTop, parseInt(sec / 10), context)
    draw(magrinLeft + 93 * (radius + 1), magrinTop, sec % 10, context)
    for (let i = 0; i < balls.length; i++) {
        context.fillStyle = balls[i].color
        context.beginPath()
        context.arc(balls[i].x, balls[i].y, radius, 0, Math.PI * 2);
        context.closePath()
        context.fill()
    }
}

function draw(x, y, key, context) {
    context.fillStyle = "rgb(0,102,153)"
    for (let i = 0; i < digit[key].length; i++)
        for (let j = 0; j < digit[key][i].length; j++) {
            if (digit[key][i][j]) {
                context.beginPath();
                context.arc(x + j * 2 * (radius + 1) + (radius + 1), y + i * 2 * (radius + 1) + (radius + 1), radius, 0, Math.PI * 2);
                context.closePath();
                context.fill();
            }
        }
}

function drawballs(x, y, key) {
    for (let i = 0; i < digit[key].length; i++)
        for (let j = 0; j < digit[key][i].length; j++) {
            if (digit[key][i][j]) {
                let ball = {
                    x: x + j * 2 * (radius + 1) + (radius + 1),
                    y: y + i * 2 * (radius + 1) + (radius + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -10,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(ball)
            }
        }
}
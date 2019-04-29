//封闭函数
(function (w) {
    //西班牙语Relogio 时钟
    //设置时钟类
    function Relogio(container) {
        this.container = container
        //初始化
        this.initialize()
    }
    //给类增加属性和方法
    Relogio.prototype.initialize = function () {
        this.clockData = {
            h: 0,
            m: 0,
            s: 0,
            ms: 0
        }
        //创建2D画布
        this.canvas = createCanvas(this.container)
        this.context = this.canvas.getContext('2d')
        this.size = this.canvas.width
        this.beginLoop()
    }

    function createCanvas(cont) {
        let size = Math.min(cont.offsetWidth, cont.offsetHeight),
            canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        cont.appendChild(canvas)
        return canvas
    }
    //给类增加属性和方法
    Relogio.prototype.beginLoop = function () {
        //传递Relogio的this
        loop.call(this)
    }

    function loop() {
        update.call(this)
        draw.call(this)
        //设置时间间隔
        requestAnimationFrame(loop.bind(this))
    }
    //时间更新
    function update() {
        var time = new Date()
        this.clockData.h = time.getHours()
        this.clockData.m = time.getMinutes()
        this.clockData.s = time.getSeconds()
        this.clockData.ms = time.getMilliseconds()
        this.clockData.h += (this.clockData.m / 60)
        this.clockData.m += (this.clockData.s / 60)
        this.clockData.s += (this.clockData.ms / 1000)
    }
    //绘制 时间点 和 时分秒针 
    function draw() {
        drawClock.call(this)
        drawPointers.call(this)
    }
    //角度转换弧度制
    function deg2rad(deg) {
        return deg * Math.PI / 180
    }

    function drawClock() {
        let context = this.context,
            size = this.size,
            sizeBlock = size * .05,
            center = size / 2
        //刷新
        context.clearRect(0, 0, size, size)

        context.strokeStyle = "black"
        context.shadowBlur = 2
        context.shadowColor = "black"
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.font = "14pt sans-serif"

        let position = {
            x: size / 2,
            y: sizeBlock
        }

        for (let i = 0; i < 60; i++) {
            let angle = i * 6
            context.save()
            //位移到圆心
            context.translate(center, center)
            //数字旋转6度 一共 60 * 6 = 360
            context.rotate(deg2rad(angle))
            //还原位移环境
            context.translate(-center, -center)
            //绘制1-12 非常棒的写法
            if (i % 5 == 0) {
                let reverseAngle = 360 - angle
                context.save()
                //保持数字的垂直显示 👍
                context.translate(position.x, position.y + sizeBlock / 5)
                //恢复之前旋转的角度
                context.rotate(deg2rad(reverseAngle))
                context.translate(-position.x, -(position.y + sizeBlock / 5))

                //西班牙语 hora时间
                //i==0时hora=12 其他 i = 1~11
                let hora = ((i / 5) || 12)
                context.beginPath()
                context.fillText(hora, position.x, position.y + sizeBlock / 5)
                context.closePath()
                context.restore()
            }
            context.beginPath()
            if (i % 5) {
                //绘制小短线
                context.moveTo(position.x, position.y)
                context.lineTo(position.x, position.y + sizeBlock / 2)
                context.stroke()
            }
            context.closePath()
            context.restore()
        }
    }

    function rotate(point, deg, center) {
        let ang = deg2rad(deg)
        point = {
            x: point.x - center.x,
            y: point.y - center.y
        }
        let rotatedPoint = {
            x: (point.x * Math.cos(ang)) - (point.y * Math.sin(ang)) + center.x,
            y: (point.x * Math.sin(ang)) + (point.y * Math.cos(ang)) + center.y,
        }
        return rotatedPoint
    }

    function drawPointers() {
        let context = this.context,
            size = this.size,
            sizeBlock = size * .05,
            center = {
                x: size / 2,
                y: size / 2
            },
            positions = {
                seconds: {
                    x: size / 2,
                    y: sizeBlock + sizeBlock / 4
                },
                minutes: {
                    x: size / 2,
                    y: sizeBlock + sizeBlock
                },
                hours: {
                    x: size / 2,
                    y: sizeBlock + sizeBlock * 3.5
                }
            },
            angles = {
                seconds: (this.clockData.s / 60) * 360,
                minutes: (this.clockData.m / 60) * 360,
                hours: (this.clockData.h / 12) * 360
            }
        //rotate 自定义旋转
        positions.seconds = rotate(positions.seconds, angles.seconds, center)
        positions.minutes = rotate(positions.minutes, angles.minutes, center)
        positions.hours = rotate(positions.hours, angles.hours, center)

        let conterMinutes = {
                x: (2 * center.x + (center.x + (center.x - positions.minutes.x))) / 3,
                y: (2 * center.y + (center.y + (center.y - positions.minutes.y))) / 3
            },
            conterSeconds = {
                x: center.x + (conterMinutes.x - positions.seconds.x),
                y: center.y + (conterMinutes.y - positions.seconds.y)
            }
        context.strokeStyle = "#777"
        context.lineWidth = 6

        context.beginPath()
        context.moveTo(positions.minutes.x, positions.minutes.y)
        //绘制分钟贝塞尔曲线
        context.quadraticCurveTo(conterMinutes.x, conterMinutes.y, positions.hours.x, positions.hours.y)
        context.stroke()
        context.closePath()

        context.strokeStyle = "#A35EED"
        context.lineWidth = 4
        //绘制分钟小圆帽
        context.beginPath()
        context.arc(positions.seconds.x, positions.seconds.y, 20, 0, Math.PI * 2)
        context.stroke()
        context.closePath()

        let jointPosition = {
            x: positions.seconds.x,
            y: positions.seconds.y + (sizeBlock / 4 * 3)
        }

        jointPosition = rotate(jointPosition, angles.seconds, positions.seconds)

        context.beginPath()
        context.moveTo(jointPosition.x, jointPosition.y)
        context.quadraticCurveTo(conterSeconds.x, conterSeconds.y, positions.minutes.x, positions.minutes.y)
        context.stroke()
        context.closePath()
    }
    w.Relogio = Relogio
}(window))
var relogio = new Relogio(document.querySelector(".relogio"))
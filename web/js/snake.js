
const Movement = {
        VERTICAL: 0,
        HORIZONTAL: 1,
        DIR: {
            PLUS: 1,
            MINUS: -1
        },
        NAME: [
            "VERTICAL", "HORIZONTAL"
        ]
}

const KeyName = {
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight"
}

class Snake {

    constructor(container, sizeX=1200, sizeY=600) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = sizeX;
        this.canvas.height = sizeY;
        this.canvas.style=`
            background-color:white;
            box-shadow: 0px 0px 10px 2px black;
        `;
        container.appendChild(this.canvas);
        this.ctx=this.canvas.getContext("2d");

        this.reset();
        this.#setupMouseEvent();
        this.#setupKey();
    }

    reset() {
        this.movement = Movement.HORIZONTAL;
        this.movementDir = Movement.DIR.MINUS;
        this.enableMouse = false;
        this.paths = [];
        this.ratio = 1;
        this.isPlaying = false;
        this.intervalHandler = null;
        this.#redraw();
    }

    #setupKey() {
        document.onkeyup=(env) => {
            if( !this.isPlaying ) {
                return;
            }

            var isArrowKey = false;
            logConsole( env.key );
            if( this.movement == Movement.HORIZONTAL ) {
                if( env.key == KeyName.ArrowUp ) {
                    isArrowKey = true;
                    this.movement = Movement.VERTICAL;
                    this.movementDir = Movement.DIR.MINUS;
                }
                else if( env.key == KeyName.ArrowDown ) {
                    isArrowKey = true;
                    this.movement = Movement.VERTICAL;
                    this.movementDir = Movement.DIR.PLUS;
                }
            }
            else {
                if( env.key == KeyName.ArrowLeft ) {
                    isArrowKey = true;
                    this.movement = Movement.HORIZONTAL;
                    this.movementDir = Movement.DIR.MINUS;
                }
                else if( env.key == KeyName.ArrowRight ) {
                    isArrowKey = true;
                    this.movement = Movement.HORIZONTAL;
                    this.movementDir = Movement.DIR.PLUS;
                }
            }

            if( isArrowKey ) {
                var i = this.paths.length - 1;
                var new_x = this.paths[i][0];
                var new_y = this.paths[i][1];
                this.paths.push( [new_x, new_y] );
                logConsole( this.paths );
            }
        }
    }

    #setupMouseEvent() {
        const self = this;

        this.canvas.onmousedown=(env) => {
            if( this.paths.length > 0 ) {
                return;
            }

            var mouseXY = this.#getMouseXY(env);
            this.paths.push([mouseXY[0], mouseXY[1]]);
            this.paths.push([mouseXY[0], mouseXY[1]]);
            this.#growSnake(20);
            this.#redraw()
        }

        this.canvas.onmouseup=(env) => {
            if( this.isPlaying ) {
                this.stop();
                this.isPlaying = false;
                return;
            }

            this.isPlaying = true;
            this.intervalHandler = window.setInterval(
                function() {
                    self.moveSnake();
                },
                100
            );
            logConsole(this.paths);
        }

        if (!this.enableMouse) {
            return;
        }

        this.canvas.onmousemove=(env) => {
            if (! this.isDrawing ) {
                return;
            }
            var mouseXY = this.#getMouseXY(env);
            var i = this.paths.length - 1;
            this.paths[i].push(mouseXY);
            this.#redraw();
        }
    }

    #getMouseXY=(env)=>{
        const canvaXY = this.canvas.getBoundingClientRect();
        return [
           parseInt(env.clientX - canvaXY.left + 0.5),
           parseInt(env.clientY - canvaXY.top + 0.5)
        ];
     }

    #redraw(){
        this.ctx.clearRect(0,0, this.canvas.width,this.canvas.height);
        this.drawPaths();
    }

    #drawPath(path, color){
        if (path.length < 1) {
            return;
        }

        this.ctx.strokeStyle=color;
        this.ctx.lineWidth=3;
        this.ctx.beginPath();
        let y = path[0][1] * this.ratio;
        let x = path[0][0] * this.ratio;
        this.ctx.moveTo(x, y);
        
        logConsole("start at: (" + x + "," + y + ")")

        for(let i=1;i<path.length;i++){
            y = path[i][1] * this.ratio;
            x = path[i][0] * this.ratio;
            logConsole("line to: (" + x + "," + y + ")")
            this.ctx.lineTo(x, y);
        }
        this.ctx.lineCap="round";
        this.ctx.lineJoin="round";
        this.ctx.stroke();
     }

     #getZoomOffset() {
        h = parseInt(this.canvas.height);
        w = parseInt(this.canvas.width);
        return [
            h - (h * this.ratio),
            w - (w * this.ratio)
        ];
     }
     
    drawPaths(){
        let color="black";
        this.#drawPath(this.paths, color);
    }

    undo() {
        if (this.paths.length < 1) {
            return;
        }
        this.paths.pop();
        this.#redraw();
    }

    save() {
        var a = document.createElement('a');
        a.setAttribute('href', 
            'data:text/plain;charset=utf-8,'+ encodeURIComponent(JSON.stringify(this.paths))
        );
        a.setAttribute('download', "drawing.json");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    #loadFile(file) {
        var self = this;
        var fileReader = new XMLHttpRequest();
        fileReader.overrideMimeType("application/json");
        fileReader.open("GET", file, true);
        fileReader.onreadystatechange = function() {
            if (fileReader.readyState === 4 && fileReader.status == "200") {
                self.paths = JSON.parse(fileReader.responseText);
                var i = self.paths.length - 1;
                var x1 = self.paths[i][0];
                var x2 = self.paths[i-1][0];
                var y1 = self.paths[i][1];
                var y2 = self.paths[i-1][1];

                if( x1 == x2 ) {
                    self.movement = Movement.VERTICAL;
                    if( y1 >= y2 ) {
                        self.movementDir = Movement.DIR.PLUS;
                    }
                    else {
                        self.movementDir = Movement.DIR.MINUS;
                    }
                }
                else {
                    self.movement = Movement.HORIZONTAL;
                    if( x1 >= x2 ) {
                        self.movementDir = Movement.DIR.PLUS;
                    }
                    else {
                        self.movementDir = Movement.DIR.MINUS;
                    }
                }

                self.#redraw();
            }
        }
        fileReader.send(null);
    }

    openFile(file) {
        this.#loadFile(URL.createObjectURL(file));
    }

    stop() {
        if( this.intervalHandler == null ) {
            return;
        }

        try {
            window.clearInterval(this.intervalHandler);
        }
        catch(e) {
            console.log(e.name);
            console.log(e.message);
        }
        this.intervalHandler = null;
    }

    moveSnake() {
        this.#growSnake();
        this.reduceTail();
        this.#redraw();
        this.#checkHit();
    }

    #checkHit() {
        //console.clear();
        //console.log("path length: " + this.paths.length);
        
        var currentLine = this.paths[this.paths.length - 1];
        var i = 0;
        var currentX = currentLine[0];
        var currentY = currentLine[1];

        //console.log("currentX: " + currentX);
        //console.log("currentY: " + currentY);
        // console.log("current line: " + currentLine);
        // console.log("i = " + i)

        try {

            if( currentX <= 0 || currentX >= parseInt(this.canvas.width) ) {
                this.#gameOver("x edge");
            }
            if( currentY <= 0 || currentY >= parseInt(this.canvas.height) ) {
                this.#gameOver("y edge");
            }

            if( this.paths.length <= 3 ) {
                return;
            }

            while( i + 1 < this.paths.length - 3 ) {
                var x1 = this.paths[i][0];
                var x2 = this.paths[i+1][0];
                var y1 = this.paths[i][1];
                var y2 = this.paths[i+1][1];
                
                /*
                console.log("x1: " + x1);
                console.log("x2: " + x2);
                console.log("y1: " + y1);
                console.log("y2: " + y2);
                
                */

                if( x1 == x2 ) {  // veritical line
                    if( currentX == x1 ) {
                        if( currentY >= y1 && currentY <= y2 ) {
                            this.#gameOver("vertical hit 1");
                        }
                        if( currentY >= y2 && currentY <= y1 ) {
                            this.#gameOver("vertical hit 2");
                        }
                    }
                }
                else {  // horizontal line
                    if( currentY == y1 ) {
                        if( currentX >= x1 && currentX <= x2 ) {
                            this.#gameOver("horizontal hit 1");
                        }
                        if( currentX >= x2 && currentX <= x1 ) {
                            this.#gameOver("horizontal hit 2");
                        }
                    }
                }

                i++;
            }
        }
        catch(e) {
            console.log("Game Over");
            console.log(e);
        }

    }

    #gameOver(msg) {
        this.stop();
        window.alert("Game Over");
        throw "Game Over: " + msg;
    }

    reduceTail(size=1) {
        while( size > 0 ) {
            size -= this.#_reduceTail_(size);
        }
    }

    #_reduceTail_(size) {
        //console.log("path length: " + this.paths.length)
        var x1 = this.paths[0][0];
        var y1 = this.paths[0][1];
        var x2 = this.paths[1][0];
        var y2 = this.paths[1][1];

        if(x1 == x2) { // x is the same
            // vertical
            if(y1 > y2) {
                if(y1 - y2 <= size) {
                    this.paths.shift();
                    return (y1 - y2);
                }
                y1 -= size;
            }
            else {
                if( y2 - y1 <= size ) {
                    this.paths.shift();
                    return( y2 - y1 );
                }
                y1 += size;
            }
        }
        else {
            // horizontal
            if( x1 > x2 ) {
                if( x1 - x2 <= size ) {
                    this.paths.shift();
                    return (x1 - x2);
                }
                x1 -= size;
            }
            else {
                if( x2 - x1 <= size ) {
                    this.paths.shift();
                    return (x2 - x1);
                }
                x1 += size;
            }
        }

        this.paths[0] = [ x1, y1 ];
        return size;
    }

    #growSnake(size=2) {
        var i = this.paths.length - 1;
        /*
        console.clear();
        console.log("i = " + i)
        console.log("grow size: " + size);
        console.log("point @ i: " + this.paths[i][0] + "," + this.paths[i][1]);
        console.log(Movement.NAME[this.movement] + ": " + this.movementDir * size)
        console.log(this.paths);
        */
        if( this.movement == Movement.HORIZONTAL ) {
            var x = this.paths[i][0] += this.movementDir * size;
            var y = this.paths[i][1];
            this.paths[i] = [ x, y ];
        }
        else {
            var x = this.paths[i][0];
            var y = this.paths[i][1] += this.movementDir * size;
            this.paths[i] = [ x, y ];
        }
        /*
        console.log("point @ i: " + this.paths[i][0] + "," + this.paths[i][1]);
        console.log(this.paths);
        */
    }

}

enableLogging = false;
function logConsole(msg) {
    if (!enableLogging) {
        return;
    }
    console.log(msg);
}


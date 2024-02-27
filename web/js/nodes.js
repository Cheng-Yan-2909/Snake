
class Node {

    constructor(nodeList) {
        this.current_value = Math.random();
        this.next_value = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.nodes = [];
    }

    genNextValue() {
        this.next_value = Math.random();
    }

    next() {
        this.current_value = this.next_value;
    }

    addNode(node) {
        this.nodes.appendChild( node );
    }
}

class Network {

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

        this.createNodex();
        this.reset();
        this.#setupMouseEvent();
        this.#setupKey();
    }

    createNodex() {
        this.nodes = []
        for( var i = 0; i < 30; i++ ) {
            this.nodes.appendChild( new Node(this.nodes) )
        }

        for( var i in this.nodes ) {
            for( k in this.nodes ) {
                if( i == k ) {
                    continue;
                }
                var r = Math.floor(Math.random() * 10)
                if( r < 5 ) {
                    this.nodes.appendChild( k );
                }
            }
        }
    }

    reset() {

    }

    #setupMouseEvent() {

    }

    #setupKey() {

    }

    draw() {
        this.ctx.clearRect(0,0, this.canvas.width,this.canvas.height);

        this.ctx.strokeStyle=color;
        this.ctx.lineWidth=3;
        this.ctx.beginPath();

        this.ctx.moveTo(x, y);
        for( var i in this.nodes ) {

            this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
    }
}


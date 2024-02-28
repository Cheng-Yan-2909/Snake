
function demo() {

/*
https://plotly.com/javascript/3d-axes/
*/

    function getrandom(num , mul) 
        {
        var value = [ ];
        for(i=0;i<=num;i++)
        {
        var rand = Math.random() * mul;
        value.push(rand);
        }
        return value;
        }


    var data=[
        {
        opacity:0.4,
        type: 'scatter3d',
        x: getrandom(50 , -75),
        y: getrandom(50 , -75),
        z: getrandom(50 , -75),
        },
    ];
    var layout = {
    scene:{ 
        xaxis: {
        ticktext:['H20','C02','O2'],
        tickvals:[-30, -45, -65, -10]
    },
    yaxis: {
            nticks: 5,
            tickfont:
            {
            color:'green',
            family:'Old Standard TT, serif',
            size: 14
            },
            ticksuffix:'$'
            },
    zaxis: {
        ticks: 'outside',
        tick0: 0,
        tickwidth: 4}},
    };
    Plotly.newPlot('DrawArea', data, layout);

}


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


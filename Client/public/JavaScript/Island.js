'use strict';

import { Config } from './Data/Config.js';

let seaDiv = document.getElementById("sea");

class Island{
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
        
        this.islandElement = null;

        this.corners = {
            leftTop: { x: this.x - Config.island.width/2, y: this.y - Config.island.height/2 },
            leftBottom: { x: this.x - Config.island.width/2, y: this.y + Config.island.height/2},
            rightTop: { x: this.x + Config.island.width/2, y: this.y - Config.island.height/2},
            rightBottom: { x: this.x + Config.island.width/2, y: this.y + Config.island.height/2}
        }

        this.borders = [
            [ this.corners.leftTop, this.corners.leftBottom ], //Left
            [ this.corners.rightTop, this.corners.rightBottom ], //Right
            [ this.corners.rightTop, this.corners.leftTop ], //Top
            [ this.corners.rightBottom, this.corners.leftBottom ] //Bottom
        ]
    }

    create(){
        const island = document.createElement("div");
        island.id = "island";
        island.style.top = this.y + "px";
        island.style.left = this.x + "px";
        island.style.width = `${Config.island.width}px`; 
        island.style.height = `${Config.island.height}px`; 

        this.islandElement = island;

        seaDiv.append(island);
    }
}

export { Island }
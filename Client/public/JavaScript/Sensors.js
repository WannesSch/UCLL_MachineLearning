'use strict';

import { Config } from './Data/Config.js';
import { lerp } from './Utils.js';

let once = false;

class Sensors {
    constructor(_boat) {
        this.boat = _boat;
        this.lineCount = Config.sensor.lineCount;
        this.lineLength = Config.sensor.lineLength;
        this.lineSpread = Config.sensor.lineSpread;

        this.color = Config.sensor.color;

        this.lines = [];
        this.readings = [];
    }

    update(){
        this.lines = [];
        for (let i = 0; i<this.lineCount; i++) {
            let lineAngle = lerp(
                this.lineSpread/2,
                -this.lineSpread/2,
                this.lineCount == 1?0.5:i/(this.lineCount-1)
            );


            let beginPoint = { x: this.boat.x, y: this.boat.y};
            let endPoint = { 
                x: this.boat.x + this.lineLength * Math.sin((this.boat.angle + lineAngle)),
                y: this.boat.y - this.lineLength * Math.cos((this.boat.angle + lineAngle))
            }
            let middlePoint = {
                x: (endPoint.x + beginPoint.x)/2,
                y: (endPoint.y + beginPoint.y)/2
            }
            let quaterPoint = {
                x: (endPoint.x + middlePoint.x)/2,
                y: (endPoint.y + middlePoint.y)/2
            }


            let points = [
                beginPoint,
                middlePoint,
                quaterPoint,
                endPoint
            ]

            this.lines.push({id: i, element: null, points: points, lineAngle: lineAngle});
            if (!Config.general.drawPoints) continue; 
            for (let j = 0; j<points.length; j++) {
                if (j == 0) continue;
                $('#point_' + this.boat.id + "_" + i + '_' + j).remove();
                let point = document.createElement('div');
                point.className = 'point';
                point.id = 'point_' + this.boat.id + "_" + i + '_' + j;
                point.style.background = 'red';
                point.style.left = `${points[j].x}px`
                point.style.top = `${points[j].y}px`
                document.body.append(point);
            }
        }
    }

    #getReading(line,islandBorders){
        let touches=[];

        for(let i=0;i<islandBorders.length;i++){
            const touch=getIntersection(
                line[0],
                line[1],
                islandBorders[i][0],
                islandBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }
        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset);
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    draw() {
        console.log(this.color);
        $(`div[id^="sensor_${this.boat.boatElement.id}_"]`).remove();
        for (let i = 0; i<this.lines.length; i++) {
            let line = document.createElement('div');
            line.id = "sensor_" + this.boat.boatElement.id + "_" + this.lines[i].id;
            line.className = "sensor";
            line.style.background = `${this.color}`;
            line.style.height = `${this.lineLength}px`;
            line.style.transform = `rotate(${this.lines[i].lineAngle}rad)`;
            line.style.top = 50 - this.lineLength + 'px';

            this.boat.boatElement.append(line);
            this.lines[i].element = line;
        }
    }
}

export { Sensors }
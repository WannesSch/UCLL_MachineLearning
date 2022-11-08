'use strict'

import { Config } from './Data/Config.js';
import { Controls } from './Controls.js';
import { Sensors } from './Sensors.js';
import { NeuralNetwork, Level} from './Network.js';
import { Trail } from './Trail.js';

let seaDiv = document.getElementById("sea");

class Boat {
    constructor(_id, _x,_y, _sea) {
        this.id = _id;
        this.x = _x;
        this.y = _y;
        this.boatElement = null;

        this.speed = 0;
        this.acceleration = Config.boat.acceleration;
        this.maxSpeed = Config.boat.maxSpeed;
        this.friction = Config.boat.friction;;
        this.angle = 0; 
        this.damaged=false;

        this.sensors = new Sensors(this);
        this.controls = new Controls();
        this.trail = new Trail();
        this.sea = _sea;

        this.farthestDistance = 0;
        this.timeSurvived = 0;

        this.brain = new NeuralNetwork(
            [this.sensors.lineCount,6,4]
        );


        this.startPoint;
        this.endPoint;
    }

    update(){
        if (!this.damaged) {
            this.timeSurvived++;
            this.#move();
            this.sensors.update();
            this.#checkForIntersection();
            this.trail.create(this.x, this.y, this.angle,this.id);

            this.farthestDistance = this.trail.trailLength;
        }
        else {
            this.endPoint = { x: this.x, y: this.y };
        }
    }
    
    create() {
        const boat = document.createElement("div");
        boat.id = `boat${this.id}`;
        boat.className = "boat";
        boat.style.width = `${Config.boat.width}px`; 
        boat.style.height = `${Config.boat.height}px`; 

        let _boat = this;
        boat.onclick = function(e) {
            $.post('./SAVEBestBrain', {boat: _boat.brain}, () => {})
        }

        this.boatElement = boat;

        seaDiv.append(boat);

        this.startPoint = { x: this.x, y: this.y };

        this.update();
        this.sensors.draw();
    }    
    #move(){
        if (this.controls.forward) {
            this.speed+=this.acceleration; 
        }
        if (this.controls.reverse) {
            this.speed-=this.acceleration; 
        }

        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;

        if (this.speed < -this.maxSpeed/2) this.speed = -this.maxSpeed/2

        if (this.speed > 0) this.speed -= this.friction;
        if (this.speed < 0) this.speed += this.friction;

        if (Math.abs(this.speed)<this.friction) this.speed = 0;

        if (this.speed != 0) {
            let flip = this.speed>0?1:-1;

            if (this.controls.left) this.angle -= Config.boat.angleIncrement * flip;
            if (this.controls.right) this.angle += Config.boat.angleIncrement * flip;
        }

        this.x += Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;

        this.boatElement.style.left =  `${this.x}px`;
        this.boatElement.style.top =  `${this.y}px`;
        this.boatElement.style.transform = `rotate(${this.angle}rad)`;
    }

    #checkForIntersection() {
        let closestIsland = this.sea.getClosestIsland(this);
        if (closestIsland == null) return;

        this.#drawHitboxes();

        const outputsSensors = [];
        for (let sensor of this.sensors.lines) {
            for (let sensorPoint of sensor.points) {
                if (
                    sensorPoint.x >= closestIsland.corners.leftTop.x && //X top sensor >= left top x
                    sensorPoint.x <= closestIsland.corners.rightBottom.x && //X top sensor <= right bottom x
                    sensorPoint.y >= closestIsland.corners.leftTop.y && //Y top sensor >= left top y
                    sensorPoint.y <= closestIsland.corners.rightBottom.y || //Y top sensor >= right bottom y

                    sensorPoint.x <= 0 || //Check if boat goes out of screen
                    sensorPoint.y <= 0 ||
                    sensorPoint.x >= this.sea.width ||
                    sensorPoint.y >= this.sea.height
                    ) {
                        $('#sensor_' + this.boatElement.id + '_' + sensor.id).css('background', Config.sensor.collisionColor);
                        outputsSensors[sensor.id] = 1;
                    } 
                    else {
                        $('#sensor_' + this.boatElement.id + '_' + sensor.id).css('background', this.sensors.color);
                        outputsSensors[sensor.id] = 0;
                    }
                }
        }

        const outputs = NeuralNetwork.feedForward(outputsSensors, this.brain);

        if (Config.network.useNetwork) {
            this.controls.forward = outputs[0];
            this.controls.left = outputs[1];
            this.controls.right = outputs[2];
            this.controls.reverse = outputs[3];
        }
        
        this.checkDamage(closestIsland, outputs);
    }

    checkDamage(island, output) {
        if (
            this.x >= island.corners.leftTop.x &&
            this.x <= island.corners.rightBottom.x &&
            this.y >= island.corners.leftTop.y &&
            this.y <= island.corners.rightBottom.y ||

            this.x <= 0 ||  
            this.y <= 0 ||
            this.x >= this.sea.width || 
            this.y >= this.sea.height 
        ) {
            this.damaged = true;
            this.boatElement.style.backgroundImage = 'url("./Images/bootcrash.png")';
        }
    }


    checkOutput(output){
        let blocked = false;
        
        let blockedOutputs = [
            [1, 1, 1, 1],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 1, 0, 1]
        ]

        for (let blockedOutput of blockedOutputs) {
            let arr1 = output.slice().join(",")
            let arr2 = blockedOutput.slice().join(",")
            if(arr1===arr2) blocked = true;
        }
        
        return blocked;
    }

    #drawHitboxes() {
        if (!Config.general.drawHitboxes) return;

        for (let island of this.sea.islands) 
            $(island.islandElement).css('border', '1px solid green');
    }
}

export { Boat }
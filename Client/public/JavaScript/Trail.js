'use strict'

import { Config } from './Data/Config.js';

class Trail {
    constructor() {
        this.trail = [];
        this.trailLength = 0;
        this.trailInterval = Config.trail.trailInterval;
        this.lastTrail = null;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      

    create(_x, _y, _angle, boatId) {
        let valid = false;

        if (!this.lastTrail) {
            this.lastTrail = { x: _x, y: _y }
            this.trailLength++;

            valid = true;
        }
        else {
            let distance = Math.sqrt(Math.pow(_x - this.lastTrail.x, 2) + Math.pow(_y - this.lastTrail.y, 2));
            if (distance > this.trailInterval) {
                this.lastTrail = { x: _x, y: _y }
                this.trailLength++;

                valid = true;
            }
        }

        if (valid) {
            let trailComponent = new TrailComponent(_x, _y, _angle);
            this.trail.push(trailComponent);
            this.trailLength++;
        }

        if (this.trail.length > Config.trail.maxTrailLength) this.removeFirst();

        if(Config.trail.draw) this.update(boatId);
    }

    update(boatId) {
        $(`div[id^=trail_${boatId}]`).remove();
        for (let trailComponent of this.trail) {
            let _trailComponent = document.createElement('div');
            _trailComponent.className = 'trail';
            _trailComponent.id = 'trail_' + boatId;
            _trailComponent.style.background = this.color;
            _trailComponent.style.transform = `rotate(${trailComponent.angle}rad)`;
            _trailComponent.style.left = `${trailComponent.x}px`
            _trailComponent.style.top = `${trailComponent.y}px`
            document.body.append(_trailComponent);
        }
    }

    removeFirst() { this.trail.shift();}
}

class TrailComponent {
    constructor(_x, _y, _angle) {
        this.x = _x;
        this.y = _y;
        this.angle = _angle;
    }
}

export { Trail };
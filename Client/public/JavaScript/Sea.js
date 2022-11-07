'use strict'

import { Island } from './Island.js';
import { Boat } from './Boat.js';
import { Config } from './Data/Config.js';
import { getIntersection } from './Utils.js';

class Sea {
  constructor(_width, _height) {
      this.width = _width;
      this.height = _height;
      this.islands = [];
      this.islandOffset = Config.sea.islandOffset;
      this.islandCount = Config.sea.islandCount;
      
      this.maxCapacityReached = false;

      this.endPoint = {};

      this.corners = {
        leftTop: { x: 0, y: 0 },
        leftBottom: { x: 0, y: this.height },
        rightTop: { x: this.width, y: 0 },
        rightBottom: { x: this.width, y: this.height }
      }
  }

  initializeIslands() {
    for (let i = 0; i< this.islandCount; i++) {
      let island = this.getValidIsland();
      if(island) this.islands.push(island);
    }

    this.draw();
  }

  getValidIsland() {
      if (this.maxCapacityReached) return;

      try {
        let island = this.createIsland();

        if(island) return island;
        else return this.getValidIsland();
      } catch(error) {
        this.maxCapacityReached = true;
      }
  }

  draw() {
    for(let i = 0; i < this.islands.length; i++) {
      this.islands[i].create();
    }
  }

  drawBoat(id) {
    let position = this.getValidBoatPosition();
    if (position) {
      this.boat = new Boat(id, position.x, position.y, this)
      this.boat.create();
    }

    return this.boat;
  }

  createIsland(){
    let valid = true;

    let rndX = Math.round(Math.random() * this.width);
    let rndY = Math.round(Math.random() * this.height);

    let newIsland = new Island(rndX, rndY, 50);

    if (this.islands.length == 0) return newIsland;

    for (let i = 0; i < this.islands.length; i++) {
      let island = this.islands[i];
      let intersection1;
      let intersection2;
      
      for(let border of island.borders) {
        let result = getIntersection({x: island.x, y: island.y}, {x: newIsland.x, y: newIsland.y},border[0],border[1]);
        if (result && result.seg1 && result.seg2) { intersection1 = { x: result.x, y: result.y }; break; }
      }

      for(let border of newIsland.borders) {
        let result = getIntersection({x: island.x, y: island.y}, {x: newIsland.x, y: newIsland.y}, border[0],border[1]);
        if (result && result.seg1 && result.seg2) { intersection2 = { x: result.x, y: result.y }; break; }
      }

      if (!intersection1 || !intersection2) return null;

      let distance = Math.sqrt(Math.pow(intersection1.x - intersection2.x ,2) + Math.pow(intersection1.y - intersection2.y, 2))
      if (distance < this.islandOffset) {
        valid = false;
      } 
    }

    if (valid) return newIsland;
    else return null;
  }

  getClosestIsland(boat) {
    let closestDistance = 9999;
    let closestIsland = null;

    for (let _island of this.islands) {
      if (!_island) continue;

      for (let sensor of boat.sensors.lines) {
        let endPoint = sensor.points[3];

        let distance = Math.sqrt(Math.pow(_island.x - endPoint.x, 2) + Math.pow(_island.y - endPoint.y, 2));
        if(distance < closestDistance){
          closestIsland = _island;
          closestDistance = distance;
        }
      }
    }

    return closestIsland;
  }

  getValidBoatPosition() {
    let bottomIslands = [];

    let rndX = Math.round(Math.random() * this.width);
    let maxY = 900;
    let minY = 750;
    let rndY = Math.round(Math.random() * (maxY - minY) + minY)

    let pos = { x: 500, y: 500 }

    for (let island of this.islands)
      if (island.y >= 700) bottomIslands.push(island);

    for (let island of bottomIslands) {
      if (pos.x >= island.corners.leftTop.x && pos.x <= island.corners.rightBottom.x && 
          pos.y >= island.corners.leftTop.y && pos.y <= island.corners.rightBottom.y) 
          { 
            return this.getValidBoatPosition()
          }
    }
    
    return pos;
  }
}

export { Sea }
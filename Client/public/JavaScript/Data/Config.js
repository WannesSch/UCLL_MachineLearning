'use strict'
const Config = {
    general: {
        drawHitboxes: true
    },
    boat: {
        width: 50,
        height: 100,
        acceleration: 0.2,
        maxSpeed: 0.5,
        friction: 0.05,
    },
    island: {
        width: 100,
        height: 100
    },
    sea: {
        islandOffset: 100,
        islandCount: 10
    },
    sensor: {
        lineCount: 5,
        lineLength: 100,
        lineSpread: Math.PI/2
    },
    network: {
        fleetCount: 400,
    },
    trail: {
        trailInterval: 50,
        maxTrailLength: 20
    }
}

export { Config };
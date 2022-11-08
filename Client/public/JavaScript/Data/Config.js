'use strict'
const Config = {
    general: {
        drawHitboxes: false,
        drawPoints: false, //Creates alot of DOM elements Expect some lagg
        useMutation: false
    },
    boat: {
        width: 50,
        height: 100,
        acceleration: 0.2,
        maxSpeed: 2,
        friction: 0.05,
        angleIncrement: 0.05
    },
    island: {
        width: 100,
        height: 100
    },
    sea: {
        islandOffset: 100,
        islandCount: 15
    },
    sensor: {
        lineCount: 5,
        lineLength: 100,
        lineSpread: Math.PI/2,
        color: "rgba(235, 52, 52, 0.575)",
        bestBoatColor: 'rgba(14, 135, 20, 0.575)',
        collisionColor: "rgba(0, 0, 0, 0.575)",
        pointColor: "rgb(115, 25, 25)"
    },
    network: {
        fleetCount: 100,
        mutationRate: 0.1,
        useNetwork: true
    },
    trail: {
        draw: false, //Creates alot of DOM elements Expect some lagg
        trailInterval: 50,
        maxTrailLength: 10
    }
}

export { Config };
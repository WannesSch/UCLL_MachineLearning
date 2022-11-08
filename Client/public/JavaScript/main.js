import { Sea } from './Sea.js';
import { Config } from './Data/Config.js';
import { NeuralNetwork , Level } from './Network.js';

//Main
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const sea = new Sea(windowWidth, windowHeight);
let fleet = [];
let previousBestBoat = null;

// use localstorage
// if(localStorage.getItem("bestBrain")){
//     for(let i=0;i<fleet.length;i++){
//         console.log(fleet[1].brain.levels[1].biases[1]);
//         fleet[i].brain=JSON.parse(
//             localStorage.getItem("bestBrain"));
//             console.log(fleet[1].brain.levels[1].biases[1]);    
//         if(i!=0){
//             NeuralNetwork.mutate(fleet[i].brain,0.1);
//             console.log(fleet[1].brain.levels[1].biases[1]);
//         }
//     }
// }

$(document).ready(() => {
    OnWindowLoad();
})


async function OnWindowLoad() {
    let bestBrain = await getBestBrainFromServer();
    console.log(bestBrain)

    sea.initializeIslands();
    fleet = generateFleet(Config.network.fleetCount);
    console.log(bestBrain)
    if (bestBrain) {
        for(let i=0;i<fleet.length;i++){
            // console.log(fleet[1].brain.levels[1].biases[1]);
            fleet[i].brain=bestBrain;

            // console.log(fleet[1].brain.levels[1].biases[1]);    

            if(i!=0){
                //NeuralNetwork.mutate(fleet[i].brain, Config.network.mutationRate);
                // console.log(fleet[1].brain.levels[1].biases[1]);
            }
        }
    }

    startAnimation();
    //startTimer();
}

function getBestBrainFromServer() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: './GETBestBrain',
        type: 'POST',
        success: function (data) {
          resolve(data)
        },
        error: function (error) {
          reject(error)
        },
      })
    })
}

function sendBestBrainToServer(bestBoat) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: './SAVEBestBrain',
        type: 'POST',
        data: {
            id: bestBoat.id,
            brain: bestBoat.brain
        },
        success: function (data) {
          resolve(data)
        },
        error: function (error) {
          reject(error)
        },
      })
    })
}

//functie voor een vloot te creeeren
function generateFleet(N){
    const boats = [];
    for(let i = 1; i <= N; i++){
        let boat = sea.drawBoat(i);
        boats.push(boat);
    }
    return boats;
}

function startAnimation() {
    for(let i = 0; i < fleet.length; i++)
        fleet[i].update();

    requestAnimationFrame(startAnimation);
}

function startTimer() {
    let count = 0;
    let timer = setInterval(() => {
        count++;

        if (count == 10) {
            getBestBoat();
            startTimer();
        }
    }, 1000);
}

function getBestBoat() {
    let farthestDistance = 0;
    let longestTimeAlive = 0;

    let bestBoat = null;

    for (let boat of fleet) {
        let distance = Math.sqrt(Math.pow(boat.x - boat.startPoint.x, 2) + Math.pow(boat.y - boat.startPoint.y, 2));
        if (distance < 200 || boat.x <= boat.startPoint.x && boat.y >= boat.startPoint.y + 50 && !boat.damages)  {
            boat.farthestDistance = 0;
            boat.timeSurvived = 0;
        }


        if (boat.farthestDistance >= farthestDistance && boat.timeSurvived >= longestTimeAlive) {
            farthestDistance = boat.farthestDistance;
            longestTimeAlive = boat.timeSurvived;

            bestBoat = boat;
        }
    }

    $(bestBoat.boatElement).css('opacity', 1);

    bestBoat.sensors.color = 'rgba(14, 135, 20, 0.575)';
    bestBoat.sensors.draw();
    
    if(previousBestBoat) console.log(bestBoat.id, previousBestBoat.id)
    if (bestBoat === previousBestBoat) {
        sendBestBrainToServer(bestBoat).then(() => {
            window.location.reload();
        })
        return;
    }
    else {
        if (previousBestBoat) previousBestBoat.sensors.color = Config.sensor.color;
        bestBoat.sensors.color = Config.sensor.bestBoatColor;
        bestBoat.sensors.draw();
    }

    previousBestBoat = bestBoat;
}

document.addEventListener("click", (e) => {
    let xC = e.clientX;
    let yC = e.clientY;
    console.log("EndPoint selected: (" + xC + "," + yC + ")");

    sea.endPoint= {x:xC,y:yC}
    console.log(sea.endPoint);
})
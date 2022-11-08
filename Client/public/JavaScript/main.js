import { Sea } from './Sea.js';
import { Config } from './Data/Config.js';
import { NeuralNetwork , Level } from './Network.js';

//Main
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const sea = new Sea(windowWidth, windowHeight);
let fleet = [];
let previousBestBoat = null;

$(document).ready(() => {
    OnWindowLoad();
})

//wait for server response and start program
async function OnWindowLoad() {
    let bestBrain = await getBestBrainFromServer();

    if(bestBrain) {
        localStorage.setItem("bestBrain",
            JSON.stringify(bestBrain));
    }

    sea.initializeIslands();
    fleet = generateFleet(Config.network.fleetCount);
    
    if(localStorage.getItem("bestBrain")){
        for(let i=0;i<fleet.length;i++){

            fleet[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"));

            if(i!=0){
                if(Config.general.useMutation) NeuralNetwork.mutate(fleet[i].brain,0.1);
            }
        }
    }

    startAnimation();
    if(Config.general.useMutation) startTimer();
}

//Retrieve bestbrain from server
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

//Save bestbrain to server
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

//create fleet
function generateFleet(N){
    const boats = [];
    for(let i = 1; i <= N; i++){
        let boat = sea.drawBoat(i);
        boats.push(boat);
    }
    return boats;
}

//Run boats
function startAnimation() {
    for(let i = 0; i < fleet.length; i++)
        fleet[i].update();

    requestAnimationFrame(startAnimation);
}

//Start update cycle for bestbrain
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

//Get the best performing boat
function getBestBoat() {
    let farthestDistance = 0;
    let longestTimeAlive = 0;

    let bestBoat = null;

    let allDead = true;

    for (let boat of fleet) {
        if (!boat.damaged) allDead = false;
        let distance = Math.sqrt(Math.pow(boat.x - boat.startPoint.x, 2) + Math.pow(boat.y - boat.startPoint.y, 2));
        if (distance < 200 || boat.x <= boat.startPoint.x && boat.y >= boat.startPoint.y + 50 && !boat.damages)  {
            boat.farthestDistance = 0;
            boat.timeSurvived = 0;
        }


        if (boat.farthestDistance >= farthestDistance && boat.timeSurvived >= longestTimeAlive && !boat.damaged) {
            farthestDistance = boat.farthestDistance;
            longestTimeAlive = boat.timeSurvived;

            bestBoat = boat;
        }
    }
    if (allDead) window.location.reload();

    $(bestBoat.boatElement).css('opacity', 1);

    bestBoat.sensors.color = 'rgba(14, 135, 20, 0.575)';
    bestBoat.sensors.draw();
    
    if(previousBestBoat && bestBoat == null) window.location.reload();
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
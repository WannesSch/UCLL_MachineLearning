import { Sea } from './Sea.js';
import { Config } from './Data/Config.js';
import { NeuralNetwork , Level } from './Network.js';

//Main
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let sea = new Sea(windowWidth, windowHeight);


sea.initializeIslands();

const fleet = generateFleet(Config.network.fleetCount);
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<fleet.length;i++){
        console.log(fleet[1].brain.levels[1].biases[1]);
        fleet[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
            console.log(fleet[1].brain.levels[1].biases[1]);    
        if(i!=0){
            NeuralNetwork.mutate(fleet[i].brain,0.1);
            console.log(fleet[1].brain.levels[1].biases[1]);
        }
    }
}
startAnimation();
//GetBestBrain();
//startCounting();


//functie voor een vloot te creeeren
function generateFleet(N){
    const boats = [];
    for(let i = 1; i <= N; i++){
        let boat = sea.drawBoat(i);
        boats.push(boat);
    }
    return boats;
}

function GetBestBrain() {
    $.post('./GETBestBrain', (data) => {
        console.log(data)
        if (data) {
            //$.parseJSON(data);
            for (let i = 0; i<fleet.length; i++) {
                fleet[i].brain = data;

                //console.log(fleet[0].brain);
                //console.log(fleet[1].brain);

                NeuralNetwork.mutate(fleet[i].brain, 0.9);
                //console.log(fleet[1].brain);
            }
        }
    })
}


function startAnimation() {
    for(let i = 0; i < fleet.length; i++)
        fleet[i].update();

    requestAnimationFrame(startAnimation);
}

document.addEventListener("click", (e) => {
    let xC = e.clientX;
    let yC = e.clientY;
    console.log("EndPoint selected: (" + xC + "," + yC + ")");

    sea.endPoint= {x:xC,y:yC}
    console.log(sea.endPoint);
})

// function startCounting() {
//     let counter = 0;
//     setInterval(() => {
//         if (counter == 5) {
//             getBestBoat();
//         }
//         counter++;
//     }, 1000);
// }

function getBestBoat() {
    let farthestDistance = 0;
    let longestTimeAlive = 0;

    let bestBoat = null;

    for (let boat of fleet) {
        boat.damaged = true;

        if (boat.farthestDistance >= farthestDistance) {
            farthestDistance = boat.farthestDistance;
            longestTimeAlive = boat.timeSurvived;

            bestBoat = boat;
        }
    }

    //save brain to server here
    // $.post('./GETBestBrain', (data) => {
    //     console.log(data)
    //     if (!data || bestBoat.farthestDistance > data.farthestDistance) {
    //         console.log(bestBoat)
    //         $.post('./SAVEBestBrain', {boat: bestBoat}, () => {})
    //     }
    // })
}
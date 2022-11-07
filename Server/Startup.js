const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs')
const app = express(); 

const date = new Date();
const currTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

const Port = 80;

app.use(express.static(path.join(__dirname, "../Client/public")));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/:action", function(req, res) {switch(req.param('action')) {
    case "GETBestBrain": {
        let bestBoat = fs.readFileSync('./Server/Data/BestBoat.json');
        let obj = JSON.parse(bestBoat);
        if (Object.keys(obj).length === 0) {
            res.send(null);
            return;
        }
        res.send(obj);
        res.end();
    } break;
    case "SAVEBestBrain": {
        let data = req.body;

        fs.writeFileSync('./Server/Data/BestBoat.json', JSON.stringify(data.brain));
        res.end();
    } break;
}})

app.listen(Port, () => {
    console.log('[' + currTime + '] Listening at http://localhost:%s', Port);
});
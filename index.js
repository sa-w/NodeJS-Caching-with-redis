
const express = require('express');

const app = express();

const port = process.env.port | 3500;

const redisPort = process.env.port || 6379;

const redis = require('redis');

const client = redis.createClient(redisPort);

let cacheMessage = "";

async function checkCache(req, res, next) {
    try {
        client.get("name", (err, value) => {
            if (value) {
                cacheMessage = `I Found ${value} in cache`;
                client.set("name", req.params.name);
            } else {
                client.set("name", req.params.name);
            }
            if (err) {
                cacheMessage.concat(`${err}`);
            }
        })

    } catch (err) {
        console.error(err);
    }
    next();
}

app.get('/:name', checkCache, (req, res) => {
    res.send(`Hello ${req.params.name}.
     </br> ${cacheMessage}.`);
    res.end();
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
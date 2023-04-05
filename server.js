const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

// include and initialize the rollbar library with your access token

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());


app.use(express.static(`${__dirname}/public`));

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'e644fa7f73694a9ea217da14f36fdd37',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  rollbar.info('bots loaded successfully')
  try {
    res.status(200).send(bots);
  } catch (error) {
    rollbar.error('No bots where loaded')
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  rollbar.info('Bots have been shuffled')
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    rollbar.info('A dule has begun')
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      rollbar.info('A player has lost a match')
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      rollbar.info('A player has won a match')
      playerRecord.wins += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.use(rollbar.errorHandler());

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});


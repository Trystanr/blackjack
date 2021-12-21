class Player {
  uid = "2918231u2";

  hand = [];

  clearHand = () => {
    this.hand = [];
  };
}

class Dealer extends Player {}

const calculateHand = (hand) => {};

class Game {
  players = [];

  deck = [];

  handlePlayerJoin = (player) => {
    this.players.push(player);
  };

  handlePlayerLeave = (player) => {
    this.players.splice(this.players.indexOf(player), 1);
  };

  giveCardFromDeck = (player) => {
    player.hand.push(this.deck.pop());
  };

  deal = () => {
    this.players.forEach((player) => {
      this.giveCardFromDeck(player);
    });
  };
}

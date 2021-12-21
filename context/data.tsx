import React, { createContext, useContext, useState } from "react";
// import { faker } from "faker";
const faker = require("faker");

const { decks } = require("cards");

interface IBlackjack {
  // TODO: Change from any
  players: any[] | undefined;
  currentPlayerTurn: number;

  addPlayer: () => void;
  removePlayer: (player: any) => void;

  startRound: () => void;

  standPlayer: () => void;
  hitPlayer: () => void;

  getHandValue: (hand: any) => number;
  getCardValue: (card: any) => number;
}

const defaultPlayer = {
  name: "",
  hand: [],
};

const BlackjackContext = createContext<IBlackjack | undefined>(undefined);

export const BlackjackProvider = ({ children }: { children: JSX.Element }) => {
  const [players, setPlayers] = useState<any[]>([{ name: "Dealer", hand: [] }]);

  const [deck, setDeck] = useState(new decks.StandardDeck({ jokers: 0 }));

  deck.shuffleAll();

  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(-1);

  const addPlayer = () => {
    // TODO: Fix this draw
    // const draw = deck.draw(2);
    // console.log(draw);

    setPlayers((players) => [
      ...players,
      {
        name: faker.name.firstName(),
        hand: [],
      },
    ]);
  };

  const removePlayer = (player: any) => {
    const name = player.name;
    setPlayers(players.filter((player) => player.name !== name));
  };

  const startRound = () => {
    setCurrentPlayerTurn(1);
    dealToAllPlayers();
  };

  const dealToAllPlayers = () => {
    setPlayers(
      players.map((player) => ({
        ...player,
        hand: deck.draw(2),
        status: "playing",
      }))
    );
  };

  const handleNextPlayer = () => {
    if (currentPlayerTurn + 1 < players.length) {
      setCurrentPlayerTurn(currentPlayerTurn + 1);
    } else {
      // Game ended
      setCurrentPlayerTurn(0);

      if (getHandValue(players[0].hand) < 17) {
        hitDealer();
      }

      // TODO: Handle game end
      setCurrentPlayerTurn(-1);

      const allPlayersCheck = players;

      // Todo: fix this
      allPlayersCheck.map((player, idx) => {
        if (idx === 0) {
          return (player.status = "dealer");
        } else {
          if (getHandValue(player.hand) > 21) {
            return (player.status = "busted");
          } else if (
            getHandValue(player.hand) > getHandValue(players[0].hand)
          ) {
            return (player.status = "won");
          } else if (
            getHandValue(player.hand) < getHandValue(players[0].hand)
          ) {
            return (player.status = "lost to dealer");
          } else {
            return (player.status = "push");
          }
        }
      });
    }
  };

  const standPlayer = () => {
    handleNextPlayer();
  };

  const hitPlayer = () => {
    const draw = deck.draw(1)[0];

    setPlayers((players) =>
      players.map((player, idx) => {
        if (idx === currentPlayerTurn) {
          return {
            ...player,
            hand: [...player.hand, draw],
          };
        } else {
          return player;
        }
      })
    );

    if (
      getHandValue(players[currentPlayerTurn].hand) + getCardValue(draw) <
      21
    ) {
      // All fine
    } else if (
      getHandValue(players[currentPlayerTurn].hand) + getCardValue(draw) ===
      21
    ) {
      // Winner

      handleNextPlayer();
    } else {
      handleNextPlayer();
    }
  };

  const hitDealer = () => {
    const draw = deck.draw(1)[0];

    setPlayers((players) =>
      players.map((player, idx) => {
        if (idx === 0) {
          return {
            ...player,
            hand: [...player.hand, draw],
          };
        } else {
          return player;
        }
      })
    );
  };

  const getHandValue = (hand: any) => {
    let total = 0;

    hand.forEach((card) => {
      total += getCardValue(card);
    });

    return total;
  };

  const getCardValue = (card: any) => {
    if (card.rank.shortName === "A") {
      return 11;
    } else if (
      card.rank.shortName === "K" ||
      card.rank.shortName === "Q" ||
      card.rank.shortName === "J"
    ) {
      return 10;
    } else {
      return parseInt(card.rank.shortName);
    }
  };

  return (
    <BlackjackContext.Provider
      value={{
        players,
        currentPlayerTurn,

        addPlayer,
        removePlayer,

        startRound,

        standPlayer,
        hitPlayer,

        getHandValue,
        getCardValue,
      }}
    >
      {children}
    </BlackjackContext.Provider>
  );
};

export const BlackjackConsumer = BlackjackContext.Consumer;

export const useBlackjack = () => useContext(BlackjackContext);

import type { NextPage } from "next";
import Head from "next/head";
import Card from "../components/elements/Card";
import { useBlackjack } from "../context/data";

import { TransitionGroup, CSSTransition } from "react-transition-group";

const Home: NextPage = () => {
  const blackjack = useBlackjack();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="#">
            Blackjack
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by hitting any of the controls
        </p>

        <div className="flex flex-wrap items-center justify-center space-x-4 max-w-4xl mt-6 sm:w-full">
          <button
            className="p-6 mt-6 text-left border w-72 rounded-xl hover:text-blue-600 focus:text-blue-600 flex flex-col"
            onClick={blackjack.addPlayer}
          >
            <div className="flex items-center justify-between self-stretch">
              <h3 className="text-2xl font-bold">Add Player</h3>
              <div className="text-2xl font-bold">+</div>
            </div>
            <p className="mt-4 text-xl">Add player to the table.</p>
          </button>

          <button
            className="p-6 mt-6 text-left border w-72 rounded-xl hover:text-blue-600 focus:text-blue-600 flex flex-col"
            onClick={blackjack.startRound}
          >
            <div className="flex items-center justify-between self-stretch">
              <h3 className="text-2xl font-bold">Start Round</h3>
              <div className="text-2xl font-bold">&rarr;</div>
            </div>
            <p className="mt-4 text-xl">Start the round.</p>
          </button>
        </div>

        {/* <h2 className="mt-8 text-2xl">Players</h2> */}
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-2 sm:w-full text-center ">
          {blackjack?.players?.map((player, idx) => (
            <>
              <div
                key={idx}
                className="mt-4 relative"
                // onClick={() => {
                //   console.log("Removing");
                //   blackjack.removePlayer(player);
                // }}
              >
                {player.status !== "playing" && (
                  <div className="bg-blue-700 bg-opacity-60 text-gray-50 p-2 rounded-md font-bold absolute top-4 -right-8 z-50 text-xs rotate-12 transform-gpu">
                    {player.status}
                  </div>
                )}

                <div className="flex">
                  {player.hand.map((card, idx) => {
                    if (
                      player.name === "Dealer" &&
                      idx > 0 &&
                      player.status === "playing"
                    ) {
                      return <Card idx={idx} key={idx} unicode={"🂠"} />;
                    } else
                      return (
                        <Card idx={idx} key={idx} unicode={card.unicode} />
                      );
                  })}
                </div>

                <div className="text-xl mt-4">{player.name}</div>

                <div className="text-xs mt-0 flex items-center justify-center relative h-10">
                  {blackjack.currentPlayerTurn === idx && (
                    <div className="bg-blue-600  w-10 h-10 rounded-full animate-ping absolute" />
                  )}
                  <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full absolute">
                    {player.name === "Dealer" && player.status === "playing"
                      ? blackjack.getCardValue(player.hand[0]) + " + ?"
                      : blackjack.getHandValue(player.hand)}
                  </div>
                </div>

                {player.name !== "Dealer" && (
                  <div className="text-md space-y-1 mt-2 flex flex-col">
                    <button
                      className="py-1 px-4 border-2 border-black rounded-md hover:border-blue-600 hover:text-blue-600 focus:text-blue-600 disabled:text-gray-400 disabled:border-gray-200"
                      onClick={() => {
                        blackjack.hitPlayer();
                      }}
                      disabled={blackjack.currentPlayerTurn !== idx}
                    >
                      hit
                    </button>
                    <button
                      className="py-1 px-4 border-2 border-black rounded-md hover:border-blue-600 hover:text-blue-600 focus:text-blue-600 disabled:text-gray-400 disabled:border-gray-200"
                      onClick={() => {
                        blackjack.standPlayer();
                      }}
                      disabled={blackjack.currentPlayerTurn !== idx}
                    >
                      stand
                    </button>
                  </div>
                )}

                {blackjack.currentPlayerTurn === idx ? (
                  <div className="text-3xl animate-bounce h-8 mt-2 text-blue-600">
                    &uarr;
                  </div>
                ) : (
                  <div className="h-8 mt-2"></div>
                )}
              </div>
              {player.name === "Dealer" && <div className="basis-full" />}
            </>
          ))}
          <button
            className="w-20 h-20 flex items-center justify-center border-2 border-black text-black rounded-full cursor-pointer text-2xl"
            onClick={blackjack.addPlayer}
          >
            +
          </button>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t mt-16">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Trystan
        </a>
      </footer>
    </div>
  );
};

export default Home;

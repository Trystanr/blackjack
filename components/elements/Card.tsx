import React, { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const Card = ({ idx, unicode }) => {
  return (
    <div
      className={`text-9xl  bg-white ${idx > 0 && "-ml-16"} `}
      style={{ transform: `rotate(${idx * 4}deg)` }}
    >
      {unicode}
    </div>
  );
};

export default Card;

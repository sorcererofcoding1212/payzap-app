"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const messages = [
  "Received ₹500",
  "Sent ₹200",
  "Balance updated",
  "Received ₹200",
];

export const HomePageAnimationText = () => {
  const [index, setIndex] = useState(0);

  return (
    <motion.div
      key={index}
      className="absolute chat chat-start -top-5 lg:-top-10 -right-16 lg:-right-24 text-xs lg:text-sm font-medium py-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [20, 0, 0, -10],
      }}
      transition={{
        duration: 6,
        times: [0, 0.2, 0.7, 1],
        ease: "easeInOut",
        delay: 0.6,
      }}
      onAnimationComplete={() => {
        setIndex((prev) => (prev + 1) % messages.length);
      }}
    >
      <div className="chat-bubble text-base-100 bg-base-content w-36 lg:w-40 rounded-sm">
        {messages[index]}
      </div>
    </motion.div>
  );
};

/*
<div
key={index}
      className="text-white absolute -top-5 -right-5 lg:-right-10 text-xs lg:text-sm px-4 font-medium py-2 rounded-md bg-purple-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [20, 0, 0, -10],
      }}
      transition={{
        duration: 6,
        times: [0, 0.2, 0.7, 1],
        ease: "easeInOut",
        delay: 0.6,
      }}
      onAnimationComplete={() => {
        setIndex((prev) => (prev + 1) % messages.length);
      }}
className="chat chat-start">
  <div className="chat-bubble">
    It's over Anakin,
    <br />
    I have the high ground.
  </div>
</div>
<div className="chat chat-end">
  <div className="chat-bubble">You underestimate my power!</div>
</div>
*/

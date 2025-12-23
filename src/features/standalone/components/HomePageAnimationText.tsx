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
    >
      {messages[index]}
    </motion.div>
  );
};

"use client";

import { HomePageAnimationText } from "./HomePageAnimationText";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const AnimatedHeroComponent = () => {
  return (
    <div className="relative mx-auto mt-4 lg:mt-0">
      <div className="relative w-[220px] h-[440px] border-base-200 border lg:border-2 rounded-[40px] bg-base-300 p-1.5 shadow-lg">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-base-300" />
        <div className="w-full h-full rounded-[32px] bg-base-300 overflow-hidden">
          <img
            src="/wallet.jpg"
            alt="Payzap wallet"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <HomePageAnimationText />
      <ThemeSwitcher />
    </div>
  );
};

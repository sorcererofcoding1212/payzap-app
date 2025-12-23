import { HomePageHeading } from "@/features/standalone/components/HomePageHeading";
import { HomePageSubheading } from "@/features/standalone/components/HomePageSubheading";
import { AnimatedHeroComponent } from "@/features/standalone/components/AnimatedHeroComponent";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex relative flex-col items-center lg:flex-row lg:justify-between pt-10 pl-4 lg:pt-24 lg:pl-28">
      <div className="lg:w-[60%]">
        <HomePageHeading heading="Real time payments" />
        <HomePageHeading heading="Built for speed" />
        <HomePageSubheading subheading="Send, receive, and manage your money in real time — without the hassle." />
      </div>
      <div className="text-base-content flex justify-center w-[100%] lg:w-[40%] mt-6 lg:-mt-8">
        <AnimatedHeroComponent />
      </div>
    </div>
  );
};

export default HomePage;

import React from "react";
import { poppins } from "@/fonts/poppins";

const ErrorPage = () => {
  return (
    <div className="pt-18 lg:pt-16">
      <div
        className={`${poppins.className} text-center px-8 text-2xl lg:text-3xl text-red-500 font-semibold`}
      >
        404 | Page not found
      </div>
    </div>
  );
};

export default ErrorPage;

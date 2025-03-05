import React from "react";
import petLogo from "../Images/LMAR-Logo-Horizontal-RGB.svg";

const Navbar = () => {
  const tweetText =
    "Pet - A react app to find your favorite app by Junip -https://github.com/junipdewan/pet";
  return (
    <nav className="container mx-auto px-4 py-6 mb-8">
      <div className="flex flex-row justify-center items-center">
        <div className="flex items-center space-x-4 animate-slideInLeft">
          <img src={petLogo} alt="logo" className="w-3/4 rounded-full" />

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

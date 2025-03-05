import React from "react";
import petLogo from "../Images/logo.jpg";

const Navbar = () => {
  const tweetText =
    "Pet - A react app to find your favorite app by Junip -https://github.com/junipdewan/pet";
  return (
    <nav className="container mx-auto px-4 py-6 mb-8">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center space-x-4 animate-slideInLeft">
          <img src={petLogo} alt="logo" className="h-12 w-12 rounded-full" />
          <div className="flex flex-col">
            <div className="text-xl font-bold uppercase">Pet</div>
            <div className="text-gray-600">Find Your Pet</div>
          </div>
        </div>
        <div className="flex space-x-4 animate-slideInRight">
          <a href="https://github.com/junipdewan/pet">
            <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              <i className="fa fa-github mr-2"></i>
              View Source
            </button>
          </a>
          <a href={`https://twitter.com/intent/tweet?text=${tweetText}`}>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <i className="fa fa-twitter mr-2"></i>
              Tweet
            </button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

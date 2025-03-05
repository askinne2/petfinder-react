import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar/Navbar";
import Grid from './Pets/Grid';
import AnimalDetail from './pages/AnimalDetail';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Grid />} />
            <Route path="/animal/:id" element={<AnimalDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;

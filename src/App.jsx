import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar/Navbar";
import Grid from './Pets/Grid';
import AnimalDetail from './pages/AnimalDetail';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/config';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { isWordPress } from './config/environment';
import { getBasePath } from './config/routes';
import Navbar from "./Navbar/Navbar";
import Grid from './Pets/Grid';
import AnimalDetail from './pages/AnimalDetail';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/config';

const App = () => {
  // Use HashRouter for WordPress to avoid server routing conflicts
  const RouterComponent = isWordPress() ? HashRouter : BrowserRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <RouterComponent basename={getBasePath()}>
        <div className="min-h-screen">
          {!isWordPress() && <Navbar />}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Grid />} />
              <Route path="/animal/:id" element={<AnimalDetail />} />
            </Routes>
          </main>
        </div>
      </RouterComponent>
    </QueryClientProvider>
  );
};

export default App;

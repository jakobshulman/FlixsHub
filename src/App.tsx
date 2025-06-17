import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import TVDetails from './pages/TVDetails';
import PersonDetails from './pages/PersonDetails';
import Layout from './Layout';
import Movies from './pages/Movies';
import TVs from './pages/TVs';
import MoviesByRegion from './pages/MoviesByRegion';
import TVsByRegion from './pages/TVsByRegion';
import { GenresProvider } from './context/GenresContext';
import { CountryProvider } from './context/CountryContext';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import Genre from './pages/Genre';
import SeasonDetails from './pages/SeasonDetails';

export default function App() {
  return (
    <CountryProvider>
      <GenresProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="tv/:id" element={<TVDetails />} />
            <Route path="person/:id" element={<PersonDetails />} />
            <Route path="movies" element={<Movies />} />
            <Route path="tvs" element={<TVs />} />
            <Route path="movies-by-region" element={<MoviesByRegion />} />
            <Route path="tvs-by-region" element={<TVsByRegion />} />
            <Route path="genre/:id" element={<Genre />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="tv/:tvId/season/:seasonNumber" element={<SeasonDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </GenresProvider>
    </CountryProvider>
  );
}

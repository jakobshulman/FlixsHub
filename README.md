# MovieHub

MovieHub is a modern web application for discovering movies, TV shows, and people in the entertainment industry. The app provides a clean, user-friendly interface for searching, filtering, and exploring media content from around the world.

## Features

- **Search**: Find movies, TV shows, and people by name with instant suggestions.
- **Categorized Results**: Search results are grouped by Movies, TV Shows, and People for easy navigation.
- **Media Details**: View detailed information about each movie, TV show, or person, including genres, cast, and more.
- **Filtering**: Filter content by genre, language, and region.
- **Responsive Design**: Fully responsive and optimized for desktop and mobile devices.
- **Modern UI**: Clean, modern interface built with React and Tailwind CSS.

## Technologies Used

- **React** (TypeScript)
- **React Router**
- **Tailwind CSS**
- **Axios** (for API requests)
- **TMDB API** (The Movie Database)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/movie-app.git
   cd movie-app
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your TMDB API key:

   ```
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key
   ```

4. Start the development server:

   ```sh
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/` - Main source code
  - `api/` - API utilities and TMDB integration
  - `components/` - Reusable UI components
  - `pages/` - Main pages (Home, Search Results, Details, etc.)
  - `context/` - React context providers (Language, Country, Genres)
  - `config/` - App configuration
  - `types/` - TypeScript types
  - `utils/` - Utility functions

## Customization

- Update the app name and branding in `src/config/siteConfig.ts`.
- Modify styles using Tailwind CSS classes in the components.

## License

This project is licensed under the MIT License.

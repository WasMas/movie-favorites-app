import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly storageKey = 'movie-favorites-movies';
  private readonly defaultMovies: Movie[] = [
    { id: 1, title: 'Inception', year: 2010, genre: 'Science-fiction', poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', overview: 'Un voleur de rêves reçoit une dernière mission impossible.' },
    { id: 2, title: 'Interstellar', year: 2014, genre: 'Science-fiction', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', overview: 'Une équipe traverse un trou de ver pour sauver l’humanité.' },
    { id: 3, title: 'The Dark Knight', year: 2008, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', overview: 'Batman affronte un criminel qui plonge Gotham dans le chaos.' },
    { id: 4, title: 'Parasite', year: 2019, genre: 'Drame', poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', overview: 'Deux familles que tout oppose se rapprochent dangereusement.' },
    { id: 5, title: 'The Matrix', year: 1999, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', overview: 'Un programmeur découvre la vraie nature de son monde.' },
  ];

  getMovies(): Movie[] {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [...this.defaultMovies];
  }

  addMovie(movie: Movie): void {
    const movies = this.getMovies();
    movie.id = movies.length ? Math.max(...movies.map((item) => item.id)) + 1 : 1;
    localStorage.setItem(this.storageKey, JSON.stringify([...movies, movie]));
  }

  getById(id: number): Movie | undefined {
    return this.getMovies().find((movie) => movie.id === id);
  }
}

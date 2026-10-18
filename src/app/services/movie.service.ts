import { Injectable, inject } from '@angular/core';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { Movie } from '../models/movie.model';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private firebase = inject(FirebaseService);

  async getMovies(): Promise<Movie[]> {
    const snapshot = await getDocs(collection(this.firebase.db, 'movies'));
    return snapshot.docs.map((item) => item.data() as Movie);
  }

  async addMovie(movie: Movie): Promise<void> {
    const movies = await this.getMovies();
    movie.id = movies.length ? Math.max(...movies.map((item) => item.id)) + 1 : 1;
    await addDoc(collection(this.firebase.db, 'movies'), movie);
  }
}

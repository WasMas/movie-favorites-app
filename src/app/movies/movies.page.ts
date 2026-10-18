import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular';
import { Movie } from '../models/movie.model';
import { AuthService } from '../services/auth.service';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  imports: [RouterLink, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar],
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];
  favorites: number[] = [];
  userName = '';
  isAdmin = false;
  private movieService = inject(MovieService);
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) { this.router.navigateByUrl('/login'); return; }
    this.userName = user.firstName;
    this.isAdmin = user.role === 'admin';
    this.favorites = user.favoriteMovieIds;
    this.movies = this.movieService.getMovies();
  }

  toggleFavorite(movie: Movie): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    this.favorites = this.favorites.includes(movie.id) ? this.favorites.filter((id) => id !== movie.id) : [...this.favorites, movie.id];
    user.favoriteMovieIds = this.favorites;
    this.auth.updateUser(user);
  }

  isFavorite(id: number): boolean { return this.favorites.includes(id); }
  logout(): void { this.auth.logout(); this.router.navigateByUrl('/login'); }
}

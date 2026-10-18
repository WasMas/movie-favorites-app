import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular';
import { Movie } from '../models/movie.model';
import { AuthService } from '../services/auth.service';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  imports: [RouterLink, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar],
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];
  favorites: number[] = [];
  userName = '';
  userPhoto?: string;
  isAdmin = false;
  private movieService = inject(MovieService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    const user = await this.auth.getCurrentUserAsync();
    if (!user) { this.router.navigateByUrl('/login'); return; }
    this.userName = user.firstName;
    this.userPhoto = user.photo;
    this.isAdmin = user.role === 'admin';
    this.favorites = user.favoriteMovieIds;
    try {
      this.movies = await this.movieService.getMovies();
    } catch (error) {
      console.error('Impossible de charger les films Firebase.', error);
      this.movies = [];
    }
    this.changeDetector.detectChanges();
  }

  async toggleFavorite(movie: Movie): Promise<void> {
    const user = await this.auth.getCurrentUserAsync();
    if (!user) return;
    this.favorites = this.favorites.includes(movie.id) ? this.favorites.filter((id) => id !== movie.id) : [...this.favorites, movie.id];
    user.favoriteMovieIds = this.favorites;
    await this.auth.updateUser(user);
    this.changeDetector.detectChanges();
  }

  isFavorite(id: number): boolean { return this.favorites.includes(id); }
  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}

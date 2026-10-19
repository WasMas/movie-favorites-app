import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { Movie } from '../models/movie.model';
import { AuthService } from '../services/auth.service';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  imports: [RouterLink, IonButton, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class MovieDetailsPage implements OnInit {
  movie?: Movie;
  favorites: number[] = [];
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private auth = inject(AuthService);
  private changeDetector = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    const user = await this.auth.getCurrentUserAsync();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const movie = Number.isInteger(id) ? await this.movieService.getMovie(id) : undefined;

    if (!user || !movie) {
      await this.router.navigateByUrl('/movies');
      return;
    }

    this.movie = movie;
    this.favorites = user.favoriteMovieIds;
    this.changeDetector.detectChanges();
  }

  async toggleFavorite(): Promise<void> {
    if (!this.movie) return;
    const user = await this.auth.getCurrentUserAsync();
    if (!user) return;
    this.favorites = this.favorites.includes(this.movie.id)
      ? this.favorites.filter((id) => id !== this.movie?.id)
      : [...this.favorites, this.movie.id];
    user.favoriteMovieIds = this.favorites;
    await this.auth.updateUser(user);
    this.changeDetector.detectChanges();
  }

  isFavorite(): boolean {
    return this.movie ? this.favorites.includes(this.movie.id) : false;
  }

  getMovieGenres(): string[] {
    return this.movie?.genre.split(',').map((genre) => genre.trim()).filter(Boolean) || [];
  }
}

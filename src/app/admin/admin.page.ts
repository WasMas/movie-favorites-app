import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonChip, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar, ToastController } from '@ionic/angular';
import { AppUser, Movie } from '../models/movie.model';
import { AuthService } from '../services/auth.service';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [FormsModule, RouterLink, IonButton, IonChip, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class AdminPage implements OnInit {
  users: AppUser[] = [];
  title = ''; year = 2026; genreInput = ''; genres: string[] = []; poster = ''; overview = '';
  message = '';
  private auth = inject(AuthService);
  private movies = inject(MovieService);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);
  private toastController = inject(ToastController);

  async ngOnInit(): Promise<void> {
    const user = await this.auth.getCurrentUserAsync();
    if (!user || user.role !== 'admin') { this.router.navigateByUrl('/movies'); return; }
    this.users = (await this.auth.getUsers()).filter((item) => item.role === 'user');
    this.changeDetector.detectChanges();
  }

  async toggleUser(user: AppUser): Promise<void> {
    user.active = !user.active;
    await this.auth.updateUser(user);
    this.changeDetector.detectChanges();
  }

  async addMovie(): Promise<void> {
    if (!this.title || !this.genres.length || !this.poster) {
      this.message = 'Remplissez le titre, le genre et l’affiche.';
      await this.presentToast(this.message, 'danger');
      return;
    }
    const movie: Movie = { id: 0, title: this.title, year: this.year, genre: this.genres.join(', '), poster: this.poster, overview: this.overview };
    await this.movies.addMovie(movie);
    this.message = 'Film ajouté au catalogue.';
    await this.presentToast(this.message, 'success');
    this.title = ''; this.genreInput = ''; this.genres = []; this.poster = ''; this.overview = '';
    this.changeDetector.detectChanges();
  }

  addGenre(): void {
    if (this.genres.indexOf(this.genreInput) === -1) {
      this.genres.push(this.genreInput);
    } else {
      void this.presentToast('Ce genre existe déjà.', 'danger');
    }
    this.genreInput = '';
  }

  removeGenre(index: number): void {
    this.genres.splice(index, 1);
  }

  private async presentToast(message: string, color: 'danger' | 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}

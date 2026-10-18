import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { AppUser } from '../models/movie.model';
import { AuthService } from '../services/auth.service';
import { PhotosService } from '../services/photos.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar,
  ],
})
export class ProfilePage implements OnInit {
  user?: AppUser;
  message = '';
  error = '';
  private auth = inject(AuthService);
  private photos = inject(PhotosService);
  private router = inject(Router);

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser() || undefined;
    if (!this.user) this.router.navigateByUrl('/login');
  }

  async takePhoto(): Promise<void> {
    if (this.user) this.user.photo = await this.photos.prendrePhoto();
  }

  async choosePhoto(): Promise<void> {
    if (this.user) this.user.photo = await this.photos.choisirDepuisGalerie();
  }

  save(): void {
    if (!this.user) return;
    if (!this.user.firstName || !this.user.lastName || !this.user.email || this.user.age < 1) {
      this.error = 'Veuillez remplir tous les champs correctement.';
      this.message = '';
      return;
    }
    this.auth.updateUser(this.user);
    this.error = '';
    this.message = 'Profil mis à jour.';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

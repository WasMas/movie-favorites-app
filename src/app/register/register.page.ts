import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PhotosService } from '../services/photos.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [FormsModule, RouterLink, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar],
})
export class RegisterPage {
  firstName = ''; lastName = ''; age = 18; email = ''; password = ''; photo?: string; error = '';
  private auth = inject(AuthService);
  private photos = inject(PhotosService);
  private router = inject(Router);

  async takePhoto(): Promise<void> { this.photo = await this.photos.prendrePhoto(); }
  async choosePhoto(): Promise<void> { this.photo = await this.photos.choisirDepuisGalerie(); }

  submit(): void {
    this.error = this.auth.register({ firstName: this.firstName, lastName: this.lastName, age: this.age, email: this.email, password: this.password, photo: this.photo }) || '';
    if (!this.error) this.router.navigateByUrl('/movies');
  }
}

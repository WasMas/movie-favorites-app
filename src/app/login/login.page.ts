import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [FormsModule, RouterLink, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar],
})
export class LoginPage {
  email = 'sara@movies.test';
  password = '123456';
  error = '';
  private auth = inject(AuthService);
  private router = inject(Router);

  submit(): void {
    this.error = this.auth.login(this.email, this.password) || '';
    if (!this.error) this.router.navigateByUrl('/movies');
  }
}

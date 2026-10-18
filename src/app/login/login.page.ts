import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [FormsModule, RouterLink, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar],
})
export class LoginPage {
  email = '';
  password = '';
  error = '';
  private auth = inject(AuthService);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  async submit(): Promise<void> {
    this.error = await this.auth.login(this.email, this.password) || '';
    this.changeDetector.detectChanges();
    if (!this.error) this.router.navigateByUrl('/movies');
  }
}

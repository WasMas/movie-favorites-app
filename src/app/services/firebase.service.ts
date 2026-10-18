import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  readonly app: FirebaseApp = initializeApp(environment.firebase);
  readonly auth = getAuth(this.app);
  readonly db = getFirestore(this.app);
}

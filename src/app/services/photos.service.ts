import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class PhotosService {
  async prendrePhoto(): Promise<string | undefined> {
    const photo = await Camera.takePhoto({ quality: 80, editable: 'no' });
    return photo.webPath;
  }

  async choisirDepuisGalerie(): Promise<string | undefined> {
    const result = await Camera.chooseFromGallery({
      allowMultipleSelection: false,
      quality: 80,
    });
    return result.results[0]?.webPath;
  }
}

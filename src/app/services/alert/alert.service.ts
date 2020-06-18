import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController:AlertController) { }

  presentAlert(message:string){
    return this.alertController.create({
      cssClass: '',
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
  }
}

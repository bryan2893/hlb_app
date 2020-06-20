import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController:ToastController) { }

  showToast(message:string){
    return this.toastController.create({
      message:message,
      duration:2000
    });
  }

}

import { Injectable } from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(public loadingController: LoadingController) { }

  showLoader(textoAmostrar:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.loadingController.create({
        message: textoAmostrar
      }).then((res) => {
        resolve(res);
      }).catch((error)=>{
        reject(error.message)
      });
    });
  }

}

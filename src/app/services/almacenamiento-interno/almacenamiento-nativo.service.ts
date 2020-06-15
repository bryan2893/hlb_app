import { Injectable } from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import Settings from '../../../DTO/settings.dto';

@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoNativoService {

  private nombreDeLlave = "configuraciones";

  constructor(private nativeStorage: NativeStorage) {}

  obtenerParametrosDeConfiguracion(){
      return new Promise((resolve,reject)=>{

        this.nativeStorage.keys().then((keys)=>{

          let obtenerClave = false;

          if(keys[0]){
            obtenerClave = true;
          }

          if(!obtenerClave){
            resolve(null);
          }else{
            this.nativeStorage.getItem(this.nombreDeLlave).then((parametrosDeConfiguracion)=>{
              resolve(parametrosDeConfiguracion);
            }).catch((error)=>{
              reject(error);
            });
          }

        }).catch((error)=>{
          reject(error);
        });
        
      });
  }

  almacenarParametrosDeConfiguracion(parametrosDeConfiguracion:Settings){

    return new Promise((resolve,reject)=>{
        this.nativeStorage.setItem(this.nombreDeLlave,parametrosDeConfiguracion).then(()=> {
          resolve(parametrosDeConfiguracion);
        }).catch((error)=>{
          reject(error);
        });
    });
    
  }

}

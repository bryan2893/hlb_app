import { Injectable } from '@angular/core';
//import Mantenimiento_Trampa from 'src/DTO/local/mantenimiento_trampa_guardado.dto';

import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ExternalDbService {

  constructor() { }
  
  getTrapsPage()

  get_fake_Traps_Mantain(): Promise<any[]>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        let trapsList = [];
        for(let i=0;i<100;i++){
          let object = {id_local:i,id_original:i+1,num_trampa:i,tipo:'traspatio',finca_poblado:'Brucelas',lote_propietario:'lote A-D',latitud:87.00987,longitud:-87.09874,estado:1,sincronizado:1};
          trapsList.push(object);
        }
        resolve(trapsList);
      },4000);
    });
  }

}
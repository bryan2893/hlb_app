import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExternalDbService {

  constructor() { }

  get_fake_hlb_mantains(): Promise<any[]>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        let mantainsList = [];
        for(let i=0;i<100;i++){
          let object = {id_local:i,id_original:i+1,pais:"costa rica",tipo:'traspatio',finca_poblado:'Brucelas',lote_propietario:'lote A-D',latitud:87.00987,longitud:-87.09874,estado:1,sincronizado:1};
          mantainsList.push(object);
        }
        resolve(mantainsList);
      },4000);
    });
  }
}

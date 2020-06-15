import { Injectable } from '@angular/core';
import {TrampaAmarillaNuevo} from '../../../DTO/local/TrampaAmarillaNuevo.dto';

import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ExternalDbService {
  private urlToDownload = 'http://hlb.ticofrut.com/api/trampas_amarillas/obtener_pagina/';
  private urlToUpload = 'http://hlb.ticofrut.com/api/trampas_amarillas/sincronizar';

  constructor(private http: HTTP) {
    this.http.setHeader('*', String("Accept"), String("application/json"));
    this.http.setDataSerializer('json');
  }
  
  getTrapsPage(pageNumber:number,amountPerPage:number,pais:string){
    return new Promise((resolve,reject)=>{
      let completedUrl = this.urlToDownload + pageNumber + '/' + amountPerPage+'/'+pais;
      this.http.get(completedUrl,{},{}).then((response:HTTPResponse)=>{
        resolve(response.data);
      }).catch((e)=>{
        reject(e);
      });
    });
  }

  syncListOfTraps(listaDeTrampas:TrampaAmarillaNuevo[]){
    return new Promise((resolve,reject)=>{

      let paqueteDeSincronizacion = {
        registros:listaDeTrampas,
        informacionDeSincronizacion:[
          {
            direccion_mac:'aaab1',
            codigo_usuario:'knajera',
            nombre_aplicacion:'AppHlb',
            version_aplicacion:'1.1',
            fabricante_telefono:'CAT'
          }
        ]
      };

      this.http.post(this.urlToUpload, paqueteDeSincronizacion,{}).then((response) => {
        resolve(response.data);
      }).catch((error)=>{
        reject(error);
      });

    });
  }

}
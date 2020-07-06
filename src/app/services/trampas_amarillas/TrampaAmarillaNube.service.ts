import { Injectable } from '@angular/core';
import {TrampaAmarillaNubeSubida} from '../../../DTO/server/TrampaAmarillaNubeSubida';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {SyncInfoService} from '../syncInfo/sync-info.service';

@Injectable({
  providedIn: 'root'
})
export class TrampaAmarillaNubeService {
  private urlToDownload = 'http://hlb.ticofrut.com/api/trampas_amarillas/obtener_pagina/';
  private urlToUpload = 'http://hlb.ticofrut.com/api/trampas_amarillas/sincronizar';
  private urlToCountRecords = 'http://hlb.ticofrut.com/api/trampas_amarillas/contarRegistros/';

  constructor(private http: HTTP,private syncInfoService:SyncInfoService) {
    this.http.setHeader('*', String("Accept"), String("application/json"));
    this.http.setDataSerializer('json');
  }
  
  getTrapsPage(pageNumber:number,amountPerPage:number,pais:string){
    return new Promise((resolve,reject)=>{
      let completedUrl = this.urlToDownload + pageNumber + '/' + amountPerPage+'/'+pais;
      this.http.get(completedUrl,{},{}).then((response:HTTPResponse)=>{
        resolve(response);
      }).catch((e)=>{
        reject(e);
      });
    });
  }

  syncListOfTraps(listaDeTrampas:TrampaAmarillaNubeSubida[]){
    return new Promise((resolve,reject)=>{
      
      this.syncInfoService.getSyncInfo().then((info)=>{

        let paqueteDeSincronizacion = {
          registros:listaDeTrampas,
          informacionDeSincronizacion:[
            info
          ]
        };
  
        this.http.post(this.urlToUpload, paqueteDeSincronizacion,{}).then((response:HTTPResponse) => {
          resolve(response);
        }).catch((error)=>{
          reject(JSON.stringify(error));
        });

      }).catch((error) =>{
        reject(error);
      });

    });
  }

  countRecords(pais:string){
      return new Promise((resolve,reject)=>{
      
        this.http.get(this.urlToCountRecords+'/'+pais,{},{}).then((response:HTTPResponse)=>{
          let respuestaTransformada = JSON.parse(response.data);
          resolve(respuestaTransformada[0].CANTIDAD);
        }).catch((e)=>{
          reject(e);
        });

      });
  }

  getPagesQuantity(rowsPerPage:number,pais:string){
    return new Promise((resolve,reject)=>{
      this.countRecords(pais).then((response:number)=>{
        let quantity = response;

        if(quantity === 0){
          resolve(0);
        }

        let divisionResiduo = quantity % rowsPerPage;
        let divsionEntera = Math.trunc(quantity / rowsPerPage);

        let num_paginas = divsionEntera;

        if(divisionResiduo > 0){
            num_paginas += 1;
        }
        
        resolve(num_paginas);
      }).catch((error:any)=>{
        reject(error);
      });
      
    });
  }

}
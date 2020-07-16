import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {InspeccionTrampaNubeSubida} from '../../../DTO/server/InspeccionTrampaNubeSubida';
import {SyncInfoService} from '../../services/syncInfo/sync-info.service';
import {AlmacenamientoNativoService} from '../../services/almacenamiento-interno/almacenamiento-nativo.service';
import {Settings} from '../../../DTO/settings.dto'; 

@Injectable({
  providedIn: 'root'
})
export class InspeccionTrampaNubeService {

  private urlToDownload = '/api/inspeccion_trampas/obtener_pagina/';
  private urlToUpload = '/api/inspeccion_trampas/sincronizar/';
  private urlToCountRecords = '/api/inspeccion_trampas/contarRegistros/';

  constructor(private http: HTTP, private syncInfoService:SyncInfoService,
    private almacenamientoNativoService:AlmacenamientoNativoService) {
    this.http.setHeader('*', String("Accept"), String("application/json"));
    this.http.setDataSerializer('json');
  }
  
  getInspTrampPage(pageNumber:number,amountPerPage:number,oldDays:number,pais:string){

    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

        let completedUrl = parametros.link_de_sincronizacion + this.urlToDownload + pageNumber + '/' + amountPerPage+'/'+ oldDays+'/'+ pais;

        this.http.get(completedUrl,{},{}).then((response:HTTPResponse)=>{

          resolve(response);
        }).catch((e)=>{
          reject(e);
        });

      }).catch((error)=>{
        reject(error);
      });

    });
  }

  syncListOfInspTramp(listaDeInspeccionesTrampas:InspeccionTrampaNubeSubida[]){

    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{
        this.syncInfoService.getSyncInfo().then((info)=>{

          let paqueteDeSincronizacion = {
            registros:listaDeInspeccionesTrampas,
            informacionDeSincronizacion:[
              info
            ]
          };
    
          this.http.post(parametros.link_de_sincronizacion + this.urlToUpload, paqueteDeSincronizacion,{}).then((response:HTTPResponse) => {
            resolve(response);
          }).catch((error)=>{
            reject(error);
          });
  
        }).catch((error) =>{
          reject(error);
        });
      }).catch((error)=>{
        reject(error);
      });
      
    });
  }

  countLastDaysRecords(pais:string,lastDays:number){
      return new Promise((resolve,reject)=>{

        this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{


          this.http.get(parametros.link_de_sincronizacion+this.urlToCountRecords+'/'+pais+'/'+lastDays,{},{}).then((response:HTTPResponse)=>{
            let respuestaTransformada = JSON.parse(response.data);
            resolve(respuestaTransformada[0].CANTIDAD);
          }).catch((e)=>{
            reject(e);
          });

        }).catch((error)=>{
          reject(error);
        });

      });
  }

  getPagesQuantity(rowsPerPage:number,pais:string,lastDays:number){

    return new Promise((resolve,reject)=>{

        this.countLastDaysRecords(pais,lastDays).then((response:number)=>{
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

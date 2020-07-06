import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {InspeccionHlbNubeSubida} from '../../../DTO/server/InspeccionHlbNubeSubida';
import {SyncInfoService} from '../../services/syncInfo/sync-info.service';

@Injectable({
  providedIn: 'root'
})
export class InspeccionHlbNubeService {

  private urlToDownload = 'http://hlb.ticofrut.com/api/inspeccion_hlb/obtener_pagina/';
  private urlToUpload = 'http://hlb.ticofrut.com/api/inspeccion_hlb/sincronizar/';
  private urlToCountRecords = 'http://hlb.ticofrut.com/api/inspeccion_hlb/contarRegistros/';

  constructor(private http: HTTP,private syncInfoService:SyncInfoService) {
    this.http.setHeader('*', String("Accept"), String("application/json"));
    this.http.setDataSerializer('json');
  }
  
  getInspHlbPage(pageNumber:number,amountPerPage:number,oldDays:number,pais:string){

    console.log("Entró a intentar descargar inspecciones");

    return new Promise((resolve,reject)=>{
      let completedUrl = this.urlToDownload + pageNumber + '/' + amountPerPage+'/'+oldDays+'/'+pais;
      console.log("Estructura del request = "+completedUrl);
      this.http.get(completedUrl,{},{}).then((response:HTTPResponse)=>{
        console.log("Datos descargados = "+response.data);
        resolve(response);
      }).catch((e)=>{
        reject(e);
      });
    });
  }

  syncListOfInspHlb(listaDeInspeccionesHlb:InspeccionHlbNubeSubida[]){
    return new Promise((resolve,reject)=>{
      this.syncInfoService.getSyncInfo().then((info)=>{

        let paqueteDeSincronizacion = {
          registros:listaDeInspeccionesHlb,
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

  countLastDaysRecords(pais:string,lastDays:number){
      return new Promise((resolve,reject)=>{
      
        this.http.get(this.urlToCountRecords+'/'+pais+'/'+lastDays,{},{}).then((response:HTTPResponse)=>{
          let respuestaTransformada = JSON.parse(response.data);
          resolve(respuestaTransformada[0].CANTIDAD);
        }).catch((e)=>{
          reject(e);
        });

      });
  }

  getPagesQuantity(rowsPerPage:number,pais:string,lastDays:number){
    return new Promise((resolve,reject)=>{
      this.countLastDaysRecords(pais,lastDays).then((response:number)=>{
        let quantity = response;

        console.log("Cantidad de páginas insp hlb = "+quantity);

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

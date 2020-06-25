import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {InspeccionTrampaNubeSubida} from '../../../DTO/server/InspeccionTrampaNubeSubida';

@Injectable({
  providedIn: 'root'
})
export class InspeccionTrampaNubeService {

  private urlToDownload = 'http://hlb.ticofrut.com/api/inspeccion_trampas/obtener_pagina/';
  private urlToUpload = 'http://hlb.ticofrut.com/api/inspeccion_trampas/sincronizar/';
  private urlToCountRecords = 'http://hlb.ticofrut.com/api/inspeccion_trampas/contarRegistros/';

  constructor(private http: HTTP) {
    this.http.setHeader('*', String("Accept"), String("application/json"));
    this.http.setDataSerializer('json');
  }
  
  getInspTrampPage(pageNumber:number,amountPerPage:number,oldDays:number,pais:string){

    console.log("Entró a intentar descargar inspecciones de trampas amarillas");

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

  syncListOfInspTramp(listaDeInspeccionesTrampas:InspeccionTrampaNubeSubida[]){
    return new Promise((resolve,reject)=>{
      
      let paqueteDeSincronizacion = {
        registros:listaDeInspeccionesTrampas,
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

      this.http.post(this.urlToUpload, paqueteDeSincronizacion,{}).then((response:HTTPResponse) => {
        resolve(response);
      }).catch((error)=>{
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

        console.log("Cantidad de páginas insp trampas = "+quantity);

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

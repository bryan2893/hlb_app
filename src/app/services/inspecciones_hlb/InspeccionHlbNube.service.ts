import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {InspeccionHlbNubeSubida} from '../../../DTO/server/InspeccionHlbNubeSubida';

@Injectable({
  providedIn: 'root'
})
export class InspeccionHlbNubeService {

  private urlToDownload = 'http://hlb.ticofrut.com/api/inspeccion_hlb/obtener_pagina/';
  private urlToUpload = 'http://hlb.ticofrut.com/api/inspeccion_hlb/sincronizar/';
  private urlToCountRecords = 'http://hlb.ticofrut.com/api/inspeccion_hlb/contarRegistros/';

  constructor(private http: HTTP) {
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
        console.log("Encontró un error intentando obtener la página de registros: "+JSON.stringify(e));
        reject(e);
      });
    });
  }

  syncListOfInspHlb(listaDeInspeccionesHlb:InspeccionHlbNubeSubida[]){
    return new Promise((resolve,reject)=>{
      
      let paqueteDeSincronizacion = {
        registros:listaDeInspeccionesHlb,
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
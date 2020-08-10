import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {SyncInfoService} from '../syncInfo/sync-info.service';
import {Settings} from '../../../DTO/settings.dto';
import {AlmacenamientoNativoService} from '../../services/almacenamiento-interno/almacenamiento-nativo.service';
import {SyncInfo} from '../../../DTO/SyncInfo.dto';
import {ParaEnviarAlServerDTO} from '../../../DTO/trampa_amarilla/para-enviar-al-server.dto';

@Injectable({
  providedIn: 'root'
})
export class TrampaAmarillaNubeService {
  private urlToDownload = '/api/trampas_amarillas/obtener_pagina/';
  private urlToUpload = '/api/trampas_amarillas/sincronizar';
  private urlToCountRecords = '/api/trampas_amarillas/contarRegistros/';

  constructor(private http: HTTP,private syncInfoService:SyncInfoService,
    private almacenamientoNativoService:AlmacenamientoNativoService) {
    this.http.setHeader('*', String("Accept"), String("application/json"));
    this.http.setDataSerializer('json');
  }
  
  getTrapsPage(pageNumber:number,amountPerPage:number,pais:string):Promise<HTTPResponse>{

    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

        let completedUrl = parametros.link_de_sincronizacion + this.urlToDownload + pageNumber + '/' + amountPerPage+'/'+pais;
        this.http.get(completedUrl,{},{}).then((response:HTTPResponse)=>{
          resolve(response);
        }).catch((e)=>{
          reject(e);
        });

      }).catch((error) => {
        reject(error);
      });

    });

  }

  syncListOfTraps(listaDeTrampas:ParaEnviarAlServerDTO[]):Promise<HTTPResponse>{

    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

        this.syncInfoService.getSyncInfo().then((info:SyncInfo)=>{

          let paqueteDeSincronizacion = {
            registros:listaDeTrampas,
            informacionDeSincronizacion:[
              info
            ]
          };
    
          this.http.post(parametros.link_de_sincronizacion + this.urlToUpload, paqueteDeSincronizacion,{}).then((response:HTTPResponse) => {
            resolve(response);
          }).catch((error)=>{
            reject(JSON.stringify(error));
          });
  
        }).catch((error) =>{
          reject(error);
        });

      }).catch((error) => {
        reject(error);
      });

    });
  }

  countRecords(pais:string):Promise<number>{
      return new Promise((resolve,reject)=>{
      
        this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

          this.http.get(parametros.link_de_sincronizacion + this.urlToCountRecords+'/'+pais,{},{}).then((response:HTTPResponse)=>{
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

  getPagesQuantity(rowsPerPage:number,pais:string):Promise<number>{
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
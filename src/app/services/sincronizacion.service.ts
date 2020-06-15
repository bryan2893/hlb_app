import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {LocalDbService as TrampasAmarillasLocalService} from '../services/mantenimiento_trampas/local-db.service';
import {ExternalDbService as TrampasAmarillasExternalService} from '../services/mantenimiento_trampas/external-db.service';
import {LocalDbService as TraspatiosFincasLocalService} from '../services/mantenimientos_hlb/local-db.service';
import {ExternalDbService as TraspatiosFincasExternalService} from '../services/mantenimientos_hlb/external-db.service';

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  private rowsPerPage = 1000;

  constructor(private almacenamientoNativoService: AlmacenamientoNativoService,
    private trampasAmarillasLocalService:TrampasAmarillasLocalService,
    private trampasAmarillasExternalService:TrampasAmarillasExternalService,
    private traspatiosFincasLocalService:TraspatiosFincasLocalService,
    private traspatiosFincasExternalService:TraspatiosFincasExternalService) { }

  async sincronizarTodo(){
    try{
      let parametrosDeConfiguracion:any = await this.almacenamientoNativoService.estanLosParametrosListosParaUsar();
      if(parametrosDeConfiguracion === null){
        throw new Error("Favor verificar las configuraciones generales!");
      }else{
        let numPaginasTrampas:any = await this.trampasAmarillasLocalService.getPagesQuantityForNoSincronizedTraps(this.rowsPerPage);
        console.log("UNO: "+numPaginasTrampas);
        for(let i = 1;i<=numPaginasTrampas;i++){
          console.log("Si entro a UNO");
          let listaDetrampas:any;
          listaDetrampas = await this.trampasAmarillasLocalService.getNoSincronizedTrapsPage(i,this.rowsPerPage);
          await this.trampasAmarillasExternalService.syncListOfTraps(listaDetrampas);
        }

        let numPaginasTraspatiosFincas:any = await this.traspatiosFincasLocalService.getPagesQuantityForNoSincronizedTraspatiosFincas(this.rowsPerPage);
        console.log("DOS: "+numPaginasTraspatiosFincas);
        for(let i = 1;i<=numPaginasTraspatiosFincas;i++){
          console.log("Si entro a DOS");
          let listaDetraspatiosFincas:any;
          listaDetraspatiosFincas = await this.traspatiosFincasLocalService.getNoSincronizedTraspatiosFincasPage(i,this.rowsPerPage);
          await this.traspatiosFincasExternalService.syncListOfTraspatiosFincas(listaDetraspatiosFincas);
        }

        //Ahora se eliminan los registros de las tablas y se descargan los registros de la nube para agregarlos nuevamente.
        await this.trampasAmarillasLocalService.deleteAllInfo();
        await this.traspatiosFincasLocalService.deleteAllInfo();
        console.log("Se eliminaron los datos de las trampas y traspatiosFincas!!");


        //Ahora se descargan los registros para volver a insertarlos en la BD local.
        let trapsPagesQuantity = await this.trampasAmarillasExternalService.getPagesQuantity(this.rowsPerPage,parametrosDeConfiguracion.pais);
        console.log("TRES: "+trapsPagesQuantity);
        for(let i = 1;i<=trapsPagesQuantity;i++){
          console.log("Se insertaron trampas amarillas desde la nube");
          let listaDeTrampasAmarillas:any;
          let respuesta:any = await this.trampasAmarillasExternalService.getTrapsPage(i,this.rowsPerPage,parametrosDeConfiguracion.pais);
          listaDeTrampasAmarillas = JSON.parse(respuesta.data);
          await this.trampasAmarillasLocalService.insertManyTraps(listaDeTrampasAmarillas);
        }

        
        let traspatiosFincasPagesQuantity = await this.traspatiosFincasExternalService.getPagesQuantity(this.rowsPerPage,parametrosDeConfiguracion.pais);
        console.log("CUATRO: "+traspatiosFincasPagesQuantity);
        for(let i = 1;i<=traspatiosFincasPagesQuantity;i++){
          console.log("Se insertaron traspatios fincas desde la nube");
          let listaDeTraspatiosFincas:any;
          let respuesta:any = await this.traspatiosFincasExternalService.getTraspatiosFincasPage(i,this.rowsPerPage,parametrosDeConfiguracion.pais);
          listaDeTraspatiosFincas = JSON.parse(respuesta.data);
          await this.traspatiosFincasLocalService.insertManyTraspatiosFincas(listaDeTraspatiosFincas);
        }

      }
    }catch(error){
      throw error;
    }
    
  }

}

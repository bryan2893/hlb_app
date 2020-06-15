import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {LocalDbService as TrampasAmarillasLocalService} from '../services/mantenimiento_trampas/local-db.service';
import {ExternalDbService as TrampasAmarillasExternalService} from '../services/mantenimiento_trampas/external-db.service';
import {TrampaAmarillaNuevo} from '../../DTO/local/TrampaAmarillaNuevo.dto';

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  private rowsPerPage = 1000;

  constructor(private http: HTTP,
    private almacenamientoNativoService: AlmacenamientoNativoService,
    private trampasAmarillasLocalService:TrampasAmarillasLocalService,
    private trampasAmarillasExternalService:TrampasAmarillasExternalService) { }

  async sincronizarTodo(){
    let numPaginasTrampas:any;
    let pais:string;
    try{
      let parametrosDeConfiguracion:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
      if(parametrosDeConfiguracion === null){
        throw new Error("Configuraciones generales son necesarias para sincronizar!");
      }else{
        pais = parametrosDeConfiguracion.pais;
        //obtenerCantidadDeRegistros para obtener la cantidad de páginas que se deben descargar.
        numPaginasTrampas = await this.trampasAmarillasLocalService.getPagesQuantityForNoSincronizedTraps(this.rowsPerPage);
        for(let i = 1;i<=numPaginasTrampas;i++){
          let listaDetrampas:any;
          listaDetrampas = await this.trampasAmarillasLocalService.getNoSincronizedTrapsPage(i,this.rowsPerPage);
          await this.trampasAmarillasExternalService.syncListOfTraps(listaDetrampas);
        }
      }
    }catch(error){
      throw error;
    }
    
  }

}

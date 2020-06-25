import { Injectable } from '@angular/core';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';

import {TrampaAmarillaLocalService} from './trampas_amarillas/TrampaAmarillaLocal.service';
import {TrampaAmarillaNubeService} from './trampas_amarillas/TrampaAmarillaNube.service';
import {TraspatioFincaLocalService} from './traspatios_fincas/TraspatioFincaLocal.service';
import {TraspatioFincaNubeService} from './traspatios_fincas/TraspatioFincaNube.service';
import {InspeccionHlbLocalService} from './inspecciones_hlb/InspeccionHlbLocal.service';
import {InspeccionHlbNubeService} from './inspecciones_hlb/InspeccionHlbNube.service';
import {InspeccionTrampaLocalService} from './inspeccion_trampas/InspeccionTrampaLocal.service';
import {InspeccionTrampaNubeService} from './inspeccion_trampas/InspeccionTrampaNube.service';

import {DateService} from './date/date.service';

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  private rowsPerPage = 1000;//Indica que se deben descargar y subir registros de 1000 en 1000

  constructor(private almacenamientoNativoService: AlmacenamientoNativoService,
    private TrampaAmarillaLocalService:TrampaAmarillaLocalService,
    private TrampaAmarillaNubeService:TrampaAmarillaNubeService,
    private traspatiosFincasLocalService:TraspatioFincaLocalService,
    private traspatiosFincasNubeService:TraspatioFincaNubeService,
    private inspeccionHlbLocalService:InspeccionHlbLocalService,
    private inspeccionHlbNubeService:InspeccionHlbNubeService,
    private inspeccionTrampaLocalService:InspeccionTrampaLocalService,
    private inspeccionTrampaNubeService:InspeccionTrampaNubeService,
    private dateService:DateService) { }

  async sincronizarTodo(){
    try{
      let parametrosDeConfiguracion:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();

      //Se envian los registros de trampas amarillas...
      let numPaginasTrampas:any = await this.TrampaAmarillaLocalService.getPagesQuantityForNoSincronizedTraps(this.rowsPerPage);
      console.log("UNO: "+numPaginasTrampas);
      for(let i = 1;i<=numPaginasTrampas;i++){
        console.log("Si entro a UNO");
        let listaDetrampas:any;
        listaDetrampas = await this.TrampaAmarillaLocalService.getNoSincronizedTrapsPage(i,this.rowsPerPage);
        console.log("Llego antes del método para mandar a sincronizar!!");
        console.log("Esta es la lista de trampas antes de la sincronizacion = "+listaDetrampas);
        await this.TrampaAmarillaNubeService.syncListOfTraps(listaDetrampas);
      }

      //Se envian los registros de traspatios/fincas...
      let numPaginasTraspatiosFincas:any = await this.traspatiosFincasLocalService.getPagesQuantityForNoSincronizedTraspatiosFincas(this.rowsPerPage);
      console.log("DOS: "+numPaginasTraspatiosFincas);
      for(let i = 1;i<=numPaginasTraspatiosFincas;i++){
        console.log("Si entro a DOS");
        let listaDetraspatiosFincas:any;
        listaDetraspatiosFincas = await this.traspatiosFincasLocalService.getNoSincronizedTraspatiosFincasPage(i,this.rowsPerPage);
        console.log("Pasó bien por acá!");
        await this.traspatiosFincasNubeService.syncListOfTraspatiosFincas(listaDetraspatiosFincas);
        console.log("Llegó acá");
      }

      //Se envian los registros de inspecciones HLB
      let numPaginasInspTraspatiosFincas:any = await this.inspeccionHlbLocalService.getPagesQuantityForNoSincronizedHlbInspections(this.rowsPerPage);
      console.log("TRES: "+numPaginasInspTraspatiosFincas);
      for(let i = 1;i<=numPaginasInspTraspatiosFincas;i++){
        console.log("Si entro a TRES");
        let listaDeInsptraspatiosFincas:any;
        listaDeInsptraspatiosFincas = await this.inspeccionHlbLocalService.getNoSincronizedInspHlbPage(i,this.rowsPerPage);
        await this.inspeccionHlbNubeService.syncListOfInspHlb(listaDeInsptraspatiosFincas);
      }

      //Se envian los registros de inspecciones de trampas amarillas...
      let numPaginasInspeccionTrampas:any = await this.inspeccionTrampaLocalService.getPagesQuantityForNoSincronizedTrapsInspections(this.rowsPerPage);
      console.log("CUATRO: "+numPaginasInspeccionTrampas);
      for(let i = 1;i<=numPaginasInspeccionTrampas;i++){
        console.log("Si entro a CUATRO");
        let listaDeInspTrampas:any;
        listaDeInspTrampas = await this.inspeccionTrampaLocalService.getNoSincronizedInspTrampasPage(i,this.rowsPerPage);
        await this.inspeccionTrampaNubeService.syncListOfInspTramp(listaDeInspTrampas);
      }

      //Ahora se eliminan los registros de las tablas y se descargan los registros de la nube para agregarlos nuevamente.
      await this.TrampaAmarillaLocalService.deleteAllInfo();
      await this.traspatiosFincasLocalService.deleteAllInfo();
      await this.inspeccionHlbLocalService.deleteAllInfo();
      await this.inspeccionTrampaLocalService.deleteAllInfo();
      console.log("Se eliminaron los datos de las trampas,traspatiosFincas, inspecciones HLB e inspecciones de trampas!!");


      //Se descargan los registros de trampas amarillas y se insertan en la bd local...
      let trapsPagesQuantity = await this.TrampaAmarillaNubeService.getPagesQuantity(this.rowsPerPage,parametrosDeConfiguracion.pais);
      console.log("CINCO: "+trapsPagesQuantity);
      for(let i = 1;i<=trapsPagesQuantity;i++){
        console.log("Se insertaron trampas amarillas desde la nube");
        let listaDeTrampasAmarillas:any;
        let respuesta:any = await this.TrampaAmarillaNubeService.getTrapsPage(i,this.rowsPerPage,parametrosDeConfiguracion.pais);
        listaDeTrampasAmarillas = JSON.parse(respuesta.data);
        await this.TrampaAmarillaLocalService.insertManyTraps(listaDeTrampasAmarillas);
      }

      //Se descargan los registros de traspatios/fincas y se insertan en la bd local...
      let traspatiosFincasPagesQuantity = await this.traspatiosFincasNubeService.getPagesQuantity(this.rowsPerPage,parametrosDeConfiguracion.pais);
      console.log("SEIS: "+traspatiosFincasPagesQuantity);
      for(let i = 1;i<=traspatiosFincasPagesQuantity;i++){
        console.log("Se insertaron traspatios fincas desde la nube");
        let listaDeTraspatiosFincas:any;
        let respuesta:any = await this.traspatiosFincasNubeService.getTraspatiosFincasPage(i,this.rowsPerPage,parametrosDeConfiguracion.pais);
        listaDeTraspatiosFincas = JSON.parse(respuesta.data);
        await this.traspatiosFincasLocalService.insertManyTraspatiosFincas(listaDeTraspatiosFincas);
      }

      //Se descargan los registros de inspecciones HLB y se insertan en la bd local...
      let inspeccionesHlbPagesQuantity = await this.inspeccionHlbNubeService.getPagesQuantity(this.rowsPerPage,parametrosDeConfiguracion.pais,parametrosDeConfiguracion.volumen_de_registros);
      console.log("SIETE: "+inspeccionesHlbPagesQuantity);
      for(let i = 1;i<=inspeccionesHlbPagesQuantity;i++){
        console.log("Se insertaron inspecciones HLB desde la nube");
        let listaDeInspeccionesHlb:any;
        let respuesta:any = await this.inspeccionHlbNubeService.getInspHlbPage(i,this.rowsPerPage,parametrosDeConfiguracion.volumen_de_registros,parametrosDeConfiguracion.pais);
        listaDeInspeccionesHlb = JSON.parse(respuesta.data);
        await this.inspeccionHlbLocalService.insertManyHlbInspections(listaDeInspeccionesHlb);
      }

      //Se descargan los registros de inspecciones de trampas y se insertan en la bd local...
      let inspeccionesTrampasPagesQuantity = await this.inspeccionTrampaNubeService.getPagesQuantity(this.rowsPerPage,parametrosDeConfiguracion.pais,parametrosDeConfiguracion.volumen_de_registros);
      console.log("OCHO: "+inspeccionesTrampasPagesQuantity);
      for(let i = 1;i<=inspeccionesTrampasPagesQuantity;i++){
        console.log("Se insertaron inspecciones trampas desde la nube");
        let listaDeInspDeTrampas:any;
        let respuesta:any = await this.inspeccionTrampaNubeService.getInspTrampPage(i,this.rowsPerPage,parametrosDeConfiguracion.volumen_de_registros,parametrosDeConfiguracion.pais);
        listaDeInspDeTrampas = JSON.parse(respuesta.data);
        await this.inspeccionTrampaLocalService.insertManyTrapInspections(listaDeInspDeTrampas);
      }
      
      //Al terminar la sincronizacion se registra la fecha actual de sincronización.
      let currentDate = this.dateService.getCurrentDateOnly();
      await this.almacenamientoNativoService.almacenarFechaDeSincronizacion(currentDate);
      
    }catch(error){
      throw error;
    }
    
  }

}

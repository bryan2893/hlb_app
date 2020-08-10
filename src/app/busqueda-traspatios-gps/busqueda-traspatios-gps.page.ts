import { Component, OnInit } from '@angular/core';
import {TraspatioFincaLocalService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import { MapMetaData } from 'src/DTO/mapMetaData.dto';
import { PreviousUrlHolderService } from '../services/data/previous-url-holder.service';
import {ActivatedRoute,Router} from '@angular/router';
import {LoaderService} from '../services/loader.service';
import { AlertService } from '../services/alert/alert.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import { GpsService } from '../services/gps/gps.service';

@Component({
  selector: 'app-busqueda-traspatios-gps',
  templateUrl: './busqueda-traspatios-gps.page.html',
  styleUrls: ['./busqueda-traspatios-gps.page.scss'],
})
export class BusquedaTraspatiosGpsPage implements OnInit {

  mantains = [];
  coords:any;
  vieneDelMapa = false;

  constructor(private traspatioFincaLocalService:TraspatioFincaLocalService,
    private previousUrlHolderService:PreviousUrlHolderService,
    private router:Router,
    private route:ActivatedRoute,
    private loaderService:LoaderService,
    private alertService:AlertService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private gpsService:GpsService) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    if(this.vieneDelMapa){
      if (this.route.snapshot.data['data']) {
        this.coords = this.route.snapshot.data['data'];
        this.mostrarResultadosDeBusqueda();
        this.vieneDelMapa = false;
      }
    }
  }

  obtenerTraspatiosCercanos(){

  }

  async mostrarResultadosDeBusqueda(){

      let loading:any;
      try{
        
        loading = await this.loaderService.showLoader("Buscando...");
        await loading.present();

        let configuraciones:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();

        let radio_de_alcance = configuraciones.radio_de_alcance;
  
        let traspatiosFincasList:any = await this.traspatioFincaLocalService.getAllTraspatiosFincas();

        traspatiosFincasList.forEach((traspatioFinca:any) => {

          let distanciaEnMetros = Math.trunc(this.gpsService.getDistanceBetween(this.coords.latitud,this.coords.longitud,traspatioFinca.latitud,traspatioFinca.longitud,"K")*1000);

          if(distanciaEnMetros <= radio_de_alcance){
            traspatioFinca["distancia"] = distanciaEnMetros;
            this.mantains.push(traspatioFinca);
          }

        });
        
        await loading.dismiss();
      }catch(error){
        await loading.dismiss();
        let alert = await this.alertService.presentAlert(JSON.stringify(error));
        alert.present();
      }

  }

  openMap(){
    let dataToSendMapViewer:MapMetaData = {urlAnterior:"",tipo:"",coordenadas:null};

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_agregar";
    dataToSendMapViewer["coordenadas"] = null;

    this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
    this.mantains = [];
    this.vieneDelMapa = true;
  }

}

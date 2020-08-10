import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsAnimation,
  Marker,
  MyLocation
} from '@ionic-native/google-maps/ngx';
import {Router,ActivatedRoute} from '@angular/router';
import {LoaderService} from '../services/loader.service';

import {DataContainerService} from '../services/data/data-container.service';
import {MapMetaData} from '../../DTO/mapMetaData.dto';
import {MAP_ACTIONS} from '../../constants/map_actions';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.page.html',
  styleUrls: ['./map-viewer.page.scss']
})
export class MapViewerPage implements OnInit {
  latitud:number;
  longitud:number;
  map:GoogleMap;
  marker:Marker;

  dataFromPreviousPage:MapMetaData;

  constructor(private dataContainerService: DataContainerService,
    private router:Router,
    private route: ActivatedRoute,
    private loaderService:LoaderService) {
  }

  ionViewWillEnter(){
    if (this.route.snapshot.data['data']) {
      this.dataFromPreviousPage = this.route.snapshot.data['data'];
    }
  }

  ngOnInit() {
    try{
      this.loadMap();
    }catch(error){
      alert(error);
    }
    
  }

  async loadMap(){

    this.map = GoogleMaps.create('map', {});

    let loading = await this.loaderService.showLoader("Cargando mapa...");
    await loading.present();
    if(this.dataFromPreviousPage.tipo === MAP_ACTIONS.AGREGAR){
      await this.goToMyLocation();
    }else{
      this.goToADefineLocation();
    }
    await loading.dismiss();
      
  }

  goToMyLocation(){
      //this.map.clear();
      return this.map.getMyLocation().then((location:MyLocation)=>{

      //Mover la cámara animadamente
      this.map.animateCamera({
        target:location.latLng,
        zoom:17,
        tilt:30,
        duration:700
      });

      //Agregar un marcador
      let marker: Marker = this.map.addMarkerSync({
        icon:'green',
        //title: '@ionic-native/google-maps plugin!',
        snippet: 'Tu posicion actual',
        position: location.latLng,
        draggable: true,
        //animation: GoogleMapsAnimation.BOUNCE
      });

      this.marker = marker;

      //show the infoWindow
      //marker.showInfoWindow();

      /*
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        //this.showToast('clicked!');
        //alert("jaja");
      });
      */
      Promise.resolve(true);
    }).catch((error)=>{
      Promise.reject(false);
    });

  }

  goToADefineLocation(){

    this.map.animateCamera({
      target:this.dataFromPreviousPage.coordenadas,
      zoom:17,
      tilt:30,
      duration:700
    });

    let elMarcadorPuedeMoverse:boolean;

    if(this.dataFromPreviousPage.tipo === MAP_ACTIONS.EDITAR){
      elMarcadorPuedeMoverse = true;
    }
    if(this.dataFromPreviousPage.tipo === MAP_ACTIONS.VER){
      elMarcadorPuedeMoverse = false;
    }

    let marker: Marker = this.map.addMarkerSync({
      icon:'green',
      //title: '@ionic-native/google-maps plugin!',
      snippet: 'Posición registrada',
      position: this.dataFromPreviousPage.coordenadas,
      draggable: elMarcadorPuedeMoverse
      //animation: GoogleMapsAnimation.BOUNCE
    });

    this.marker = marker;

  }

  comeBackToPreviousPage(){
    this.dataContainerService.setData({accion:MAP_ACTIONS.DEVUELVE_COORDENADAS,coordenadas:{lat:this.marker.getPosition().lat,lng:this.marker.getPosition().lng}});
    this.router.navigateByUrl(this.dataFromPreviousPage.urlAnterior);
  }

}

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
import {PreviousUrlStructure} from '../../DTO/previuousUrlStructure.dto';

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

  dataFromPreviousPage:PreviousUrlStructure;

  previousUrlToComeBack:string;//url donde se debe regresar con las coordenadas obtenidas.

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
    //this.latitud = this.navParams.data.latitud;
    //this.longitud = this.navParams.data.longitud;
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
    if(this.dataFromPreviousPage.tipo === "vista_agregar"){
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
        duration:1000
      });

      //Agregar un marcador
      let marker: Marker = this.map.addMarkerSync({
        icon:'blue',
        //title: '@ionic-native/google-maps plugin!',
        snippet: 'Tu posicion actual',
        position: location.latLng,
        draggable: true,
        animation: GoogleMapsAnimation.BOUNCE
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

  //normalmente se utiliza cuando la vista anterior a esta es de editar donde las coordenadas ya se encuentran guardadas.
  goToADefineLocation(){

    this.map.animateCamera({
      target:this.dataFromPreviousPage.coordenadas,
      zoom:17,
      tilt:30,
      duration:1000
    });

    let marker: Marker = this.map.addMarkerSync({
      icon:'blue',
      //title: '@ionic-native/google-maps plugin!',
      snippet: 'Tu posicion actual',
      position: this.dataFromPreviousPage.coordenadas,
      draggable: true,
      animation: GoogleMapsAnimation.BOUNCE
    });

    this.marker = marker;

  }

  getCurrentPositionAndGetOut(){
    this.dataContainerService.setData({latitud:this.marker.getPosition().lat,longitud:this.marker.getPosition().lng});
    this.router.navigateByUrl(this.dataFromPreviousPage.urlAnterior);
  }

}

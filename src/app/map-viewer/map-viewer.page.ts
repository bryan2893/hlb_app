import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsAnimation,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  MyLocation
} from '@ionic-native/google-maps/ngx';
import {DataContainerService} from '../services/data/data-container.service';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.page.html',
  styleUrls: ['./map-viewer.page.scss'],
})
export class MapViewerPage implements OnInit {
  latitud:number;
  longitud:number;
  map:GoogleMap;
  marker:Marker;

  previousUrlToComeBack:string;//url donde se debe regresar con las coordenadas obtenidas.

  constructor(private dataContainerService: DataContainerService,private router:Router,private route: ActivatedRoute) {//

  }

  ionViewWillEnter(){
    if (this.route.snapshot.data['data']) {
      this.previousUrlToComeBack = this.route.snapshot.data['data'];
    }
  }

  ngOnInit() {
    //this.latitud = this.navParams.data.latitud;
    //this.longitud = this.navParams.data.longitud;
    this.loadMap();
  }

  loadMap(){

    this.map = GoogleMaps.create('map', {
      // camera: {
      //   target: {
      //     lat: 43.0741704,
      //     lng: -89.3809802
      //   },
      //   zoom: 18,
      //   tilt: 30
      // }
    });
    this.goToMyLocation();
      
  }

  goToMyLocation(){
      //this.map.clear();
      this.map.getMyLocation().then((location:MyLocation)=>{

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
        title: '@ionic-native/google-maps plugin!',
        snippet: 'This plugin is awesome!',
        position: location.latLng,
        draggable: true,
        animation: GoogleMapsAnimation.BOUNCE
      });

      this.marker = marker;

      //show the infoWindow
      marker.showInfoWindow();

      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        //this.showToast('clicked!');
        //alert("jaja");
      });

    }).catch((error)=>{

    });

  }

  getCurrentPositionAndGetOut(){
    this.dataContainerService.setData({latitud:this.marker.getPosition().lat,longitud:this.marker.getPosition().lng});
    this.router.navigateByUrl(this.previousUrlToComeBack);
  }

}

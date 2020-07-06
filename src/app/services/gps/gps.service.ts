import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  constructor() { }

  private degreesToRadians(degrees:number){
    return degrees * Math.PI / 180;
  }

  public distanceInKmBetweenEarthCoordinates(lat1:number, lon1:number, lat2:number, lon2:number){
    var earthRadiusKm = 6371;

    let dLat = this.degreesToRadians(lat2-lat1);
    let dLon = this.degreesToRadians(lon2-lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return earthRadiusKm * c;
    
  }

  public getDistanceBetween(lat1:number, lon1:number, lat2:number, lon2:number,unidadMedida:string){

    let radlat1 = Math.PI * lat1 / 180;
    let radlat2 = Math.PI * lat2 / 180;

    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;

    let theta = lon1 - lon2;
    let radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    if (unidadMedida == "K") dist = dist * 1.609344;
    if (unidadMedida == "N") dist = dist * 0.8684;

    if (isNaN(dist)) dist = 0;

    return dist;
    
  }

}

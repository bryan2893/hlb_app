import { Injectable } from '@angular/core';
import {AlmacenamientoNativoService} from '../../services/almacenamiento-interno/almacenamiento-nativo.service';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private almacenamientoInternoService:AlmacenamientoNativoService) { }

  getCurrentDateTime(){
    let today = new Date();
    let año = today.getFullYear();
    let mes = today.getMonth()+1;
    let dia = today.getDate();
    let horas = today.getHours();
    let minutos = today.getMinutes();
    let segundos = today.getSeconds();

    let mesAguardar = "";
    let añoAguardar = "";
    let diaAguardar = "";
    let horasAguardar = "";
    let minutosAguardar = "";
    let segundosAguardar = "";
    if(mes<10){
      mesAguardar = '0'+mes;
    }else{
      mesAguardar += mes;
    }
    añoAguardar += año;
    if(dia<10){
      diaAguardar = '0'+dia;
    }else{
      diaAguardar += dia;
    }
    if(horas<10){
      horasAguardar = '0'+horas;
    }else{
      horasAguardar += horas;
    }
    if(minutos<10){
      minutosAguardar = '0'+minutos;
    }else{
      minutosAguardar += minutos;
    }
    if(segundos<10){
      segundosAguardar = '0'+segundos;
    }else{
      segundosAguardar += segundos;
    }

    var date = añoAguardar+'-'+mesAguardar+'-'+diaAguardar;
    var time = horasAguardar + ":" + minutosAguardar + ":" + segundosAguardar;
    var dateTime = date+'T'+time;
    return dateTime;
  }

  getCurrentDateOnly(){
    let today = new Date();
    let año = today.getFullYear();
    let mes = today.getMonth()+1;
    let dia = today.getDate();

    let mesAguardar = "";
    let añoAguardar = "";
    let diaAguardar = "";

    if(mes<10){
      mesAguardar = '0'+mes;
    }else{
      mesAguardar += mes;
    }
    añoAguardar += año;
    if(dia<10){
      diaAguardar = '0'+dia;
    }else{
      diaAguardar += dia;
    }

    let date = añoAguardar+'-'+mesAguardar+'-'+diaAguardar;
    return date;

  }

  //Verifica que no se excedan el numero de días segun la fecha de ultima sincronizacion y y la fecha actual de la consulta.
  isValidDateRestriction(diasPermitidos:number){

    return new Promise((resolve,reject)=>{
        this.almacenamientoInternoService.obtenerUltimaFechaDeSincronizacion().then((fechaUltimaSincronizacion:string)=>{

          var date1 = new Date(fechaUltimaSincronizacion);
          var date2 = new Date(this.getCurrentDateOnly());
          
          let Difference_In_Time = date2.getTime() - date1.getTime();

          let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

          if(Difference_In_Days > diasPermitidos){
            resolve(false);
          }else{
            resolve(true);
          }
      }).catch((error)=>{
        reject(error);
      });
    });

  }

}

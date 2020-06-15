import { Component, OnInit } from '@angular/core';
import Settings from '../../DTO/settings.dto';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  seetingsForm: FormGroup;

  constructor(private almacenamientoNativoService: AlmacenamientoNativoService, private formBuilder: FormBuilder) {

    this.seetingsForm = this.formBuilder.group({
      radio_de_alcance:[''],
      volumen_de_registros:[''],
      link_de_sincronizacion:[''],
      pais:['costa rica'],
      dias_permitidos:[''],
      version:['']
    });

  }

  ngOnInit(){}

  
  ionViewWillEnter(){
    this.getSettings();
  }

  validarParametros(parametrosDeConfiguracion:Settings){
    if(parametrosDeConfiguracion.radio_de_alcance === null
     || parametrosDeConfiguracion.volumen_de_registros === null 
     || parametrosDeConfiguracion.link_de_sincronizacion === null 
     || parametrosDeConfiguracion.pais === null 
     || parametrosDeConfiguracion.dias_permitidos === null 
     || parametrosDeConfiguracion.version === null){
       return false;
     }else{
       return true;
     }
  }
  

  saveSettings(parametrosDeConfiguracion:Settings){

    console.log(this.validarParametros(parametrosDeConfiguracion));
    console.log(parametrosDeConfiguracion);

    if(this.validarParametros(parametrosDeConfiguracion)){
      this.almacenamientoNativoService.almacenarParametrosDeConfiguracion(parametrosDeConfiguracion).then((respuesta)=>{
        alert("Cofiguraciones almacenadas!!");
      }).catch((error)=>{
        alert("Problema al intentar guardar las configuraciones!");
      });
    }else{
      alert("Todos los campos son obligatorios!");
    }
  }

  getSettings(){
    this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametrosDeConfiguracion)=>{
      if(parametrosDeConfiguracion){
        this.seetingsForm.setValue(parametrosDeConfiguracion);
      }
    }).catch((error)=>{
      alert(error.message);
    });
  }

  submit(){
    let settings:Settings;
    settings = this.seetingsForm.value;
    this.saveSettings(settings);
  }

}

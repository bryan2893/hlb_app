import { Component, OnInit } from '@angular/core';
import {Settings} from '../../DTO/settings.dto';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {ToastService} from '../services/toast-service/toast.service';
import {AlertService} from '../services/alert/alert.service';

import {AuthService} from '../services/auth/auth.service';
import {ACTIONS} from '../../constants/user_actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  seetingsForm: FormGroup;
  actions = ACTIONS;

  constructor(private almacenamientoNativoService: AlmacenamientoNativoService,
    private formBuilder: FormBuilder,
    private toastService:ToastService,
    private alertService:AlertService,
    private authService:AuthService) {

    this.seetingsForm = this.formBuilder.group({
      radio_de_alcance:[''],
      volumen_de_registros:[''],
      link_de_sincronizacion:[''],
      pais:['COSTA RICA'],
      dias_permitidos:[''],
      version:['']
    });

  }

  ngOnInit(){}

  
  ionViewWillEnter(){
    this.getSettings();
  }
  

  saveSettings(parametrosDeConfiguracion:Settings){
    
    
      this.almacenamientoNativoService.almacenarParametrosDeConfiguracion(parametrosDeConfiguracion).then(()=>{
        this.toastService.showToast("Cofiguraciones guardadas!").then((toast)=>{
          toast.present();
        });
      }).catch((error)=>{
        this.alertService.presentAlert(error.message).then((alert)=>{
          alert.present();
        });
      });
    
  }

  getSettings(){
    this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametrosDeConfiguracion)=>{
      this.seetingsForm.setValue(parametrosDeConfiguracion);
    }).catch((error)=>{
      //No se hace nada ya que no hay parametros registrados!!
    });
  }

  submit(){
    let settings:Settings;
    settings = this.seetingsForm.value;
    this.saveSettings(settings);
  }

}

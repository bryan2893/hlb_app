import { Component, OnInit } from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import Settings from '../../DTO/settings.dto';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  seetingsForm: FormGroup;

  constructor(private nativeStorage: NativeStorage, private formBuilder: FormBuilder) {

    this.seetingsForm = this.formBuilder.group({
      radio_de_alcance:[''],
      volumen_de_registros:[''],
      link_de_sincronizacion:[''],
      pais:['costa rica'],
      dias_permitidos:[''],
      version:['']
    });

  }

  ngOnInit() {
    this.nativeStorage.keys().then((data)=>{
      if(data.length > 0){
        this.getSettings();
      }
    })
  }

  saveSettings(configuracion:Settings){
    this.nativeStorage.setItem('settings',configuracion).then(()=> {
      alert("Cofiguraciones almacenadas!!");
    }).catch(()=>{
      alert("Problema al intentar guardar las configuraciones!");
    });
  }

  getSettings(){
    this.nativeStorage.getItem('settings').then((data)=> {
      let seetings:Settings;
      seetings = data;
      this.seetingsForm.setValue(seetings);
    }).catch(()=>{
      alert("Problema al intentar obtener las configuraciones!");
    });
  }

  submit(){
    let settings:Settings;
    settings = this.seetingsForm.value;
    this.saveSettings(settings);
  }

}

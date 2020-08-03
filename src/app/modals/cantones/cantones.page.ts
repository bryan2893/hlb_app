import { Component, OnInit } from '@angular/core';
import {ModalController,NavParams} from '@ionic/angular';
import {TraspatioFincaLocalService} from '../../services/traspatios_fincas/TraspatioFincaLocal.service';

@Component({
  selector: 'app-cantones',
  templateUrl: './cantones.page.html',
  styleUrls: ['./cantones.page.scss'],
})
export class CantonesPage implements OnInit {

  modalTitle:string;

  lista_cantones = [];
  lista_respaldo = [];
  provincia:string;
  tituloCabecera:string;
  

  constructor(private modalController:ModalController,private navParams:NavParams,
    private traspatiosFincasLocalService:TraspatioFincaLocalService) { }

  ngOnInit() {
    this.provincia = this.navParams.data.provincia;

    this.traspatiosFincasLocalService.getCantones(this.provincia).then((data:any)=>{
      this.lista_cantones = data;
      this.lista_respaldo = data;
    });
  }

  onItemClick(canton:string){
    this.closeModal(canton);
  }

  whenUserPressAKey(event:any){
    let value = event.target.value.toUpperCase();

    if(value !== ''){
      let arrayTemporal = this.lista_cantones.slice();
      this.lista_cantones = arrayTemporal.filter((nombre) => {
        return nombre.includes(value);
      });
    }else{
      this.lista_cantones = this.lista_respaldo.slice();
    }
    
  }

  async closeModal(canton:string){
    await this.modalController.dismiss(canton);
  }

}

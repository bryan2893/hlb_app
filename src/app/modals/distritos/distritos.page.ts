import { Component, OnInit } from '@angular/core';
import {ModalController,NavParams} from '@ionic/angular';
import {TraspatioFincaLocalService} from '../../services/traspatios_fincas/TraspatioFincaLocal.service';

@Component({
  selector: 'app-distritos',
  templateUrl: './distritos.page.html',
  styleUrls: ['./distritos.page.scss'],
})
export class DistritosPage implements OnInit {

  modalTitle:string;

  lista_distritos = [];
  lista_respaldo = [];
  canton:string;
  tituloCabecera:string;
  

  constructor(private modalController:ModalController,private navParams:NavParams,
    private traspatiosFincasLocalService:TraspatioFincaLocalService) { }

  ngOnInit() {
    this.canton = this.navParams.data.canton;

    this.traspatiosFincasLocalService.getDistritos(this.canton).then((data:any)=>{
      this.lista_distritos = data;
      this.lista_respaldo = data;
    });
  }

  onItemClick(distrito:string){
    this.closeModal(distrito);
  }

  whenUserPressAKey(event:any){
    let value = event.target.value.toUpperCase();

    if(value !== ''){
      let arrayTemporal = this.lista_distritos.slice();
      this.lista_distritos = arrayTemporal.filter((nombre) => {
        return nombre.includes(value);
      });
    }else{
      this.lista_distritos = this.lista_respaldo.slice();
    }
    
  }

  async closeModal(distrito:string){
    await this.modalController.dismiss(distrito);
  }

}

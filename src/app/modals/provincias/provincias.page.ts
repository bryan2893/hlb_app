import { Component, OnInit } from '@angular/core';
import {ModalController,NavParams} from '@ionic/angular';
import {TraspatioFincaLocalService} from '../../services/traspatios_fincas/TraspatioFincaLocal.service';

@Component({
  selector: 'app-provincias',
  templateUrl: './provincias.page.html',
  styleUrls: ['./provincias.page.scss'],
})
export class ProvinciasPage implements OnInit {

  modalTitle:string;

  lista_provincias = [];
  lista_respaldo = [];
  tipo:string;
  tituloCabecera:string;
  

  constructor(private modalController:ModalController,private navParams:NavParams,
    private traspatiosFincasLocalService:TraspatioFincaLocalService) { }

  ngOnInit() {
    this.tipo = this.navParams.data.tipo;

    this.traspatiosFincasLocalService.getProvincias().then((data:any)=>{
      this.lista_provincias = data;
      this.lista_respaldo = data;
    });
  }

  onItemClick(provincia:string){
    this.closeModal(provincia);
  }

  whenUserPressAKey(event:any){
    let value = event.target.value.toUpperCase();

    if(value !== ''){
      let arrayTemporal = this.lista_provincias.slice();
      this.lista_provincias = arrayTemporal.filter((nombre) => {
        return nombre.includes(value);
      });
    }else{
      this.lista_provincias = this.lista_respaldo.slice();
    }
    
  }

  async closeModal(provincia:string){
    await this.modalController.dismiss(provincia);
  }

}

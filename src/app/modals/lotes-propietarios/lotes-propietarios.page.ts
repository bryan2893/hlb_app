import { Component, OnInit } from '@angular/core';
import {ModalController,NavParams} from '@ionic/angular';
import {TraspatioFincaLocalService} from '../../services/traspatios_fincas/TraspatioFincaLocal.service';

@Component({
  selector: 'app-lotes-propietarios',
  templateUrl: './lotes-propietarios.page.html',
  styleUrls: ['./lotes-propietarios.page.scss'],
})
export class LotesPropietariosPage implements OnInit {

  modalTitle:string;

  lista_propietarios_lotes = [];
  lista_respaldo = [];
  poblado_finca:string;
  tituloCabecera:string;
  

  constructor(private modalController:ModalController,private navParams:NavParams,
    private traspatiosFincasLocalService:TraspatioFincaLocalService) { }

  ngOnInit() {
    this.poblado_finca = this.navParams.data.finca_poblado;

    this.traspatiosFincasLocalService.getPropietariosLotesByFincaPobladoName(this.poblado_finca).then((data:any)=>{
      this.lista_propietarios_lotes = data;
      this.lista_respaldo = data;
    });

  }

  onItemClick(propietario_lote:string){
    this.closeModal(propietario_lote);
  }

  whenUserPressAKey(event:any){
    let value = event.target.value.toUpperCase();

    if(value !== ''){
      let arrayTemporal = this.lista_propietarios_lotes.slice();
      this.lista_propietarios_lotes = arrayTemporal.filter((nombre) => {
        return nombre.includes(value);
      });
    }else{
      this.lista_propietarios_lotes = this.lista_respaldo.slice();
    }
    
  }

  async closeModal(propietario_lote:string){
    await this.modalController.dismiss(propietario_lote);
  }

}

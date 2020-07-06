import { Component, OnInit } from '@angular/core';
import {ModalController,NavParams} from '@ionic/angular';
import {TraspatioFincaLocalService} from '../../services/traspatios_fincas/TraspatioFincaLocal.service';

@Component({
  selector: 'app-fincas-poblados',
  templateUrl: './fincas-poblados.page.html',
  styleUrls: ['./fincas-poblados.page.scss'],
})
export class FincasPobladosPage implements OnInit {
  modalTitle:string;

  lista_fincas_poblados = [];
  lista_respaldo = [];
  tipo:string;
  tituloCabecera:string;
  

  constructor(private modalController:ModalController,private navParams:NavParams,
    private traspatiosFincasLocalService:TraspatioFincaLocalService) { }

  ngOnInit() {

    this.tituloCabecera = this.navParams.data.cabecera;
    this.tipo = this.navParams.data.tipo;

    this.traspatiosFincasLocalService.getTraspatiosFincasByType(this.tipo).then((data:any)=>{
      this.lista_fincas_poblados = data;
      this.lista_respaldo = data;
    });

  }

  onItemClick(finca_poblado:string){
    this.closeModal(finca_poblado);
  }

  whenUserPressAKey(event:any){
    let value = event.target.value.toUpperCase();

    if(value !== ''){
      let arrayTemporal = this.lista_fincas_poblados.slice();
      this.lista_fincas_poblados = arrayTemporal.filter((nombre) => {
        return nombre.includes(value);
      });
    }else{
      this.lista_fincas_poblados = this.lista_respaldo.slice();
    }
    
  }

  async closeModal(finca_poblado:string){
    await this.modalController.dismiss(finca_poblado);
  }

}

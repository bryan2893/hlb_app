import { Component, OnInit } from '@angular/core';
import {ModalController,NavParams} from '@ionic/angular';

@Component({
  selector: 'app-fincas-poblados',
  templateUrl: './fincas-poblados.page.html',
  styleUrls: ['./fincas-poblados.page.scss'],
})
export class FincasPobladosPage implements OnInit {
  modalTitle:string;

  constructor(private modalController:ModalController,private navParams:NavParams) { }

  ngOnInit() {
    console.log(JSON.stringify(this.navParams.data));
  }

  async closeModal(){
    const onClosedData: string = "Probando";
    await this.modalController.dismiss(onClosedData);
  }

}

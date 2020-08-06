import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ModalController} from '@ionic/angular';
import {ProvinciasPage} from '../modals/provincias/provincias.page';
import {CantonesPage} from '../modals/cantones/cantones.page';
import {DistritosPage} from '../modals/distritos/distritos.page';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {LotesPropietariosPage} from '../modals/lotes-propietarios/lotes-propietarios.page';
import { TrampaAmarillaLocalService } from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import { PreviousUrlHolderService } from '../services/data/previous-url-holder.service';
import { AlmacenamientoNativoService } from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import { AlertService } from '../services/alert/alert.service';
import { ToastService } from '../services/toast-service/toast.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';
import { DateService } from '../services/date/date.service';
import {TrampaAmarillaConIdLocalDTO} from '../../DTO/trampa_amarilla/trampa-amarilla-con-id-local.dto';

import {AuthService} from '../services/auth/auth.service';
import {ACTIONS} from '../../constants/user_actions';
import { Settings } from '../../DTO/settings.dto';

@Component({
  selector: 'app-ver-editar-trampa-amarilla',
  templateUrl: './ver-editar-trampa-amarilla.page.html',
  styleUrls: ['./ver-editar-trampa-amarilla.page.scss'],
})
export class VerEditarTrampaAmarillaPage implements OnInit {


  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";
  addTrapForm: FormGroup;
  trapRecord:TrampaAmarillaConIdLocalDTO;
  actions = ACTIONS;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private trampaAmarillaLocalService:TrampaAmarillaLocalService,
    private modalController:ModalController,
    private authService:AuthService,
    private dateService:DateService) {

      this.addTrapForm = this.formBuilder.group({
        num_trampa:[''],
        tipo:['',Validators.required],
        pais:['',Validators.required],
        finca_poblado:['',Validators.required],
        lote_propietario:['',Validators.required],
        latitud:['',Validators.required],
        longitud:['',Validators.required],
        estado:['',Validators.required],
        provincia:['',Validators.required],
        canton:['',Validators.required],
        distrito:['',Validators.required]
      });
  }

  changeType(event:any){

      let tipo = event.target.value;
      
      if(tipo === "TRASPATIO"){
        this.poblado_finca_key = "Poblado";
        this.lote_propietario_key = "Propietario";
      }

      if(tipo === "PRODUCTOR" || tipo === "TICOFRUT"){
        this.poblado_finca_key = "Finca";
        this.lote_propietario_key = "Lote";
      }

  }

  async ionViewWillEnter(){
    let inData = this.route.snapshot.data['data'];
    if (inData) {
      if(Object.keys(inData).length === 2){//Quiere decir que viene de la vista mapa
        this.addTrapForm.controls['latitud'].patchValue(inData.latitud);
        this.addTrapForm.controls['longitud'].patchValue(inData.longitud);
      }
    }
  }

  ionViewDidEnter(){
    let inData = this.route.snapshot.data['data'];
    if (inData) {
      if(!(Object.keys(inData).length === 2)){//Si la vista anterior no es la vista mapa...
        this.trapRecord = inData;
        if (this.trapRecord.tipo === "TRASPATIO"){
          this.poblado_finca_key = "Poblado";
          this.lote_propietario_key = "Propietario";
        }else{
           this.poblado_finca_key = "Finca";
           this.lote_propietario_key = "Lote";
        }
        
        this.addTrapForm.controls['num_trampa'].patchValue(inData.num_trampa);
        this.addTrapForm.controls['tipo'].patchValue(inData.tipo);
        this.addTrapForm.controls['pais'].patchValue(inData.pais);
        this.addTrapForm.controls['finca_poblado'].patchValue(inData.finca_poblado);
        this.addTrapForm.controls['lote_propietario'].patchValue(inData.lote_propietario);
        this.addTrapForm.controls['latitud'].patchValue(inData.latitud);
        this.addTrapForm.controls['longitud'].patchValue(inData.longitud);
        this.addTrapForm.controls['estado'].patchValue(inData.estado);
        this.addTrapForm.controls['provincia'].patchValue(inData.provincia);
        this.addTrapForm.controls['canton'].patchValue(inData.canton);
        this.addTrapForm.controls['distrito'].patchValue(inData.distrito);
      }

    }

  }

  ngOnInit() {
  }

  async submit(){

    try{

      if(this.addTrapForm.valid){

        let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        let pais:string = parametrosDeConfiguracion.pais;

        let puedeSincronizar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

        if(!puedeSincronizar){
          throw new Error("Sincroniza primero y vuelve a intentarlo");
        }

        let trampaToSave:any = {};

        trampaToSave['id_trampa'] = this.trapRecord.id_trampa;
        trampaToSave['num_trampa'] = this.addTrapForm.controls['num_trampa'].value;
        trampaToSave['tipo'] = this.addTrapForm.controls['tipo'].value.toUpperCase();
        trampaToSave['pais'] = pais.toUpperCase();
        trampaToSave['finca_poblado'] = this.addTrapForm.controls['finca_poblado'].value.toUpperCase();
        trampaToSave['lote_propietario'] = this.addTrapForm.controls['lote_propietario'].value.toUpperCase();
        trampaToSave['latitud'] = this.addTrapForm.controls['latitud'].value;
        trampaToSave['longitud'] = this.addTrapForm.controls['longitud'].value;
        trampaToSave['estado'] = this.addTrapForm.controls['estado'].value;
        trampaToSave['provincia'] = this.addTrapForm.controls['provincia'].value;
        trampaToSave['canton'] = this.addTrapForm.controls['canton'].value;
        trampaToSave['distrito'] = this.addTrapForm.controls['distrito'].value;
        trampaToSave['sincronizado'] = 0;
        
        await  this.trampaAmarillaLocalService.updateATrap(this.trapRecord.id_local,trampaToSave);
        let toast = await this.toastService.showToast("Registro modificado exitosamente!");
        await toast.present();
        
      }else{
        let alert = await this.alertService.presentAlert("Verifique que los datos están completos!");
        await alert.present();
      }

    }catch(error){
      let alert = await this.alertService.presentAlert(error);
      await alert.present();
    }
  }

  async openProvinciasModal() {
    const modal = await this.modalController.create({
      component: ProvinciasPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null && !dataReturned.role) {
        if (dataReturned.data !== ""){
          this.addTrapForm.controls['provincia'].patchValue(dataReturned.data);
        }
      }
    });

    return await modal.present();
  }

  async openCantonesModal() {

    let provincia = "";
    provincia = this.addTrapForm.controls['provincia'].value;

    if(provincia !== ""){
      const modal = await this.modalController.create({
        component: CantonesPage,
        componentProps: {
          "provincia": provincia
        }
      });
  
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && !dataReturned.role) {
          if (dataReturned.data !== ""){
            this.addTrapForm.controls['canton'].patchValue(dataReturned.data);
          }
        }
      });
  
      return await modal.present();
    }
  }

  async openDistritosModal() {

    let canton = "";
    canton = this.addTrapForm.controls['canton'].value;

    if(canton !== ""){
      const modal = await this.modalController.create({
        component: DistritosPage,
        componentProps: {
          "canton": canton
        }
      });
  
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && !dataReturned.role) {
          if (dataReturned.data !== ""){
            this.addTrapForm.controls['distrito'].patchValue(dataReturned.data);
          }
        }
      });
  
      return await modal.present();
    }

  }

  async openPobladosFincasModal() {

    let distrito = "";
    distrito = this.addTrapForm.controls['distrito'].value;

    if(distrito !== ""){
      const modal = await this.modalController.create({
        component: FincasPobladosPage,
        componentProps: {
          "tipo": this.addTrapForm.controls['tipo'].value.toUpperCase(),
          "distrito": distrito
        }
      });
  
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && !dataReturned.role) {
          if (dataReturned.data !== ""){
            this.addTrapForm.controls['finca_poblado'].patchValue(dataReturned.data);
          }
        }
      });
  
      return await modal.present();
    }

  }

  async openPropieatariosLotesModal() {

    let finca_poblado = "";
    finca_poblado = this.addTrapForm.controls['finca_poblado'].value;

    if(finca_poblado !== ""){
      const modal = await this.modalController.create({
        component: LotesPropietariosPage,
        componentProps: {
          "finca_poblado":finca_poblado
        }
      });
  
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && !dataReturned.role) {
          if (dataReturned.data !== ""){
            this.addTrapForm.controls['lote_propietario'].patchValue(dataReturned.data);
          }
        }
      });
  
      return await modal.present();
    }
  }

  openMap(){
    let dataToSendMapViewer:PreviousUrlStructure = {urlAnterior:"",tipo:"",coordenadas:null};
    let coords = {lat:this.addTrapForm.get("latitud").value,lng:this.addTrapForm.get("longitud").value}

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_editar";
    dataToSendMapViewer["coordenadas"] = coords;

    this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
  }

}

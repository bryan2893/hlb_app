import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {ProvinciasPage} from '../modals/provincias/provincias.page';
import {CantonesPage} from '../modals/cantones/cantones.page';
import {DistritosPage} from '../modals/distritos/distritos.page';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {LotesPropietariosPage} from '../modals/lotes-propietarios/lotes-propietarios.page';
import { MapMetaDataHolderService } from '../services/data/map-metadata-container.service';
import { AlmacenamientoNativoService } from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import { AlertService } from '../services/alert/alert.service';
import { ToastService } from '../services/toast-service/toast.service';
import { TraspatioFincaLocalService } from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import { MapMetaData } from 'src/DTO/mapMetaData.dto';
import {DateService} from '../services/date/date.service';
import {Settings} from '../../DTO/settings.dto';
import {TraspatioFincaConIdLocalDTO} from '../../DTO/traspatio_finca/traspatio-finca-con-id-local.dto';

import {AuthService} from '../services/auth/auth.service';
import {USER_ACTIONS} from '../../constants/user_actions';

@Component({
  selector: 'app-ver-editar-traspatio-finca',
  templateUrl: './ver-editar-traspatio-finca.page.html',
  styleUrls: ['./ver-editar-traspatio-finca.page.scss'],
})
export class VerEditarTraspatioFincaPage implements OnInit {

  //tipo:string;
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";
  isSelectPobladoFincaActive = true;
  isSelectPropietarioLoteActive = true;
  poblados_fincas = [];
  propietarios_lotes = [];
  traspatioFincaForm: FormGroup;
  traspatioFincaRecord:TraspatioFincaConIdLocalDTO;//al inicair la vista se iguala esta variable a un registro de traspatio/finca.
  actions = USER_ACTIONS;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private previousUrlHolderService:MapMetaDataHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    public modalController:ModalController,
    private traspatioFincaLocalService:TraspatioFincaLocalService,
    private authService:AuthService,
    private dateService:DateService) {
      this.traspatioFincaForm = this.formBuilder.group({
        tipo:['',Validators.required],
        pais:['',Validators.required],
        provincia:['',Validators.required],
        canton:['',Validators.required],
        distrito:['',Validators.required],
        finca_poblado:['',Validators.required],
        lote_propietario:['',Validators.required],
        latitud:['',Validators.required],
        longitud:['',Validators.required]
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
  
    //Antes de que la vista se muestre.
    async ionViewWillEnter(){
      let inData = this.route.snapshot.data['data'];
      if (inData) {
        if(Object.keys(inData).length === 2){//La anterior vista fue la vista mapa.
          this.traspatioFincaForm.controls['latitud'].patchValue(inData.latitud);
          this.traspatioFincaForm.controls['longitud'].patchValue(inData.longitud);
        }
      }
    }
  
    //Cuando la vista se ha mostrado.
    ionViewDidEnter(){
      let inData:any = this.route.snapshot.data['data'];
      if (inData) {
        if(!(Object.keys(inData).length === 2)){//Ingresa si la anterior vista no es la vista del mapa.
          this.traspatioFincaRecord = inData;
          if (this.traspatioFincaRecord.tipo === "TRASPATIO"){
            this.poblado_finca_key = "Poblado";
            this.lote_propietario_key = "Propietario";
          }else{
             this.poblado_finca_key = "Finca";
             this.lote_propietario_key = "Lote";
          }
          
          this.traspatioFincaForm.controls['pais'].patchValue(inData.pais);
          this.traspatioFincaForm.controls['provincia'].patchValue(inData.provincia);
          this.traspatioFincaForm.controls['canton'].patchValue(inData.canton);
          this.traspatioFincaForm.controls['distrito'].patchValue(inData.distrito);
          this.traspatioFincaForm.controls['tipo'].patchValue(inData.tipo);
          this.traspatioFincaForm.controls['finca_poblado'].patchValue(inData.finca_poblado);
          this.traspatioFincaForm.controls['lote_propietario'].patchValue(inData.lote_propietario);
          this.traspatioFincaForm.controls['latitud'].patchValue(inData.latitud);
          this.traspatioFincaForm.controls['longitud'].patchValue(inData.longitud);

        }
      }
    }
  
    ngOnInit() {
    }
  
    //Edita registro traspatio/finca en base de datos sqlite local.
    async submit(){

      try{
  
        if(this.traspatioFincaForm.valid){
  
          let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
          let pais:string = parametrosDeConfiguracion.pais;

          let puedeEditar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

          if(!puedeEditar){
            throw new Error("Sincroniza primero y vuelve a intentarlo");
          }

          let traspatioFincaToUpdate:any = {};

          traspatioFincaToUpdate['pais'] = pais.toUpperCase();
          traspatioFincaToUpdate['tipo'] = this.traspatioFincaForm.controls['tipo'].value.toUpperCase();
          traspatioFincaToUpdate['finca_poblado'] = this.traspatioFincaForm.controls['finca_poblado'].value.toUpperCase();
          traspatioFincaToUpdate['lote_propietario'] = this.traspatioFincaForm.controls['lote_propietario'].value.toUpperCase();
          traspatioFincaToUpdate['latitud'] = this.traspatioFincaForm.controls['latitud'].value;
          traspatioFincaToUpdate['longitud'] = this.traspatioFincaForm.controls['longitud'].value;
          traspatioFincaToUpdate['estado'] = 1;
          traspatioFincaToUpdate['provincia'] = this.traspatioFincaForm.controls['provincia'].value.toUpperCase();
          traspatioFincaToUpdate['canton'] = this.traspatioFincaForm.controls['canton'].value.toUpperCase();
          traspatioFincaToUpdate['distrito'] = this.traspatioFincaForm.controls['distrito'].value.toUpperCase();
          traspatioFincaToUpdate['sincronizado'] = 0;
          
          await  this.traspatioFincaLocalService.updateATraspatioFinca(this.traspatioFincaRecord.id_local,traspatioFincaToUpdate);
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
  
    openMap(){
      let dataToSendMapViewer:MapMetaData = {urlAnterior:"",tipo:"",coordenadas:null};
      let coords = {lat:this.traspatioFincaForm.get("latitud").value,lng:this.traspatioFincaForm.get("longitud").value}
  
      dataToSendMapViewer["urlAnterior"] = this.router.url;
      dataToSendMapViewer["tipo"] = "vista_editar";
      dataToSendMapViewer["coordenadas"] = coords;
  
      this.previousUrlHolderService.setMapMetaData(dataToSendMapViewer);
      this.router.navigateByUrl('/map-viewer');
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
            this.traspatioFincaForm.controls['provincia'].patchValue(dataReturned.data);
          }
        }
      });
  
      return await modal.present();
    }
  
    async openCantonesModal() {
  
      let provincia = "";
      provincia = this.traspatioFincaForm.controls['provincia'].value;
  
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
              this.traspatioFincaForm.controls['canton'].patchValue(dataReturned.data);
            }
          }
        });
    
        return await modal.present();
      }
    }
  
    async openDistritosModal() {
  
      let canton = "";
      canton = this.traspatioFincaForm.controls['canton'].value;
  
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
              this.traspatioFincaForm.controls['distrito'].patchValue(dataReturned.data);
            }
          }
        });
    
        return await modal.present();
      }
  
    }
  
    async openPobladosFincasModal() {
  
      let distrito = "";
      distrito = this.traspatioFincaForm.controls['distrito'].value;
  
      if(distrito !== ""){
        const modal = await this.modalController.create({
          component: FincasPobladosPage,
          componentProps: {
            "tipo": this.traspatioFincaForm.controls['tipo'].value.toUpperCase(),
            "distrito": distrito
          }
        });
    
        modal.onDidDismiss().then((dataReturned) => {
          if (dataReturned !== null && !dataReturned.role) {
            if (dataReturned.data !== ""){
              this.traspatioFincaForm.controls['finca_poblado'].patchValue(dataReturned.data);
            }
          }
        });
    
        return await modal.present();
      }
  
    }
  
    async openPropieatariosLotesModal() {
  
      let finca_poblado = "";
      finca_poblado = this.traspatioFincaForm.controls['finca_poblado'].value;
  
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
              this.traspatioFincaForm.controls['lote_propietario'].patchValue(dataReturned.data);
            }
          }
        });
    
        return await modal.present();
      }
    }

}

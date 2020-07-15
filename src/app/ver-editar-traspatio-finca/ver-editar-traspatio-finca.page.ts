import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviousUrlHolderService } from '../services/data/previous-url-holder.service';
import { AlmacenamientoNativoService } from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import { AlertService } from '../services/alert/alert.service';
import { ToastService } from '../services/toast-service/toast.service';
import { TraspatioFincaLocalService } from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {ModalController} from '@ionic/angular';
import {DateService} from '../services/date/date.service';
import {Settings} from '../../DTO/settings.dto';

import {AuthService} from '../services/auth/auth.service';
import {ACTIONS} from '../../constants/user_actions';

@Component({
  selector: 'app-ver-editar-traspatio-finca',
  templateUrl: './ver-editar-traspatio-finca.page.html',
  styleUrls: ['./ver-editar-traspatio-finca.page.scss'],
})
export class VerEditarTraspatioFincaPage implements OnInit {

  tipo:string;
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";
  isSelectPobladoFincaActive = true;
  isSelectPropietarioLoteActive = true;
  poblados_fincas = [];
  propietarios_lotes = [];
  traspatioFincaForm: FormGroup;
  traspatioFincaRecord:any;
  seObtienenListasPorPrimeraVez = true;
  actions = ACTIONS;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
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
        finca_poblado:['',Validators.required],
        lote_propietario:['',Validators.required],
        latitud:['',Validators.required],
        longitud:['',Validators.required]
      });
    }

    changeType(event:any){
      if(!this.seObtienenListasPorPrimeraVez){
  
        this.tipo = event.target.value;
        this.isSelectPropietarioLoteActive = false;
        this.traspatioFincaForm.controls['finca_poblado'].patchValue('');
        this.traspatioFincaForm.controls['lote_propietario'].patchValue('');
        this.poblados_fincas = [];
        this.propietarios_lotes = [];
        
        if(this.tipo === "TRASPATIO"){
          this.poblado_finca_key = "Poblado";
          this.lote_propietario_key = "Propietario";
        }
  
        if(this.tipo === "PRODUCTOR" || this.tipo === "TICOFRUT"){
          this.poblado_finca_key = "Finca";
          this.lote_propietario_key = "Lote";
        }
  
        
        this.traspatioFincaLocalService.getTraspatiosFincasByType(this.tipo).then((fincasPobladosList:string[])=>{
          this.poblados_fincas = fincasPobladosList;
          this.isSelectPobladoFincaActive = true;
        }).catch((error)=>{
        });
  
      }
    }
  
    async ionViewWillEnter(){
      let inData = this.route.snapshot.data['data'];
      if (inData) {
        if(Object.keys(inData).length === 2){//Quiere decir que viene de la vista mapa
          this.traspatioFincaForm.controls['latitud'].patchValue(inData.latitud);
          this.traspatioFincaForm.controls['longitud'].patchValue(inData.longitud);
        }else{
          this.traspatioFincaRecord = inData;
          this.tipo = inData.tipo;
  
          let fincas_poblados:any = await this.traspatioFincaLocalService.getTraspatiosFincasByType(this.tipo);
          this.poblados_fincas = fincas_poblados;
  
          let propietariosLotes:any = await this.traspatioFincaLocalService.getPropietariosLotesByFincaPobladoName(this.traspatioFincaRecord.finca_poblado);
          this.propietarios_lotes = propietariosLotes;
          
        }
      }
    }
  
    ionViewDidEnter(){
      let inData = this.route.snapshot.data['data'];
      if (inData) {
        if(!(Object.keys(inData).length === 2)){//Quiere decir que viene de la vista mapa
          if (this.tipo === "TRASPATIO"){
            this.poblado_finca_key = "Poblado";
            this.lote_propietario_key = "Propietario";
          }else{
             this.poblado_finca_key = "Finca";
             this.lote_propietario_key = "Lote";
          }
          
          this.traspatioFincaForm.controls['pais'].patchValue(inData.pais);
          this.traspatioFincaForm.controls['tipo'].patchValue(inData.tipo);
          this.traspatioFincaForm.controls['finca_poblado'].patchValue(inData.finca_poblado);
          this.traspatioFincaForm.controls['lote_propietario'].patchValue(inData.lote_propietario);
          this.traspatioFincaForm.controls['latitud'].patchValue(inData.latitud);
          this.traspatioFincaForm.controls['longitud'].patchValue(inData.longitud);

        }
  
        this.seObtienenListasPorPrimeraVez = false;//Se indica que de ahora en adelante la carga de listas de traspatios/fincas y lotes/propietarios no se cargan por primera vez.
      }
      
    }
  
    ngOnInit() {
    }
  
    async submit(){
  
      try{
  
        if(this.traspatioFincaForm.valid){
  
          let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
          let pais:string = parametrosDeConfiguracion.pais;

          let puedeSincronizar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

          if(!puedeSincronizar){
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
          traspatioFincaToUpdate['sincronizado'] = 0;
          
          await  this.traspatioFincaLocalService.updateATraspatioFinca(this.traspatioFincaRecord.id_local,traspatioFincaToUpdate);
          let toast = await this.toastService.showToast("El registro se modificó exitosamente!");
          await toast.present();
          
        }else{
          let alert = await this.alertService.presentAlert("Verifique que los datos están completos!");
          await alert.present();
        }
  
      }catch(error){
        let alert = await this.alertService.presentAlert(JSON.stringify(error));
        await alert.present();
      }
    }
  
    pobladoFincaSelectChange(event:any){
      if(!this.seObtienenListasPorPrimeraVez){
        let fincaPobladoSelected = event.target.value;
        if(!fincaPobladoSelected){
          return;
        }
        this.traspatioFincaForm.controls['lote_propietario'].patchValue('');
        this.traspatioFincaLocalService.getPropietariosLotesByFincaPobladoName(fincaPobladoSelected).then((propietariosLotesList:string[])=>{
          this.propietarios_lotes = propietariosLotesList;
          this.isSelectPropietarioLoteActive = true;
        }).catch((error)=>{
          this.alertService.presentAlert(error).then((alert)=>{
            alert.present();
          });
        });
      }
      
    }
  
    openMap(){
      let dataToSendMapViewer:PreviousUrlStructure = {urlAnterior:"",tipo:"",coordenadas:null};
      let coords = {lat:this.traspatioFincaForm.get("latitud").value,lng:this.traspatioFincaForm.get("longitud").value}
  
      dataToSendMapViewer["urlAnterior"] = this.router.url;
      dataToSendMapViewer["tipo"] = "vista_editar";
      dataToSendMapViewer["coordenadas"] = coords;
  
      this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
      this.router.navigateByUrl('/map-viewer');
    }

    async openModal() {
      const modal = await this.modalController.create({
        component: FincasPobladosPage,
        componentProps: {
          "tipo": this.tipo,
          "cabecera":this.poblado_finca_key + 's'
        }
      });
  
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
  
          this.traspatioFincaForm.controls['finca_poblado'].patchValue(dataReturned.data);
          
        }
      });
  
      return await modal.present();
    }

}

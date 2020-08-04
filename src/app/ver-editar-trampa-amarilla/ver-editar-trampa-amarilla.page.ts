import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrampaAmarillaLocalService } from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import { PreviousUrlHolderService } from '../services/data/previous-url-holder.service';
import { AlmacenamientoNativoService } from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import { AlertService } from '../services/alert/alert.service';
import { ToastService } from '../services/toast-service/toast.service';
import { TraspatioFincaLocalService } from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';
import { DateService } from '../services/date/date.service';

import {AuthService} from '../services/auth/auth.service';
import {ACTIONS} from '../../constants/user_actions';
import { Settings } from '../../DTO/settings.dto';

@Component({
  selector: 'app-ver-editar-trampa-amarilla',
  templateUrl: './ver-editar-trampa-amarilla.page.html',
  styleUrls: ['./ver-editar-trampa-amarilla.page.scss'],
})
export class VerEditarTrampaAmarillaPage implements OnInit {

  tipo:string;
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";
  isSelectPobladoFincaActive = true;
  isSelectPropietarioLoteActive = true;
  poblados_fincas = [];
  propietarios_lotes = [];
  addTrapForm: FormGroup;
  trapRecord:any;
  seObtienenListasPorPrimeraVez = true;
  actions = ACTIONS;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private trampaAmarillaLocalService:TrampaAmarillaLocalService,
    private traspatioFincaLocalService:TraspatioFincaLocalService,
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
        estado:['',Validators.required]
      });
  }

  changeType(event:any){
    if(!this.seObtienenListasPorPrimeraVez){

      this.tipo = event.target.value;
      this.isSelectPropietarioLoteActive = false;
      this.addTrapForm.controls['finca_poblado'].patchValue('');
      this.addTrapForm.controls['lote_propietario'].patchValue('');
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

      /*
      this.traspatioFincaLocalService.getTraspatiosFincasByType(this.tipo).then((fincasPobladosList:string[])=>{
        this.poblados_fincas = fincasPobladosList;
        this.isSelectPobladoFincaActive = true;
      }).catch((error)=>{
      });
      */

    }
  }

  async ionViewWillEnter(){
    let inData = this.route.snapshot.data['data'];
    if (inData) {
      if(Object.keys(inData).length === 2){//Quiere decir que viene de la vista mapa
        this.addTrapForm.controls['latitud'].patchValue(inData.latitud);
        this.addTrapForm.controls['longitud'].patchValue(inData.longitud);
      }else{
        this.trapRecord = inData;
        this.tipo = inData.tipo;

        //let fincas_poblados:any = await this.traspatioFincaLocalService.getTraspatiosFincasByType(this.tipo);
        //this.poblados_fincas = fincas_poblados;

        let propietariosLotes:any = await this.traspatioFincaLocalService.getPropietariosLotesByFincaPobladoName(this.trapRecord.finca_poblado);
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
        
        this.addTrapForm.controls['num_trampa'].patchValue(inData.num_trampa);
        this.addTrapForm.controls['tipo'].patchValue(inData.tipo);
        this.addTrapForm.controls['pais'].patchValue(inData.pais);
        this.addTrapForm.controls['finca_poblado'].patchValue(inData.finca_poblado);
        this.addTrapForm.controls['lote_propietario'].patchValue(inData.lote_propietario);
        this.addTrapForm.controls['latitud'].patchValue(inData.latitud);
        this.addTrapForm.controls['longitud'].patchValue(inData.longitud);
        this.addTrapForm.controls['estado'].patchValue(inData.estado);
      }

      this.seObtienenListasPorPrimeraVez = false;//Se indica que de ahora en adelante la carga de listas de traspatios/fincas y lotes/propietarios no se cargan por primera vez.
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
        trampaToSave['sincronizado'] = 0;
        
        await  this.trampaAmarillaLocalService.updateATrap(this.trapRecord.id_local,trampaToSave);
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
      this.addTrapForm.controls['lote_propietario'].patchValue('');
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
    let coords = {lat:this.addTrapForm.get("latitud").value,lng:this.addTrapForm.get("longitud").value}

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_editar";
    dataToSendMapViewer["coordenadas"] = coords;

    this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
  }

}

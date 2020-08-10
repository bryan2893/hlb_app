import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ModalController} from '@ionic/angular';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {LotesPropietariosPage} from '../modals/lotes-propietarios/lotes-propietarios.page';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import { UserLoged } from 'src/DTO/UserLoged.dto';
import {InspeccionTrampaLocalService} from '../services/inspeccion_trampas/InspeccionTrampaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';
import {DateService} from '../services/date/date.service';
import {Settings} from '../../DTO/settings.dto';

import {USER_ACTIONS} from '../../constants/user_actions';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-ver-editar-inspeccion-trampa',
  templateUrl: './ver-editar-inspeccion-trampa.page.html',
  styleUrls: ['./ver-editar-inspeccion-trampa.page.scss'],
})
export class VerEditarInspeccionTrampaPage implements OnInit {

  tipo:string;
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  inspTrampaForm: FormGroup;
  trapInspectionRecord:any;
  mostrarComentario = false;
  actions = USER_ACTIONS;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private inspeccionTrampaLocalService:InspeccionTrampaLocalService,
    private router: Router,
    private previousUrlHolderService: PreviousUrlHolderService,
    private almacenamientoNativoService: AlmacenamientoNativoService,
    private alertService: AlertService,
    private toastService: ToastService,
    private dateService: DateService,
    private authService: AuthService,
    private modalController:ModalController) {
      this.inspTrampaForm = this.formBuilder.group({
        //id_inspec_hlb,
        consecutivo:['',Validators.required],
        fecha_hora:['',Validators.required],
        codigo_responsable:['',Validators.required],
        nombre_responsable:['',Validators.required],
        tipo:['',Validators.required],
        pais:['',Validators.required],
        num_trampa:['',Validators.required],
        latitud_trampa:['',Validators.required],
        longitud_trampa:['',Validators.required],
        finca_poblado:['',Validators.required],
        lote_propietario:['',Validators.required],
        cantidad_total:['',Validators.required],
        diagnostico:['',Validators.required],
        cantidad_diagnostico:['',Validators.required],
        notas:[''],
        indica_revision:['',Validators.required],
        comentario:['']
        //sincronizado por default se guarda como 0 ya que es un registro modificado que debe ser sincronizado.
      });
    }

    async ionViewWillEnter(){
      let inData = this.route.snapshot.data['data'];
      if (inData) {
        if(Object.keys(inData).length === 2){//Quiere decir que viene de la vista mapa
          this.inspTrampaForm.controls['latitud'].patchValue(inData.latitud);
          this.inspTrampaForm.controls['longitud'].patchValue(inData.longitud);
        }else{
          this.trapInspectionRecord = inData;
          this.tipo = inData.tipo;
        }
      }
    }

    ionViewDidEnter(){
      let inData = this.route.snapshot.data['data'];
      if (inData) {
        if (this.tipo === "TRASPATIO"){
          this.poblado_finca_key = "Poblado";
          this.lote_propietario_key = "Propietario";
        }else{
            this.poblado_finca_key = "Finca";
            this.lote_propietario_key = "Lote";
        }
  
        this.inspTrampaForm.controls['consecutivo'].patchValue(inData.consecutivo);
        this.inspTrampaForm.controls['fecha_hora'].patchValue(this.dateService.getBeautyDate(inData.fecha_hora));
        
        this.inspTrampaForm.controls['codigo_responsable'].patchValue(inData.codigo_responsable);
        this.inspTrampaForm.controls['nombre_responsable'].patchValue(inData.nombre_responsable);
        this.inspTrampaForm.controls['tipo'].patchValue(inData.tipo);
        this.inspTrampaForm.controls['pais'].patchValue(inData.pais);
        this.inspTrampaForm.controls['num_trampa'].patchValue(inData.num_trampa);
        this.inspTrampaForm.controls['latitud_trampa'].patchValue(inData.latitud_trampa);
        this.inspTrampaForm.controls['longitud_trampa'].patchValue(inData.longitud_trampa);
        this.inspTrampaForm.controls['finca_poblado'].patchValue(inData.finca_poblado);
        this.inspTrampaForm.controls['lote_propietario'].patchValue(inData.lote_propietario);
        this.inspTrampaForm.controls['cantidad_total'].patchValue(inData.cantidad_total);
        this.inspTrampaForm.controls['diagnostico'].patchValue(String(inData.diagnostico));
        
        this.inspTrampaForm.controls['cantidad_diagnostico'].patchValue(inData.cantidad_diagnostico);
        this.inspTrampaForm.controls['notas'].patchValue(inData.notas);

        this.inspTrampaForm.controls['indica_revision'].patchValue(String(inData.indica_revision));
        this.inspTrampaForm.controls['comentario'].patchValue(inData.comentario);
        
      }

    }

  ngOnInit() {
  }

  changeType(event:any){

    this.tipo = event.target.value;
    
    if(this.tipo === "TRASPATIO"){
      this.poblado_finca_key = "Poblado";
      this.lote_propietario_key = "Propietario";
    }

    if(this.tipo === "PRODUCTOR" || this.tipo === "TICOFRUT"){
      this.poblado_finca_key = "Finca";
      this.lote_propietario_key = "Lote";
    }
  }

  async submit(){

    try{

      if(this.inspTrampaForm.valid){

        let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();

        let puedeSincronizar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

        if(!puedeSincronizar){
          throw new Error("Sincroniza primero y vuelve a intentarlo");
        }

        let pais:string = parametrosDeConfiguracion.pais;
        let usuario:UserLoged = this.authService.getLogedUser();
        let trapInspectionToSave:any = {};
  
        trapInspectionToSave['id_inspec_tramp'] = -1;
        trapInspectionToSave['consecutivo'] = this.inspTrampaForm.controls['consecutivo'].value;
        trapInspectionToSave['fecha_hora'] = this.dateService.getCurrentDateTime();
        trapInspectionToSave['codigo_responsable'] = usuario.username;
        trapInspectionToSave['nombre_responsable'] = usuario.fullName;
        trapInspectionToSave['tipo'] = this.inspTrampaForm.controls['tipo'].value;
        trapInspectionToSave['pais'] = pais.toUpperCase();
        trapInspectionToSave['num_trampa'] = this.inspTrampaForm.controls['num_trampa'].value;
        trapInspectionToSave['latitud_trampa'] = this.inspTrampaForm.controls['latitud_trampa'].value;
        trapInspectionToSave['longitud_trampa'] = this.inspTrampaForm.controls['longitud_trampa'].value;
        trapInspectionToSave['finca_poblado'] = this.inspTrampaForm.controls['finca_poblado'].value;
        trapInspectionToSave['lote_propietario'] = this.inspTrampaForm.controls['lote_propietario'].value;
        trapInspectionToSave['cantidad_total'] = this.inspTrampaForm.controls['cantidad_total'].value;
        trapInspectionToSave['diagnostico'] = this.inspTrampaForm.controls['diagnostico'].value;
        trapInspectionToSave['cantidad_diagnostico'] = this.inspTrampaForm.controls['cantidad_diagnostico'].value;
        

        if(this.inspTrampaForm.controls['notas'].value === ''){
          trapInspectionToSave['notas'] = 'na';
        }else{
          trapInspectionToSave['notas'] = this.inspTrampaForm.controls['notas'].value;
        }

        trapInspectionToSave['indica_revision'] = this.inspTrampaForm.controls['indica_revision'].value;

        if(this.inspTrampaForm.controls['comentario'].value === ''){
          trapInspectionToSave['comentario'] = 'na';
        }else{
          trapInspectionToSave['comentario'] = this.inspTrampaForm.controls['comentario'].value;
        }

        trapInspectionToSave['sincronizado'] = 0;
        
        await  this.inspeccionTrampaLocalService.updateAnTrapInspection(this.trapInspectionRecord.id_local,trapInspectionToSave);
        let toast = await this.toastService.showToast("Inspeccion modificada correctamente!");
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

  
  async openPobladosFincasModal() {

    const modal = await this.modalController.create({
      component: FincasPobladosPage,
      componentProps: {
        "tipo": this.tipo,
        "distrito": ""
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null && !dataReturned.role) {
        if (dataReturned.data !== ""){
          this.inspTrampaForm.controls['finca_poblado'].patchValue(dataReturned.data);
        }
      }
    });

    return await modal.present();
    

  }

  async openPropieatariosLotesModal() {

    let finca_poblado = "";
    finca_poblado = this.inspTrampaForm.controls['finca_poblado'].value;

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
            this.inspTrampaForm.controls['lote_propietario'].patchValue(dataReturned.data);
          }
        }
      });
  
      return await modal.present();
    }
  }

  openMap(){
    if(!this.inspTrampaForm.get("latitud_trampa").value || !this.inspTrampaForm.get("longitud_trampa").value){
      return;
    }
    let dataToSendMapViewer:PreviousUrlStructure = {urlAnterior:"",tipo:"",coordenadas:null};
    let coords = {lat:this.inspTrampaForm.get("latitud_trampa").value,lng:this.inspTrampaForm.get("longitud_trampa").value}

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_editar";
    dataToSendMapViewer["coordenadas"] = coords;

    this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
  }

  marcarRegistro(event:any){
    if(event.target.value === '0'){
      this.inspTrampaForm.controls['comentario'].patchValue('');
      this.mostrarComentario = false;
    }else{
      this.mostrarComentario = true;
    }
  }

}

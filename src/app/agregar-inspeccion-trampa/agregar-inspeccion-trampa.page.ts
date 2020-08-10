import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {LotesPropietariosPage} from '../modals/lotes-propietarios/lotes-propietarios.page';
import {MapMetaDataHolderService} from '../services/data/map-metadata-container.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {AuthService} from '../services/auth/auth.service';
import { UserLoged } from 'src/DTO/UserLoged.dto';
import {InspeccionTrampaLocalService} from '../services/inspeccion_trampas/InspeccionTrampaLocal.service';
import {TrampaAmarillaLocalService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import { MapMetaData } from 'src/DTO/mapMetaData.dto';
import {DateService} from '../services/date/date.service';
import {Settings} from '../../DTO/settings.dto';

@Component({
  selector: 'app-agregar-inspeccion-trampa',
  templateUrl: './agregar-inspeccion-trampa.page.html',
  styleUrls: ['./agregar-inspeccion-trampa.page.scss'],
})
export class AgregarInspeccionTrampaPage implements OnInit {

  tipo = "TRASPATIO";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  inspTrampaForm: FormGroup;

  mostrarComentario = false;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private inspeccionTrampaLocalService:InspeccionTrampaLocalService,
    private router: Router,
    private previousUrlHolderService:MapMetaDataHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private dateService:DateService,
    private authService:AuthService,
    private trampaAmarillaLocalService:TrampaAmarillaLocalService,
    private modalController:ModalController) {

      this.inspTrampaForm = this.formBuilder.group({
        //id_inspec_hlb,fecha_hora se guardan pero no se muestran en la interfaz.
        //consecutivo se guarda pero no se muestra en la interfaz.
        //codigo_responsable,nombre_responsable se obtiene del usuario que esta logueado.
        tipo:['TRASPATIO',Validators.required],
        //pais se obtiene desde almacenamiento local pero no se muestra en interrfaz.
        num_trampa:['',Validators.required],
        latitud_trampa:['',Validators.required],
        longitud_trampa:['',Validators.required],
        finca_poblado:['',Validators.required],
        lote_propietario:['',Validators.required],
        cantidad_total:['',Validators.required],
        diagnostico:['',Validators.required],
        cantidad_diagnostico:['',Validators.required],
        notas:[''],
        indica_revision:['0',Validators.required],
        comentario:[''],
        //sincronizado por default se guarda como 0 ya que es un registro nuevo que debe ser sincronizado.
      });
      
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

  
  ionViewWillEnter(){
    
    if (this.route.snapshot.data['data']) {
      let coords = this.route.snapshot.data['data'];
      this.inspTrampaForm.controls['latitud_trampa'].patchValue(coords.latitud);
      this.inspTrampaForm.controls['longitud_trampa'].patchValue(coords.longitud);
    }

  }
  

  ngOnInit() {

  }

  async submit(){

    try{

      if(this.inspTrampaForm.dirty && this.inspTrampaForm.valid){

        let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();

        let puedeSincronizar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

        if(!puedeSincronizar){
          throw new Error("Sincroniza primero y vuelve a intentarlo");
        }

        let pais:string = parametrosDeConfiguracion.pais.toUpperCase();
        let usuario:UserLoged = this.authService.getLogedUser();
        let trapInspectionToSave:any = {};
  
        trapInspectionToSave['id_inspec_tramp'] = -1;
        trapInspectionToSave['consecutivo'] = 'na';
        trapInspectionToSave['fecha_hora'] = this.dateService.getCurrentDateTime();
        trapInspectionToSave['codigo_responsable'] = usuario.username;
        trapInspectionToSave['nombre_responsable'] = usuario.fullName;
        trapInspectionToSave['tipo'] = this.inspTrampaForm.controls['tipo'].value.toUpperCase();
        trapInspectionToSave['pais'] = pais;
        trapInspectionToSave['num_trampa'] = this.inspTrampaForm.controls['num_trampa'].value;
        trapInspectionToSave['latitud_trampa'] = this.inspTrampaForm.controls['latitud_trampa'].value;
        trapInspectionToSave['longitud_trampa'] = this.inspTrampaForm.controls['longitud_trampa'].value;
        trapInspectionToSave['finca_poblado'] = this.inspTrampaForm.controls['finca_poblado'].value.toUpperCase();
        trapInspectionToSave['lote_propietario'] = this.inspTrampaForm.controls['lote_propietario'].value.toUpperCase();
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
        
        await  this.inspeccionTrampaLocalService.insertATrapInspection(trapInspectionToSave);
        let toast = await this.toastService.showToast("Inspeccion insertada correctamente!");
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

    let dataToSendMapViewer:MapMetaData = {urlAnterior:"",tipo:"",coordenadas:null};
    let coords = {lat:this.inspTrampaForm.get("latitud_trampa").value,lng:this.inspTrampaForm.get("longitud_trampa").value}

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_editar";
    dataToSendMapViewer["coordenadas"] = coords;

    this.previousUrlHolderService.setMapMetaData(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
  }

  async onTrapNumberIsSet(event:any){

    if(event.target.value === ''){
      this.inspTrampaForm.controls['latitud_trampa'].patchValue('');
      this.inspTrampaForm.controls['longitud_trampa'].patchValue('');
    }else{
      let trap:any = await this.trampaAmarillaLocalService.findAtrap(event.target.value);
      let trapFounded = trap[0];

      if(trapFounded){
        this.inspTrampaForm.controls['latitud_trampa'].patchValue(trapFounded.latitud);
        this.inspTrampaForm.controls['longitud_trampa'].patchValue(trapFounded.longitud);
      }else{
        this.inspTrampaForm.controls['latitud_trampa'].patchValue('');
        this.inspTrampaForm.controls['longitud_trampa'].patchValue('');
      }
    }
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

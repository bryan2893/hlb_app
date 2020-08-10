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
import {InspeccionHlbLocalService} from '../services/inspecciones_hlb/InspeccionHlbLocal.service';
import { MapMetaData } from 'src/DTO/mapMetaData.dto';
import {DateService} from '../services/date/date.service';
import {Settings} from '../../DTO/settings.dto';

@Component({
  selector: 'app-agregar-inspeccion-hlb',
  templateUrl: './agregar-inspeccion-hlb.page.html',
  styleUrls: ['./agregar-inspeccion-hlb.page.scss'],
})
export class AgregarInspeccionHlbPage implements OnInit {

  tipo = "TRASPATIO";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  coords:any;
  inspTraspatioFincaForm: FormGroup;
  mostrarComentario = false;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private inspeccionHlbLocalService:InspeccionHlbLocalService,
    private router: Router,
    private previousUrlHolderService:MapMetaDataHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private dateService:DateService,
    private authService:AuthService,
    private modalController:ModalController) {

    this.inspTraspatioFincaForm = this.formBuilder.group({
      //id_inspec_hlb se guarda pero no se muestra...
      //fecha_hora se guardan pero no se muestran en la interfaz
      //codigo_responsable,nombre_responsable se obtiene del usuario que esta logueado.
      tipo:['TRASPATIO',Validators.required],
      //pais se obtiene desde almacenamiento local pero no se muestra en interrfaz.
      finca_poblado:['',Validators.required],
      lote_propietario:['',Validators.required],
      ciclo:['',Validators.required],
      labor:[''],
      categoria:[''],
      variedad:['',Validators.required],
      sintomatologia:['',Validators.required],
      estado:['',Validators.required],
      diagnostico:['',Validators.required],
      latitud:['',Validators.required],
      longitud:['',Validators.required],
      patron:[''],
      calle:[''],
      direccion_calle:[''],
      numero_arbol:[''],
      dir_arbol:[''],
      notas:[''],
      indica_revision:['0',Validators.required],
      comentario:[''],
      //sincronizado por default se guarda como 0 ya que es un registro nuevo que debe ser sincronizado.
    });

  }

  changeType(event:any){
    let tipo = event.target.value;
    this.tipo = tipo;
    
    if(tipo === "TRASPATIO"){
      this.poblado_finca_key = "Poblado";
      this.lote_propietario_key = "Propietario";
    }

    if(tipo === "PRODUCTOR" || tipo === "TICOFRUT"){
      this.poblado_finca_key = "Finca";
      this.lote_propietario_key = "Lote";
    }

  }

  ionViewWillEnter(){
    if (this.route.snapshot.data['data']) {
      this.coords = this.route.snapshot.data['data'];
      this.inspTraspatioFincaForm.controls['latitud'].patchValue(this.coords.latitud);
      this.inspTraspatioFincaForm.controls['longitud'].patchValue(this.coords.longitud);
    }

  }

  ngOnInit() {
  }

  validarFormSegunTipo(hlbForm:any):any{
    let tipo:string = hlbForm.tipo;

    if(tipo === 'TRASPATIO'){
      return (hlbForm.labor !== '' &&
      hlbForm.categoria !== ''
      );
    }else{
      return(
        hlbForm.patron !== ''&&
        hlbForm.calle !== null &&
        hlbForm.direccion_calle !== '' &&
        hlbForm.numero_arbol !== null &&
        hlbForm.dir_arbol !== ''
      );
    }

  }

  async submit(){

    try{

      if(this.inspTraspatioFincaForm.dirty && this.inspTraspatioFincaForm.valid){

        let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();

        let puedeSincronizar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

        if(!puedeSincronizar){
          throw new Error("Sincroniza primero y vuelve a intentarlo");
        }

        let pais:string = parametrosDeConfiguracion.pais.toUpperCase();
        let usuario:UserLoged = this.authService.getLogedUser();

        let hlbInspectionToSave:any = {};
  
        hlbInspectionToSave['id_inspec_hlb'] = -1;
        hlbInspectionToSave['consecutivo'] = 'na';
        hlbInspectionToSave['fecha_hora'] = this.dateService.getCurrentDateTime();
        hlbInspectionToSave['codigo_responsable'] = usuario.username;
        hlbInspectionToSave['nombre_responsable'] = usuario.fullName;
        hlbInspectionToSave['tipo'] = this.inspTraspatioFincaForm.controls['tipo'].value.toUpperCase();
        hlbInspectionToSave['pais'] = pais.toUpperCase();
        hlbInspectionToSave['finca_poblado'] = this.inspTraspatioFincaForm.controls['finca_poblado'].value.toUpperCase();
        hlbInspectionToSave['lote_propietario'] = this.inspTraspatioFincaForm.controls['lote_propietario'].value.toUpperCase();
        hlbInspectionToSave['ciclo'] = this.inspTraspatioFincaForm.controls['ciclo'].value;

        if(!(hlbInspectionToSave['tipo'] === 'TRASPATIO')){
          hlbInspectionToSave['labor'] = 'na';
          hlbInspectionToSave['categoria'] = 'na';
        }else{
          hlbInspectionToSave['labor'] = this.inspTraspatioFincaForm.controls['labor'].value;//viene en mayúscula
          hlbInspectionToSave['categoria'] = this.inspTraspatioFincaForm.controls['categoria'].value;//viene en mayúscula
        }

        hlbInspectionToSave['variedad'] = this.inspTraspatioFincaForm.controls['variedad'].value;
        hlbInspectionToSave['sintomatologia'] = this.inspTraspatioFincaForm.controls['sintomatologia'].value;
        hlbInspectionToSave['estado'] = this.inspTraspatioFincaForm.controls['estado'].value;
        hlbInspectionToSave['diagnostico'] = this.inspTraspatioFincaForm.controls['diagnostico'].value;
        hlbInspectionToSave['latitud'] = this.inspTraspatioFincaForm.controls['latitud'].value;
        hlbInspectionToSave['longitud'] = this.inspTraspatioFincaForm.controls['longitud'].value;

        if(!(hlbInspectionToSave['tipo'] === 'PRODUCTOR' || hlbInspectionToSave['tipo'] === 'TICOFRUT')){
          hlbInspectionToSave['patron'] = 'na';
          hlbInspectionToSave['calle'] = 0;
          hlbInspectionToSave['direccion_calle'] = 'na'
          hlbInspectionToSave['numero_arbol'] = 0;
          hlbInspectionToSave['dir_arbol'] = 'na';
        }else{
          hlbInspectionToSave['patron'] = this.inspTraspatioFincaForm.controls['patron'].value;
          hlbInspectionToSave['calle'] = this.inspTraspatioFincaForm.controls['calle'].value;
          hlbInspectionToSave['direccion_calle'] = this.inspTraspatioFincaForm.controls['direccion_calle'].value;
          hlbInspectionToSave['numero_arbol'] = this.inspTraspatioFincaForm.controls['numero_arbol'].value;
          hlbInspectionToSave['dir_arbol'] = this.inspTraspatioFincaForm.controls['dir_arbol'].value;
        }

        

        if(this.inspTraspatioFincaForm.controls['notas'].value === ''){
          hlbInspectionToSave['notas'] = 'na';
        }else{
          hlbInspectionToSave['notas'] = this.inspTraspatioFincaForm.controls['notas'].value;
        }

        hlbInspectionToSave['indica_revision'] = this.inspTraspatioFincaForm.controls['indica_revision'].value;

        if(this.inspTraspatioFincaForm.controls['comentario'].value === ''){
          hlbInspectionToSave['comentario'] = 'na';
        }else{
          hlbInspectionToSave['comentario'] = this.inspTraspatioFincaForm.controls['comentario'].value;
        }

        hlbInspectionToSave['sincronizado'] = 0;
        

        if(this.validarFormSegunTipo(hlbInspectionToSave)){
          
          await  this.inspeccionHlbLocalService.insertAnHlbInspection(hlbInspectionToSave);
          let toast = await this.toastService.showToast("Inspeccion insertada correctamente!");
          await toast.present();
          
        }else{
          let alert = await this.alertService.presentAlert("Verifique que los datos están completos!");
          await alert.present();
        }
        
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
          this.inspTraspatioFincaForm.controls['finca_poblado'].patchValue(dataReturned.data);
        }
      }
    });

    return await modal.present();
    

  }

  async openPropieatariosLotesModal() {

    let finca_poblado = "";
    finca_poblado = this.inspTraspatioFincaForm.controls['finca_poblado'].value;

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
            this.inspTraspatioFincaForm.controls['lote_propietario'].patchValue(dataReturned.data);
          }
        }
      });
  
      return await modal.present();
    }
  }

  openMap(){
    let dataToSendMapViewer:MapMetaData = {urlAnterior:"",tipo:"",coordenadas:null};

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_agregar";
    dataToSendMapViewer["coordenadas"] = null;

    this.previousUrlHolderService.setMapMetaData(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
  }

  marcarRegistro(event:any){
    if(event.target.value === '0'){
      this.inspTraspatioFincaForm.controls['comentario'].patchValue('');
      this.mostrarComentario = false;
    }else{
      this.mostrarComentario = true;
    }
  }

}

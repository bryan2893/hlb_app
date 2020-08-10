import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {ProvinciasPage} from '../modals/provincias/provincias.page';
import {CantonesPage} from '../modals/cantones/cantones.page';
import {DistritosPage} from '../modals/distritos/distritos.page';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {LotesPropietariosPage} from '../modals/lotes-propietarios/lotes-propietarios.page';
import {TraspatioFincaLocalService as MantenimientosHlbLocalDbService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {MapMetaData} from 'src/DTO/mapMetaData.dto';
import {DateService} from '../services/date/date.service';
import {Settings} from '../../DTO/settings.dto';

@Component({
  selector: 'app-agregar-mante-hlb',
  templateUrl: './agregar-mante-hlb.page.html',
  styleUrls: ['./agregar-mante-hlb.page.scss'],
})
export class AgregarManteHlbPage implements OnInit {
  tipo = "TRASPATIO";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  coords:any;
  traspatioFincaForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    public modalController:ModalController,
    private mantenimientosHlbLocalDbService:MantenimientosHlbLocalDbService,
    private router:Router,
    private previousUrlHolderService: PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private dateService:DateService
    ) {

    this.traspatioFincaForm = this.formBuilder.group({
      tipo:['TRASPATIO',Validators.required],
      provincia:[''],
      canton:[''],
      distrito:[''],
      finca_poblado:['',Validators.required],
      lote_propietario:['',Validators.required],
      latitud:[''],
      longitud:['']
    });
  }

  getCurrenType(){
    return this.traspatioFincaForm.controls['tipo'].value;
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
      this.coords = this.route.snapshot.data['data'];
      this.traspatioFincaForm.controls['latitud'].patchValue(this.coords.latitud);
      this.traspatioFincaForm.controls['longitud'].patchValue(this.coords.longitud);
    }
  }

  async submit(){

    try{

      if(this.traspatioFincaForm.dirty && this.traspatioFincaForm.valid){

        let newTraspatioFinca:any = {};
  
        newTraspatioFinca['id_traspatio_finca'] = -1;
  
        //Se obtiene el pais del almacenamiento interno del telefono.
        let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();

        let puedeAgregar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

        if(!puedeAgregar){
          throw new Error("Sincroniza primero y vuelve a intentarlo");
        }
  
        let paisRecuperado:string = parametrosDeConfiguracion.pais;
  
        newTraspatioFinca['pais'] = paisRecuperado.toUpperCase();
        newTraspatioFinca['tipo'] = this.traspatioFincaForm.controls['tipo'].value.toUpperCase();
        newTraspatioFinca['finca_poblado'] = this.traspatioFincaForm.controls['finca_poblado'].value.toUpperCase();
        newTraspatioFinca['lote_propietario'] = this.traspatioFincaForm.controls['lote_propietario'].value.toUpperCase();
        newTraspatioFinca['latitud'] = this.traspatioFincaForm.controls['latitud'].value;
        newTraspatioFinca['longitud'] = this.traspatioFincaForm.controls['longitud'].value;
        newTraspatioFinca['estado'] = 1;
        newTraspatioFinca['provincia'] = this.traspatioFincaForm.controls['provincia'].value.toUpperCase();
        newTraspatioFinca['canton'] = this.traspatioFincaForm.controls['canton'].value.toUpperCase();
        newTraspatioFinca['distrito'] = this.traspatioFincaForm.controls['distrito'].value.toUpperCase();
        newTraspatioFinca['sincronizado'] = 0;
  
        await this.mantenimientosHlbLocalDbService.insertATraspatioFinca(newTraspatioFinca);
        let toast = await this.toastService.showToast("Registro insertado correctamente!");
        toast.present();
  
      }else{
        let alert = await this.alertService.presentAlert("Verifique que todos los datos están completos!");
        alert.present();
      }

    }catch(error){
      let alert = await this.alertService.presentAlert(error);
      alert.present();
    }
  }

  ngOnInit() {
  }

  openMap(){
    let dataToSendMapViewer:MapMetaData = {urlAnterior:"",tipo:"",coordenadas:null};

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_agregar";
    dataToSendMapViewer["coordenadas"] = null;

    this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
  }

  async openProvinciasModal() {
    const modal = await this.modalController.create({
      component: ProvinciasPage,
      componentProps: {
        "tipo": this.tipo,
        "cabecera":this.poblado_finca_key + 's'
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
          "tipo": this.tipo,
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

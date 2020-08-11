import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {TrampaAmarillaLocalService as MantenimientosTrampasLocalDbService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import {MapMetaDataHolderService} from '../services/data/map-metadata-container.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {MapMetaData} from '../../DTO/mapMetaData.dto';
import {ProvinciasPage} from '../modals/provincias/provincias.page';
import {CantonesPage} from '../modals/cantones/cantones.page';
import {DistritosPage} from '../modals/distritos/distritos.page';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {LotesPropietariosPage} from '../modals/lotes-propietarios/lotes-propietarios.page';
import { Settings } from '../../DTO/settings.dto';
import {DateService} from '../services/date/date.service';
import {MAP_ACTIONS} from '../../constants/map_actions';

@Component({
  selector: 'app-agregar-trampa',
  templateUrl: './agregar-trampa.page.html',
  styleUrls: ['./agregar-trampa.page.scss'],
})
export class AgregarTrampaPage implements OnInit {

  tipo = "TRASPATIO";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  coords:any;

  addTrapForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private mantenimientosTrampasLocalDbService:MantenimientosTrampasLocalDbService,
    private router: Router,
    private mapMetaDataHolderService:MapMetaDataHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private dateService:DateService,
    public modalController:ModalController) {

    this.addTrapForm = this.formBuilder.group({
      num_trampa:['',Validators.required],
      tipo:['TRASPATIO',Validators.required],
      provincia:[''],
      canton:[''],
      distrito:[''],
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

  ionViewWillEnter(){
    let data:any = this.route.snapshot.data['data'];
    if (data) {
      if(data.accion === MAP_ACTIONS.DEVUELVE_COORDENADAS){
        this.coords = data.coordenadas;
        this.addTrapForm.controls['latitud'].patchValue(this.coords.lat);
        this.addTrapForm.controls['longitud'].patchValue(this.coords.lng);
      }
    }
  }

  ngOnInit() {

  }

  async submit(){

    try{
      if(this.addTrapForm.dirty && this.addTrapForm.valid){//si todos los campos estan completados...

        let pais:string;
        let parametrosDeConfiguracion:Settings = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        pais = parametrosDeConfiguracion.pais;
        
        let puedeSincronizar:Boolean = await this.dateService.isValidDateRestriction(Number(parametrosDeConfiguracion.dias_permitidos));

        if(!puedeSincronizar){
          throw new Error("Sincroniza primero y vuelve a intentarlo");
        }
  
        let trapMantainRegisterToSave:any = {};
  
        trapMantainRegisterToSave['id_trampa'] = -1;
        trapMantainRegisterToSave['num_trampa'] = this.addTrapForm.controls['num_trampa'].value;
        trapMantainRegisterToSave['tipo'] = this.addTrapForm.controls['tipo'].value.toUpperCase();
        trapMantainRegisterToSave['pais'] = pais.toUpperCase();
        trapMantainRegisterToSave['finca_poblado'] = this.addTrapForm.controls['finca_poblado'].value.toUpperCase();
        trapMantainRegisterToSave['lote_propietario'] = this.addTrapForm.controls['lote_propietario'].value.toUpperCase();
        trapMantainRegisterToSave['latitud'] = this.addTrapForm.controls['latitud'].value;
        trapMantainRegisterToSave['longitud'] = this.addTrapForm.controls['longitud'].value;
        trapMantainRegisterToSave['estado'] = 1;
        trapMantainRegisterToSave['provincia'] = this.addTrapForm.controls['provincia'].value.toUpperCase();
        trapMantainRegisterToSave['canton'] = this.addTrapForm.controls['canton'].value.toUpperCase();
        trapMantainRegisterToSave['distrito'] = this.addTrapForm.controls['distrito'].value.toUpperCase();
        trapMantainRegisterToSave['sincronizado'] = 0;

        await this.mantenimientosTrampasLocalDbService.insertAtrap(trapMantainRegisterToSave);
        let toast = await this.toastService.showToast("Registro insertado correctamente!");
        toast.present();
        
      }else{
        let alert = await this.alertService.presentAlert("Verifique que los datos sean correctos!");
        alert.present();
      }
    }catch(error){
      let alert = await this.alertService.presentAlert(JSON.stringify(error));
      alert.present();
    }
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
          "tipo": this.tipo,
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

    let dataToSendMapViewer:MapMetaData = {tipo:"",urlAnterior:"",coordenadas:null};

    dataToSendMapViewer["tipo"] = MAP_ACTIONS.AGREGAR;
    dataToSendMapViewer["urlAnterior"] = this.router.url;

    this.mapMetaDataHolderService.setMapMetaData(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');

  }

}

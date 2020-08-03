import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {TrampaAmarillaLocalService as MantenimientosTrampasLocalDbService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import {TraspatioFincaLocalService as MantenimientosHlbLocalDbService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {PreviousUrlStructure} from '../../DTO/previuousUrlStructure.dto';
import {ProvinciasPage} from '../modals/provincias/provincias.page';
import {CantonesPage} from '../modals/cantones/cantones.page';
import {DistritosPage} from '../modals/distritos/distritos.page';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';
import {LotesPropietariosPage} from '../modals/lotes-propietarios/lotes-propietarios.page';
import { Settings } from '../../DTO/settings.dto';
import {DateService} from '../services/date/date.service';

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
    private mantenimientosHlbLocalDbService:MantenimientosHlbLocalDbService,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
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

  getCurrenType(){
    return this.addTrapForm.controls['tipo'].value;
  }

  changeType(event:any){
    let tipo = event.target.value;
    this.addTrapForm.controls['provincia'].patchValue('');
    this.addTrapForm.controls['canton'].patchValue('');
    this.addTrapForm.controls['distrito'].patchValue('');
    this.addTrapForm.controls['finca_poblado'].patchValue('');
    this.addTrapForm.controls['lote_propietario'].patchValue('');
    
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
      this.addTrapForm.controls['latitud'].patchValue(this.coords.latitud);
      this.addTrapForm.controls['longitud'].patchValue(this.coords.longitud);
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
        trapMantainRegisterToSave['sincronizado'] = 0;

        await this.mantenimientosTrampasLocalDbService.insertAtrap(trapMantainRegisterToSave);
        let toast = await this.toastService.showToast("Trampa insertada correctamente!");
        toast.present();
        
      }else{
        let alert = await this.alertService.presentAlert("Verifique que los datos sean correctos!");
        alert.present();
      }
    }catch(error){
      let alert = await this.alertService.presentAlert(error);
      alert.present();
    }
  }

  /*
  pobladoFincaSelectChange(event:any){
    let fincaPobladoSelected = event.target.value;
    if(!fincaPobladoSelected){
      return;
    }
    this.addTrapForm.controls['lote_propietario'].patchValue('');
    this.mantenimientosHlbLocalDbService.getPropietariosLotesByFincaPobladoName(fincaPobladoSelected).then((propietariosLotesList:string[])=>{
      this.propietarios_lotes = propietariosLotesList;
      this.isSelectPropietarioLoteActive = true;
    }).catch((error)=>{
      this.alertService.presentAlert(error).then((alert)=>{
        alert.present();
      });
    });
  }
  */
 async openProvinciasModal() {
    const modal = await this.modalController.create({
      component: ProvinciasPage,
      componentProps: {
        "tipo": this.tipo,
        "cabecera":this.poblado_finca_key + 's'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.addTrapForm.controls['provincia'].patchValue(dataReturned.data);
      }
    });

    return await modal.present();
  }

  async openCantonesModal() {
    const modal = await this.modalController.create({
      component: CantonesPage,
      componentProps: {
        "tipo": this.tipo,
        "cabecera":this.poblado_finca_key + 's'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.addTrapForm.controls['canton'].patchValue(dataReturned.data);
      }
    });

    return await modal.present();
  }

  async openDistritosModal() {
    const modal = await this.modalController.create({
      component: DistritosPage,
      componentProps: {
        "tipo": this.tipo,
        "cabecera":this.poblado_finca_key + 's'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.addTrapForm.controls['distrito'].patchValue(dataReturned.data);
      }
    });

    return await modal.present();
  }

  async openPobladosFincasModal() {
    const modal = await this.modalController.create({
      component: FincasPobladosPage,
      componentProps: {
        "tipo": this.tipo,
        "cabecera":this.poblado_finca_key + 's'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.addTrapForm.controls['finca_poblado'].patchValue(dataReturned.data);
      }
    });

    return await modal.present();
  }

  async openPropieatariosLotesModal() {
    const modal = await this.modalController.create({
      component: LotesPropietariosPage,
      componentProps: {
        "tipo": this.tipo,
        "cabecera":this.poblado_finca_key + 's'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.addTrapForm.controls['lote_propietario'].patchValue(dataReturned.data);
      }
    });

    return await modal.present();
  }

  openMap(){

    let dataToSendMapViewer:PreviousUrlStructure = {urlAnterior:"",tipo:"",coordenadas:null};

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_agregar";
    dataToSendMapViewer["coordenadas"] = null;

    this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');

  }

}

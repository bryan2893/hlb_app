import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {TraspatioFincaLocalService as MantenimientosHlbLocalDbService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';
import {FincasPobladosPage} from '../modals/fincas-poblados/fincas-poblados.page';

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
    private toastService:ToastService
    ) {

    this.traspatioFincaForm = this.formBuilder.group({
      tipo:['TRASPATIO',Validators.required],
      finca_poblado:['',Validators.required],
      lote_propietario:['',Validators.required],
      latitud:[''],
      longitud:['']
    });
  }

  changeType(event:any){
    this.tipo = event.target.value;
    
    this.traspatioFincaForm.controls['finca_poblado'].patchValue('');
    this.traspatioFincaForm.controls['lote_propietario'].patchValue('');
   
    
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

        let hlbMantainRegisterToSave:any = {};
  
        hlbMantainRegisterToSave['id_traspatio_finca'] = -1;
  
        //Se obtiene el pais del almacenamiento interno del telefono.
        let parametrosDeConfiguracion:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
  
        let paisRecuperado:string = parametrosDeConfiguracion.pais;
  
        hlbMantainRegisterToSave['pais'] = paisRecuperado.toUpperCase();
        hlbMantainRegisterToSave['tipo'] = this.traspatioFincaForm.controls['tipo'].value.toUpperCase();
        hlbMantainRegisterToSave['finca_poblado'] = this.traspatioFincaForm.controls['finca_poblado'].value.toUpperCase();
        hlbMantainRegisterToSave['lote_propietario'] = this.traspatioFincaForm.controls['lote_propietario'].value.toUpperCase();
        hlbMantainRegisterToSave['latitud'] = this.traspatioFincaForm.controls['latitud'].value;
        hlbMantainRegisterToSave['longitud'] = this.traspatioFincaForm.controls['longitud'].value;
        hlbMantainRegisterToSave['estado'] = 1;
        hlbMantainRegisterToSave['sincronizado'] = 0;
  
        await this.mantenimientosHlbLocalDbService.insertATraspatioFinca(hlbMantainRegisterToSave);
        let toast = await this.toastService.showToast("Traspatio/finca insertado correctamente!");
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
    let dataToSendMapViewer:PreviousUrlStructure = {urlAnterior:"",tipo:"",coordenadas:null};

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_agregar";
    dataToSendMapViewer["coordenadas"] = null;

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

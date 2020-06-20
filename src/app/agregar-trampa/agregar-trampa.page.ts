import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {TrampaAmarillaLocalService as MantenimientosTrampasLocalDbService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import {TraspatioFincaLocalService as MantenimientosHlbLocalDbService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';

@Component({
  selector: 'app-agregar-trampa',
  templateUrl: './agregar-trampa.page.html',
  styleUrls: ['./agregar-trampa.page.scss'],
})
export class AgregarTrampaPage implements OnInit {

  tipo = "traspatio";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  isSelectPobladoFincaActive = false;
  isSelectPropietarioLoteActive = false;

  poblados_fincas = [];
  propietarios_lotes = [];

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
    private toastService:ToastService) {

    this.addTrapForm = this.formBuilder.group({
      num_trampa:['',Validators.required],
      tipo:['',Validators.required],
      finca_poblado:['',Validators.required],
      lote_propietario:['',Validators.required],
      latitud:['',Validators.required],
      longitud:['',Validators.required]
    });

  }

  changeType(event:any){
    this.tipo = event.target.value;
    this.isSelectPropietarioLoteActive = false;
    this.addTrapForm.controls['finca_poblado'].patchValue('');
    this.addTrapForm.controls['lote_propietario'].patchValue('');
    this.poblados_fincas = [];
    this.propietarios_lotes = [];
    
    if(this.tipo === "traspatio"){
      this.poblado_finca_key = "Poblado";
      this.lote_propietario_key = "Propietario";
    }

    if(this.tipo === "productor" || this.tipo === "ticofrut"){
      this.poblado_finca_key = "Finca";
      this.lote_propietario_key = "Lote";
    }

    
    this.mantenimientosHlbLocalDbService.getTraspatiosFincasByType(this.tipo).then((fincasPobladosList:string[])=>{
      this.poblados_fincas = fincasPobladosList;
      this.isSelectPobladoFincaActive = true;
    }).catch((error)=>{

    });

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
        let configuracionesGenerales:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        pais = configuracionesGenerales.pais;
        
  
        let trapMantainRegisterToSave:any = {};
  
        trapMantainRegisterToSave['id_trampa'] = -1;
        trapMantainRegisterToSave['num_trampa'] = this.addTrapForm.controls['num_trampa'].value;
        trapMantainRegisterToSave['tipo'] = this.addTrapForm.controls['tipo'].value;
        trapMantainRegisterToSave['pais'] = pais;
        trapMantainRegisterToSave['finca_poblado'] = this.addTrapForm.controls['finca_poblado'].value;
        trapMantainRegisterToSave['lote_propietario'] = this.addTrapForm.controls['lote_propietario'].value;
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

  openMap(){
    this.previousUrlHolderService.setPreviousUrl(this.router.url);
    this.router.navigateByUrl('/map-viewer');
  }

}

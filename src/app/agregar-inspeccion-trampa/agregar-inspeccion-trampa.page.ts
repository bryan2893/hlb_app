import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {TraspatioFincaLocalService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {DateService} from '../services/date/date.service';
import {AuthService} from '../services/auth/auth.service';
import { User } from 'src/DTO/User.dto';
import {InspeccionTrampaLocalService} from '../services/inspeccion_trampas/InspeccionTrampaLocal.service';
import {TrampaAmarillaLocalService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';

@Component({
  selector: 'app-agregar-inspeccion-trampa',
  templateUrl: './agregar-inspeccion-trampa.page.html',
  styleUrls: ['./agregar-inspeccion-trampa.page.scss'],
})
export class AgregarInspeccionTrampaPage implements OnInit {

  tipo = "TRASPATIO";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  isSelectPobladoFincaActive = true;
  isSelectPropietarioLoteActive = false;

  poblados_fincas = [];
  propietarios_lotes = [];

  //coords:any;

  inspTrampaForm: FormGroup;

  mostrarComentario = false;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private inspeccionTrampaLocalService:InspeccionTrampaLocalService,
    private traspatioFincaLocalService:TraspatioFincaLocalService,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private dateService:DateService,
    private authService:AuthService,
    private trampaAmarillaLocalService:TrampaAmarillaLocalService) {

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
    this.isSelectPropietarioLoteActive = false;
    this.inspTrampaForm.controls['finca_poblado'].patchValue('');
    this.inspTrampaForm.controls['lote_propietario'].patchValue('');
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

  
  ionViewWillEnter(){
    /*
    if (this.route.snapshot.data['data']) {
      this.coords = this.route.snapshot.data['data'];
      this.inspTrampaForm.controls['latitud_trampa'].patchValue(this.coords.latitud);
      this.inspTrampaForm.controls['longitud_trampa'].patchValue(this.coords.longitud);
    }
    */

    
    this.traspatioFincaLocalService.getTraspatiosFincasByType(this.tipo).then((fincasPobladosList:string[])=>{
      this.poblados_fincas = fincasPobladosList;
      this.isSelectPobladoFincaActive = true;
    }).catch((error)=>{
      
    });

  }
  

  ngOnInit() {

  }

  /*
  validarFormSegunTipo(hlbForm:any):any{
    let tipo:string = hlbForm.tipo;

    if(tipo === 'traspatio'){
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
  */

  async submit(){

    try{

      if(this.inspTrampaForm.dirty && this.inspTrampaForm.valid){

        let configuracionesGenerales:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        let pais:string = configuracionesGenerales.pais.toUpperCase();
        let usuario:User = this.authService.getLogedUser();
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

  pobladoFincaSelectChange(event:any){
    let fincaPobladoSelected = event.target.value;
    if(!fincaPobladoSelected){
      return;
    }
    this.inspTrampaForm.controls['lote_propietario'].patchValue('');
    this.traspatioFincaLocalService.getPropietariosLotesByFincaPobladoName(fincaPobladoSelected).then((propietariosLotesList:string[])=>{
      this.propietarios_lotes = propietariosLotesList;
      this.isSelectPropietarioLoteActive = true;
    }).catch((error)=>{
      
    });
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

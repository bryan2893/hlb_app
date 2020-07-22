import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {TraspatioFincaLocalService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {AuthService} from '../services/auth/auth.service';
import { UserLoged } from 'src/DTO/UserLoged.dto';
import {InspeccionHlbLocalService} from '../services/inspecciones_hlb/InspeccionHlbLocal.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';
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

  isSelectPobladoFincaActive = true;
  isSelectPropietarioLoteActive = false;

  poblados_fincas = [];
  propietarios_lotes = [];

  coords:any;

  inspHlbForm: FormGroup;

  mostrarComentario = false;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private inspeccionHlbLocalService:InspeccionHlbLocalService,
    private traspatioFincaLocalService:TraspatioFincaLocalService,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private dateService:DateService,
    private authService:AuthService) {

    this.inspHlbForm = this.formBuilder.group({
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
    this.tipo = event.target.value;
    this.isSelectPropietarioLoteActive = false;
    this.inspHlbForm.controls['finca_poblado'].patchValue('');
    this.inspHlbForm.controls['lote_propietario'].patchValue('');
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
    if (this.route.snapshot.data['data']) {
      this.coords = this.route.snapshot.data['data'];
      this.inspHlbForm.controls['latitud'].patchValue(this.coords.latitud);
      this.inspHlbForm.controls['longitud'].patchValue(this.coords.longitud);
    }

    
    this.traspatioFincaLocalService.getTraspatiosFincasByType(this.tipo).then((fincasPobladosList:string[])=>{
      this.poblados_fincas = fincasPobladosList;
      this.isSelectPobladoFincaActive = true;
    }).catch((error)=>{
    });

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

      if(this.inspHlbForm.dirty && this.inspHlbForm.valid){

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
        hlbInspectionToSave['tipo'] = this.inspHlbForm.controls['tipo'].value.toUpperCase();
        hlbInspectionToSave['pais'] = pais.toUpperCase();
        hlbInspectionToSave['finca_poblado'] = this.inspHlbForm.controls['finca_poblado'].value.toUpperCase();
        hlbInspectionToSave['lote_propietario'] = this.inspHlbForm.controls['lote_propietario'].value.toUpperCase();
        hlbInspectionToSave['ciclo'] = this.inspHlbForm.controls['ciclo'].value;

        if(!(hlbInspectionToSave['tipo'] === 'TRASPATIO')){
          hlbInspectionToSave['labor'] = 'na';
          hlbInspectionToSave['categoria'] = 'na';
        }else{
          hlbInspectionToSave['labor'] = this.inspHlbForm.controls['labor'].value;//viene en mayúscula
          hlbInspectionToSave['categoria'] = this.inspHlbForm.controls['categoria'].value;//viene en mayúscula
        }

        hlbInspectionToSave['variedad'] = this.inspHlbForm.controls['variedad'].value;
        hlbInspectionToSave['sintomatologia'] = this.inspHlbForm.controls['sintomatologia'].value;
        hlbInspectionToSave['estado'] = this.inspHlbForm.controls['estado'].value;
        hlbInspectionToSave['diagnostico'] = this.inspHlbForm.controls['diagnostico'].value;
        hlbInspectionToSave['latitud'] = this.inspHlbForm.controls['latitud'].value;
        hlbInspectionToSave['longitud'] = this.inspHlbForm.controls['longitud'].value;

        if(!(hlbInspectionToSave['tipo'] === 'PRODUCTOR' || hlbInspectionToSave['tipo'] === 'TICOFRUT')){
          hlbInspectionToSave['patron'] = 'na';
          hlbInspectionToSave['calle'] = 0;
          hlbInspectionToSave['direccion_calle'] = 'na'
          hlbInspectionToSave['numero_arbol'] = 0;
          hlbInspectionToSave['dir_arbol'] = 'na';
        }else{
          hlbInspectionToSave['patron'] = this.inspHlbForm.controls['patron'].value;
          hlbInspectionToSave['calle'] = this.inspHlbForm.controls['calle'].value;
          hlbInspectionToSave['direccion_calle'] = this.inspHlbForm.controls['direccion_calle'].value;
          hlbInspectionToSave['numero_arbol'] = this.inspHlbForm.controls['numero_arbol'].value;
          hlbInspectionToSave['dir_arbol'] = this.inspHlbForm.controls['dir_arbol'].value;
        }

        

        if(this.inspHlbForm.controls['notas'].value === ''){
          hlbInspectionToSave['notas'] = 'na';
        }else{
          hlbInspectionToSave['notas'] = this.inspHlbForm.controls['notas'].value;
        }

        hlbInspectionToSave['indica_revision'] = this.inspHlbForm.controls['indica_revision'].value;

        if(this.inspHlbForm.controls['comentario'].value === ''){
          hlbInspectionToSave['comentario'] = 'na';
        }else{
          hlbInspectionToSave['comentario'] = this.inspHlbForm.controls['comentario'].value;
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

  pobladoFincaSelectChange(event:any){
    let fincaPobladoSelected = event.target.value;
    if(!fincaPobladoSelected){
      return;
    }
    this.inspHlbForm.controls['lote_propietario'].patchValue('');
    this.traspatioFincaLocalService.getPropietariosLotesByFincaPobladoName(fincaPobladoSelected).then((propietariosLotesList:string[])=>{
      this.propietarios_lotes = propietariosLotesList;
      this.isSelectPropietarioLoteActive = true;
    }).catch((error)=>{
    });
  }

  openMap(){
    let dataToSendMapViewer:PreviousUrlStructure = {urlAnterior:"",tipo:"",coordenadas:null};

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_agregar";
    dataToSendMapViewer["coordenadas"] = null;

    this.previousUrlHolderService.setDataForPreviousUrl(dataToSendMapViewer);
    this.router.navigateByUrl('/map-viewer');
  }

  marcarRegistro(event:any){
    if(event.target.value === '0'){
      this.inspHlbForm.controls['comentario'].patchValue('');
      this.mostrarComentario = false;
    }else{
      this.mostrarComentario = true;
    }
  }

}

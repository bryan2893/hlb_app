import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InspeccionHlbLocalService } from '../services/inspecciones_hlb/InspeccionHlbLocal.service';
import { TraspatioFincaLocalService } from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import { PreviousUrlHolderService } from '../services/data/previous-url-holder.service';
import { AlmacenamientoNativoService } from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import { AlertService } from '../services/alert/alert.service';
import { ToastService } from '../services/toast-service/toast.service';
import { DateService } from '../services/date/date.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';
import { User } from 'src/DTO/User.dto';

import {ACTIONS} from '../../constants/user_actions';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-ver-editar-inspeccion-hlb',
  templateUrl: './ver-editar-inspeccion-hlb.page.html',
  styleUrls: ['./ver-editar-inspeccion-hlb.page.scss'],
})
export class VerEditarInspeccionHlbPage implements OnInit {

  tipo:string;

  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  poblados_fincas = [];
  propietarios_lotes = [];

  inspHlbForm: FormGroup;

  hlbInspectionRecord:any;

  mostrarComentario = false;

  actions = ACTIONS;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService,
    private toastService:ToastService,
    private dateService:DateService,
    private authService:AuthService,
    private inspeccionHlbLocalService:InspeccionHlbLocalService) {

      this.inspHlbForm = this.formBuilder.group({
        //id_inspec_hlb,fecha_hora se guardan pero no se muestran en la interfaz
        //codigo_responsable,nombre_responsable se obtiene del usuario que esta logueado.
        tipo:['',Validators.required],
        consecutivo:['',Validators.required],
        //pais se obtiene desde almacenamiento local pero no se muestra en interrfaz.
        fecha_hora:['',Validators.required],
        codigo_responsable:[''],
        nombre_responsable:[''],
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
        indica_revision:['',Validators.required],
        comentario:['']
        //sincronizado por default se guarda como 0 ya que es un registro nuevo que debe ser sincronizado.
      });
  }

  ionViewWillEnter(){
    let inData = this.route.snapshot.data['data'];
    if (inData) {
      if(Object.keys(inData).length === 2){//Quiere decir que viene de la vista mapa
        this.inspHlbForm.controls['latitud'].patchValue(inData.latitud);
        this.inspHlbForm.controls['longitud'].patchValue(inData.longitud);
      }else{
        this.tipo = inData.tipo;
        this.hlbInspectionRecord = inData;
      }
    }
  }

  ionViewDidEnter(){
    let inData = this.route.snapshot.data['data'];
    if (inData) {
      if(!(Object.keys(inData).length === 2)){//Quiere decir que viene de la vista mapa.
        if (this.tipo === "TRASPATIO"){
          this.poblado_finca_key = "Poblado";
          this.lote_propietario_key = "Propietario";
        }else{
           this.poblado_finca_key = "Finca";
           this.lote_propietario_key = "Lote";
        }
        
        this.inspHlbForm.controls['consecutivo'].patchValue(inData.consecutivo);
        this.inspHlbForm.controls['fecha_hora'].patchValue(this.dateService.getBeautyDate(inData.fecha_hora));
        this.inspHlbForm.controls['codigo_responsable'].patchValue(inData.codigo_responsable);
        this.inspHlbForm.controls['nombre_responsable'].patchValue(inData.nombre_responsable);
        this.inspHlbForm.controls['tipo'].patchValue(inData.tipo);
        this.inspHlbForm.controls['finca_poblado'].patchValue(inData.finca_poblado);
        this.inspHlbForm.controls['lote_propietario'].patchValue(inData.lote_propietario);
        this.inspHlbForm.controls['ciclo'].patchValue(inData.ciclo);
 
         if(inData.tipo === "TRASPATIO"){
           
           this.inspHlbForm.controls['labor'].patchValue(inData.labor);
           this.inspHlbForm.controls['categoria'].patchValue(inData.categoria);
 
         }
 
         this.inspHlbForm.controls['variedad'].patchValue(inData.variedad);
         this.inspHlbForm.controls['sintomatologia'].patchValue(String(inData.sintomatologia));
         this.inspHlbForm.controls['estado'].patchValue(String(inData.estado));
         this.inspHlbForm.controls['diagnostico'].patchValue(String(inData.diagnostico));
         this.inspHlbForm.controls['latitud'].patchValue(inData.latitud);
         this.inspHlbForm.controls['longitud'].patchValue(inData.longitud);
         
         if(!(inData.tipo === "TRASPATIO")){//El tipo es igual a productor o ticofrut.
 
           this.inspHlbForm.controls['patron'].patchValue(inData.patron);
           this.inspHlbForm.controls['calle'].patchValue(inData.calle);
           this.inspHlbForm.controls['direccion_calle'].patchValue(inData.direccion_calle);
           this.inspHlbForm.controls['numero_arbol'].patchValue(inData.numero_arbol);
           this.inspHlbForm.controls['dir_arbol'].patchValue(inData.dir_arbol);
 
         }
 
         this.inspHlbForm.controls['notas'].patchValue(inData.notas);

         this.inspHlbForm.controls['indica_revision'].patchValue(String(inData.indica_revision));
         this.inspHlbForm.controls['comentario'].patchValue(inData.comentario);

      }
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

      if(this.inspHlbForm.valid){

        let configuracionesGenerales:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        let pais:string = configuracionesGenerales.pais;
        let usuario:User = this.authService.getLogedUser();
        let hlbInspectionToSave:any = {};
  
        hlbInspectionToSave['id_inspec_hlb'] = -1;
        hlbInspectionToSave['consecutivo'] = this.inspHlbForm.controls['consecutivo'].value;
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
          hlbInspectionToSave['labor'] = this.inspHlbForm.controls['labor'].value;
          hlbInspectionToSave['categoria'] = this.inspHlbForm.controls['categoria'].value;
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
          
          //******* ACTUALIZAR INSPECCION HLB AQUÍ ********/
          await  this.inspeccionHlbLocalService.updateAnHlbInspection(this.hlbInspectionRecord.id_local,hlbInspectionToSave);
          let toast = await this.toastService.showToast("El registro se modificó exitosamente!");
          await toast.present();
          
        }else{
          let alert = await this.alertService.presentAlert("Verifique que los datos están completos");
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

  openMap(){
    let dataToSendMapViewer:PreviousUrlStructure = {urlAnterior:"",tipo:"",coordenadas:null};
    let coords = {lat:this.inspHlbForm.get("latitud").value,lng:this.inspHlbForm.get("longitud").value}

    dataToSendMapViewer["urlAnterior"] = this.router.url;
    dataToSendMapViewer["tipo"] = "vista_editar";
    dataToSendMapViewer["coordenadas"] = coords;

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

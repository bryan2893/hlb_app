import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {TraspatioFincaLocalService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {DateService} from '../services/date/date.service';
import {UserService} from '../services/user/user.service';
import { User } from 'src/DTO/User.dto';
import {InspeccionHlbLocalService} from '../services/inspecciones_hlb/InspeccionHlbLocal.service';

@Component({
  selector: 'app-agregar-inspeccion-hlb',
  templateUrl: './agregar-inspeccion-hlb.page.html',
  styleUrls: ['./agregar-inspeccion-hlb.page.scss'],
})
export class AgregarInspeccionHlbPage implements OnInit {

  tipo = "traspatio";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  isSelectPobladoFincaActive = true;
  isSelectPropietarioLoteActive = false;

  poblados_fincas = [];
  propietarios_lotes = [];

  coords:any;

  inspHlbForm: FormGroup;

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
    private userService:UserService) {

      this.inspHlbForm = this.formBuilder.group({
        //id_inspec_hlb,fecha_hora se guardan pero no se muestran en la interfaz
        //codigo_responsable,nombre_responsable se obtiene del usuario que esta logueado.
        tipo:['traspatio',Validators.required],
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
        notas:['']
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
    
    if(this.tipo === "traspatio"){
      this.poblado_finca_key = "Poblado";
      this.lote_propietario_key = "Propietario";
    }

    if(this.tipo === "productor" || this.tipo === "ticofrut"){
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

  async submit(){

    try{

      if(this.inspHlbForm.dirty && this.inspHlbForm.valid){

        let configuracionesGenerales:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        let pais:string = configuracionesGenerales.pais;
        let usuario:User = this.userService.getLogedUser();
        let hlbInspectionToSave:any = {};
  
        hlbInspectionToSave['id_inspec_hlb'] = -1;
        hlbInspectionToSave['fecha_hora'] = this.dateService.getCurrentDateTime();
        hlbInspectionToSave['codigo_responsable'] = usuario.username;
        hlbInspectionToSave['nombre_responsable'] = usuario.fullName;
        hlbInspectionToSave['tipo'] = this.inspHlbForm.controls['tipo'].value;
        hlbInspectionToSave['pais'] = pais;
        hlbInspectionToSave['finca_poblado'] = this.inspHlbForm.controls['finca_poblado'].value;
        hlbInspectionToSave['lote_propietario'] = this.inspHlbForm.controls['lote_propietario'].value;
        hlbInspectionToSave['ciclo'] = this.inspHlbForm.controls['ciclo'].value;

        if(!(hlbInspectionToSave['tipo'] === 'traspatio')){
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

        if(!(hlbInspectionToSave['tipo'] === 'productor' || hlbInspectionToSave['tipo'] === 'ticofrut')){
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

        hlbInspectionToSave['sincronizado'] = 0;

        if(this.validarFormSegunTipo(hlbInspectionToSave)){
          
          await  this.inspeccionHlbLocalService.insertAnHlbInspection(hlbInspectionToSave);
          let toast = await this.toastService.showToast("Inspeccion insertada correctamente!");
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
    this.previousUrlHolderService.setPreviousUrl(this.router.url);
    this.router.navigateByUrl('/map-viewer');
  }

}

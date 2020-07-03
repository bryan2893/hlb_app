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
import {InspeccionTrampaLocalService} from '../services/inspeccion_trampas/InspeccionTrampaLocal.service';
import {TrampaAmarillaLocalService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import { PreviousUrlStructure } from 'src/DTO/previuousUrlStructure.dto';

@Component({
  selector: 'app-ver-editar-inspeccion-trampa',
  templateUrl: './ver-editar-inspeccion-trampa.page.html',
  styleUrls: ['./ver-editar-inspeccion-trampa.page.scss'],
})
export class VerEditarInspeccionTrampaPage implements OnInit {

  tipo:string;
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  isSelectPobladoFincaActive = true;
  isSelectPropietarioLoteActive = true;

  poblados_fincas = [];
  propietarios_lotes = [];

  seObtienenListasPorPrimeraVez = true;

  //coords:any;

  inspTrampaForm: FormGroup;

  trapInspectionRecord:any;

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
    private userService:UserService) {
      this.inspTrampaForm = this.formBuilder.group({
        //id_inspec_hlb,
        fecha_hora:['',Validators.required],
        codigo_responsable:['',Validators.required],
        nombre_responsable:['',Validators.required],
        tipo:['',Validators.required],
        pais:['',Validators.required],
        num_trampa:['',Validators.required],
        latitud_trampa:['',Validators.required],
        longitud_trampa:['',Validators.required],
        finca_poblado:['',Validators.required],
        lote_propietario:['',Validators.required],
        cantidad_total:['',Validators.required],
        diagnostico:['',Validators.required],
        cantidad_diagnostico:['',Validators.required],
        notas:['']
        //sincronizado por default se guarda como 0 ya que es un registro modificado que debe ser sincronizado.
      });
    }
    async ionViewWillEnter(){
      let inData = this.route.snapshot.data['data'];
      if (inData) {
        if(Object.keys(inData).length === 2){//Quiere decir que viene de la vista mapa
          this.inspTrampaForm.controls['latitud'].patchValue(inData.latitud);
          this.inspTrampaForm.controls['longitud'].patchValue(inData.longitud);
        }else{
          this.trapInspectionRecord = inData;
          this.tipo = inData.tipo;
  
          let fincas_poblados:any = await this.traspatioFincaLocalService.getTraspatiosFincasByType(this.tipo);
          this.poblados_fincas = fincas_poblados;
  
          let propietariosLotes:any = await this.traspatioFincaLocalService.getPropietariosLotesByFincaPobladoName(this.trapInspectionRecord.finca_poblado);
          this.propietarios_lotes = propietariosLotes;
  
        }
      }
    }

    ionViewDidEnter(){
      let inData = this.route.snapshot.data['data'];
      if (inData) {
        if (this.tipo === "traspatio"){
          this.poblado_finca_key = "Poblado";
          this.lote_propietario_key = "Propietario";
        }else{
            this.poblado_finca_key = "Finca";
            this.lote_propietario_key = "Lote";
        }

        console.log("En viewDinEnter" + JSON.stringify(inData));
  
        this.inspTrampaForm.controls['fecha_hora'].patchValue(this.dateService.getBeautyDate(inData.fecha_hora));
        
        this.inspTrampaForm.controls['codigo_responsable'].patchValue(inData.codigo_responsable);
        this.inspTrampaForm.controls['nombre_responsable'].patchValue(inData.nombre_responsable);
        this.inspTrampaForm.controls['tipo'].patchValue(inData.tipo);
        this.inspTrampaForm.controls['pais'].patchValue(inData.pais);
        this.inspTrampaForm.controls['num_trampa'].patchValue(inData.num_trampa);
        this.inspTrampaForm.controls['latitud_trampa'].patchValue(inData.latitud_trampa);
        this.inspTrampaForm.controls['longitud_trampa'].patchValue(inData.longitud_trampa);
        this.inspTrampaForm.controls['finca_poblado'].patchValue(inData.finca_poblado);
        this.inspTrampaForm.controls['lote_propietario'].patchValue(inData.lote_propietario);
        this.inspTrampaForm.controls['cantidad_total'].patchValue(inData.cantidad_total);
        this.inspTrampaForm.controls['diagnostico'].patchValue(inData.diagnostico);
        
        this.inspTrampaForm.controls['cantidad_diagnostico'].patchValue(inData.cantidad_diagnostico);
        this.inspTrampaForm.controls['notas'].patchValue(inData.notas);

        this.seObtienenListasPorPrimeraVez = false;//Se indica que de ahora en adelante la carga de listas de traspatios/fincas y lotes/propietarios no se cargan por primera vez.

      }

    }

  ngOnInit() {
  }

  changeType(event:any){
    if(!this.seObtienenListasPorPrimeraVez){

      this.tipo = event.target.value;
      this.isSelectPropietarioLoteActive = false;
      this.inspTrampaForm.controls['finca_poblado'].patchValue('');
      this.inspTrampaForm.controls['lote_propietario'].patchValue('');
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
        let pais:string = configuracionesGenerales.pais;
        let usuario:User = this.userService.getLogedUser();
        let trapInspectionToSave:any = {};
  
        trapInspectionToSave['id_inspec_tramp'] = -1;
        trapInspectionToSave['fecha_hora'] = this.dateService.getCurrentDateTime();
        trapInspectionToSave['codigo_responsable'] = usuario.username;
        trapInspectionToSave['nombre_responsable'] = usuario.fullName;
        trapInspectionToSave['tipo'] = this.inspTrampaForm.controls['tipo'].value;
        trapInspectionToSave['pais'] = pais;
        trapInspectionToSave['num_trampa'] = this.inspTrampaForm.controls['num_trampa'].value;
        trapInspectionToSave['latitud_trampa'] = this.inspTrampaForm.controls['latitud_trampa'].value;
        trapInspectionToSave['longitud_trampa'] = this.inspTrampaForm.controls['longitud_trampa'].value;
        trapInspectionToSave['finca_poblado'] = this.inspTrampaForm.controls['finca_poblado'].value;
        trapInspectionToSave['lote_propietario'] = this.inspTrampaForm.controls['lote_propietario'].value;
        trapInspectionToSave['cantidad_total'] = this.inspTrampaForm.controls['cantidad_total'].value;
        trapInspectionToSave['diagnostico'] = this.inspTrampaForm.controls['diagnostico'].value;
        trapInspectionToSave['cantidad_diagnostico'] = this.inspTrampaForm.controls['cantidad_diagnostico'].value;
        

        if(this.inspTrampaForm.controls['notas'].value === ''){
          trapInspectionToSave['notas'] = 'na';
        }else{
          trapInspectionToSave['notas'] = this.inspTrampaForm.controls['notas'].value;
        }

        trapInspectionToSave['sincronizado'] = 0;
        
        await  this.inspeccionTrampaLocalService.updateAnTrapInspection(this.trapInspectionRecord.id_local,trapInspectionToSave);
        let toast = await this.toastService.showToast("Inspeccion modificada correctamente!");
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
    if(!this.seObtienenListasPorPrimeraVez){
      console.log("Se ingreso por primera vez!");
      let fincaPobladoSelected = event.target.value;
      if(!fincaPobladoSelected){
        return;
      }
      this.inspTrampaForm.controls['lote_propietario'].patchValue('');
      this.traspatioFincaLocalService.getPropietariosLotesByFincaPobladoName(fincaPobladoSelected).then((propietariosLotesList:string[])=>{
        this.propietarios_lotes = propietariosLotesList;
        this.isSelectPropietarioLoteActive = true;
      }).catch((error)=>{
        this.alertService.presentAlert(error).then((alert)=>{
          alert.present();
        });
      });
    }
    
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

  /*
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
      }
    }
  }
  */

}

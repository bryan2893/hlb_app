import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {TrampaAmarillaLocalService as MantenimientosTrampasLocalDbService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import {TraspatioFincaLocalService as MantenimientosHlbLocalDbService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';
import {AlertService} from '../services/alert/alert.service';

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
    private mantenimientosTrampasLocalDbService:MantenimientosTrampasLocalDbService,
    private mantenimientosHlbLocalDbService:MantenimientosHlbLocalDbService,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private alertService:AlertService) {

      this.inspHlbForm = this.formBuilder.group({
        //id_inspec_hlb,fecha_hora se guardan pero no se muestran en la interfaz
        //codigo_responsable,nombre_responsable se obtiene del usuario que esta logueado.
        tipo:['traspatio',Validators.required],
        //pais se obtiene desde almacenamiento local pero no se muestra en interrfaz.
        finca_poblado:['',Validators.required],
        lote_propietario:['',Validators.required],
        ciclo:['',Validators.required],
        labor:['',Validators.required],
        categoria:['',Validators.required],
        variedad:['',Validators.required],
        sintomatologia:['',Validators.required],
        estado:['',Validators.required],
        diagnostico:['',Validators.required],
        latitud:['',Validators.required],
        longitud:['',Validators.required],
        patron:['',Validators.required],
        calle:['',Validators.required],
        direccion_calle:['',Validators.required],
        numero_arbol:['',Validators.required],
        dir_arbol:['',Validators.required],
        notas:['',Validators.required]
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

    
    this.mantenimientosHlbLocalDbService.getTraspatiosFincasByType(this.tipo).then((fincasPobladosList:string[])=>{
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
  }

  ngOnInit() {

  }

  async submit(){

    try{
      if(this.inspHlbForm.dirty){//si todos los campos estan completados...

        let pais:string;
        let configuracionesGenerales:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        pais = configuracionesGenerales.pais;
        

        let hlbInspectionToSave:any = {};
  
        hlbInspectionToSave['id_inspec_hlb'] = -1;
        hlbInspectionToSave['fecha_hora'] = this.inspHlbForm.controls['num_trampa'].value;//OBTENER FECHA DEL SISTEMA.
        hlbInspectionToSave['codigo_responsable'] = this.inspHlbForm.controls['tipo'].value;//OBTENER CODIGO DEL USUARIO LOGUEADO.
        hlbInspectionToSave['nombre_responsable'] = pais;//SE OBTIENE NOMBRE DEL USUARIO LOGUEADO.
        hlbInspectionToSave['tipo'] = this.inspHlbForm.controls['tipo'].value;
        hlbInspectionToSave['pais'] = this.inspHlbForm.controls['pais'].value;
        hlbInspectionToSave['finca_poblado'] = this.inspHlbForm.controls['finca_poblado'].value;
        hlbInspectionToSave['lote_propietario'] = this.inspHlbForm.controls['lote_propietario'].value;
        hlbInspectionToSave['ciclo'] = this.inspHlbForm.controls['ciclo'].value;
        hlbInspectionToSave['labor'] = this.inspHlbForm.controls['labor'].value;
        hlbInspectionToSave['categoria'] = this.inspHlbForm.controls['categoria'].value;
        hlbInspectionToSave['variedad'] = this.inspHlbForm.controls['variedad'].value;
        hlbInspectionToSave['sintomatologia'] = this.inspHlbForm.controls['sintomatologia'].value;
        hlbInspectionToSave['estado'] = this.inspHlbForm.controls['estado'].value;
        hlbInspectionToSave['diagnostico'] = this.inspHlbForm.controls['diagnostico'].value;
        hlbInspectionToSave['latitud'] = this.inspHlbForm.controls['latitud'].value;
        hlbInspectionToSave['longitud'] = this.inspHlbForm.controls['longitud'].value;
        hlbInspectionToSave['patron'] = this.inspHlbForm.controls['patron'].value;
        hlbInspectionToSave['calle'] = this.inspHlbForm.controls['calle'].value;
        hlbInspectionToSave['direccion_calle'] = this.inspHlbForm.controls['direccion_calle'].value;
        hlbInspectionToSave['numero_arbol'] = this.inspHlbForm.controls['numero_arbol'].value;
        hlbInspectionToSave['dir_arbol'] = this.inspHlbForm.controls['dir_arbol'].value;
        hlbInspectionToSave['notas'] = this.inspHlbForm.controls['notas'].value;
        hlbInspectionToSave['sincronizado'] = 0;//0 significa que no está sincronizado ya que sería un registro nuevo.
  
        await  this.mantenimientosTrampasLocalDbService.insertAtrap(hlbInspectionToSave);
        alert("Trampa insertada correctamente!");
      }else{
        alert("Verifique que los datos están completos!");
      }
    }catch(error){
      alert(error.message);
    }
  }

  pobladoFincaSelectChange(event:any){
    let fincaPobladoSelected = event.target.value;
    if(!fincaPobladoSelected){
      return;
    }
    this.inspHlbForm.controls['lote_propietario'].patchValue('');
    this.mantenimientosHlbLocalDbService.getPropietariosLotesByFincaPobladoName(fincaPobladoSelected).then((propietariosLotesList:string[])=>{
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

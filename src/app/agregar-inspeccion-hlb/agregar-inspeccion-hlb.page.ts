import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {TrampaAmarillaLocalService as MantenimientosTrampasLocalDbService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import {TraspatioFincaLocalService as MantenimientosHlbLocalDbService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';
import {AlmacenamientoNativoService} from '../services/almacenamiento-interno/almacenamiento-nativo.service';

@Component({
  selector: 'app-agregar-inspeccion-hlb',
  templateUrl: './agregar-inspeccion-hlb.page.html',
  styleUrls: ['./agregar-inspeccion-hlb.page.scss'],
})
export class AgregarInspeccionHlbPage implements OnInit {

  tipo = "traspatio";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  isSelectPobladoFincaActive = false;
  isSelectPropietarioLoteActive = false;

  poblados_fincas = [];
  propietarios_lotes = [];

  coords:any;

  seetingsForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private mantenimientosTrampasLocalDbService:MantenimientosTrampasLocalDbService,
    private mantenimientosHlbLocalDbService:MantenimientosHlbLocalDbService,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService,
    private almacenamientoNativoService:AlmacenamientoNativoService) {

    this.seetingsForm = this.formBuilder.group({
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
    this.seetingsForm.controls['finca_poblado'].patchValue('');
    this.seetingsForm.controls['lote_propietario'].patchValue('');
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
      this.seetingsForm.controls['latitud'].patchValue(this.coords.latitud);
      this.seetingsForm.controls['longitud'].patchValue(this.coords.longitud);
    }
    this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametrosDeConfiguracion)=>{
      if(parametrosDeConfiguracion === null){

      }
    });
  }

  ngOnInit() {

  }

  async submit(){

    try{
      if(this.seetingsForm.dirty){//si todos los campos estan completados...

        let pais:string;
        let configuracionesGenerales:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
        if(configuracionesGenerales !== null){
          pais = configuracionesGenerales.pais;
        }
  
        let trapMantainRegisterToSave:any = {};
  
        trapMantainRegisterToSave['id_trampa'] = -1;
        trapMantainRegisterToSave['num_trampa'] = this.seetingsForm.controls['num_trampa'].value;
        trapMantainRegisterToSave['tipo'] = this.seetingsForm.controls['tipo'].value;
        trapMantainRegisterToSave['pais'] = pais;
        trapMantainRegisterToSave['finca_poblado'] = this.seetingsForm.controls['finca_poblado'].value;
        trapMantainRegisterToSave['lote_propietario'] = this.seetingsForm.controls['lote_propietario'].value;
        trapMantainRegisterToSave['latitud'] = this.seetingsForm.controls['latitud'].value;
        trapMantainRegisterToSave['longitud'] = this.seetingsForm.controls['longitud'].value;
        trapMantainRegisterToSave['estado'] = 1;
        trapMantainRegisterToSave['sincronizado'] = 0;
  
        await  this.mantenimientosTrampasLocalDbService.insertAtrap(trapMantainRegisterToSave);
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
    this.seetingsForm.controls['lote_propietario'].patchValue('');
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

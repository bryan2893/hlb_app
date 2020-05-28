import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {LocalDbService as MantenimientosTrampasLocalDbService} from '../services/mantenimiento_trampas/local-db.service';
import {LocalDbService as MantenimientosHlbLocalDbService} from '../services/mantenimientos_hlb/local-db.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';

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

  seetingsForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private mantenimientosTrampasLocalDbService:MantenimientosTrampasLocalDbService,
    private mantenimientosHlbLocalDbService:MantenimientosHlbLocalDbService,
    private router: Router,
    private previousUrlHolderService:PreviousUrlHolderService) {

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

    
    this.mantenimientosHlbLocalDbService.getFincaPobladosByType(this.tipo).then((fincasPobladosList:string[])=>{
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
  }

  ngOnInit() {
  }

  submit(){
    if(this.seetingsForm.dirty){//si todos los campos estan completados...

      let trapMantainRegisterToSave:any = {};

      trapMantainRegisterToSave['id_original'] = -1;
      trapMantainRegisterToSave['num_trampa'] = this.seetingsForm.controls['num_trampa'].value;
      trapMantainRegisterToSave['tipo'] = this.seetingsForm.controls['tipo'].value;
      trapMantainRegisterToSave['finca_poblado'] = this.seetingsForm.controls['finca_poblado'].value;

      trapMantainRegisterToSave['lote_propietario'] = this.seetingsForm.controls['lote_propietario'].value;
      trapMantainRegisterToSave['latitud'] = this.seetingsForm.controls['latitud'].value;
      trapMantainRegisterToSave['longitud'] = this.seetingsForm.controls['longitud'].value;
      trapMantainRegisterToSave['estado'] = 1;
      trapMantainRegisterToSave['sincronizado'] = 0;

      this.mantenimientosTrampasLocalDbService.insertAtrap(trapMantainRegisterToSave).then((trap)=>{
        alert("Trampa insertada correctamente!");
      }).catch((error)=>{
        alert(error.message);
      });

    }else{
      alert("Verifique que los datos está completos!");
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

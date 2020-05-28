import { Component, OnInit } from '@angular/core';
import {Validators,FormBuilder,FormGroup} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {LocalDbService as MantenimientosHlbLocalDbService} from '../services/mantenimientos_hlb/local-db.service';
import {PreviousUrlHolderService} from '../services/data/previous-url-holder.service';

@Component({
  selector: 'app-agregar-mante-hlb',
  templateUrl: './agregar-mante-hlb.page.html',
  styleUrls: ['./agregar-mante-hlb.page.scss'],
})
export class AgregarManteHlbPage implements OnInit {
  tipo = "traspatio";
  poblado_finca_key = "Poblado";
  lote_propietario_key = "Propietario";

  coords:any;

  seetingsForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    public modalController:ModalController,
    private mantenimientosHlbLocalDbService:MantenimientosHlbLocalDbService,
    private router:Router,
    private previousUrlHolderService: PreviousUrlHolderService) {
    this.seetingsForm = this.formBuilder.group({
      pais:['',Validators.required],
      tipo:['traspatio',Validators.required],
      finca_poblado:['',Validators.required],
      lote_propietario:['',Validators.required],
      latitud:['',],
      longitud:['',]
    });
  }

  changeType(event:any){
    this.tipo = event.target.value;
    
    this.seetingsForm.controls['finca_poblado'].patchValue('');
    this.seetingsForm.controls['lote_propietario'].patchValue('');
   
    
    if(this.tipo === "traspatio"){
      this.poblado_finca_key = "Poblado";
      this.lote_propietario_key = "Propietario";
    }

    if(this.tipo === "productor" || this.tipo === "ticofrut"){
      this.poblado_finca_key = "Finca";
      this.lote_propietario_key = "Lote";
    }

  }

  ionViewWillEnter(){
    if (this.route.snapshot.data['data']) {
      this.coords = this.route.snapshot.data['data'];
      this.seetingsForm.controls['latitud'].patchValue(this.coords.latitud);
      this.seetingsForm.controls['longitud'].patchValue(this.coords.longitud);
    }
  }

  submit(){
    if(this.seetingsForm.dirty){//si todos los campos estan completados...

      let hlbMantainRegisterToSave:any = {};

      hlbMantainRegisterToSave['id_original'] = -1;
      hlbMantainRegisterToSave['pais'] = this.seetingsForm.controls['pais'].value;
      hlbMantainRegisterToSave['tipo'] = this.seetingsForm.controls['tipo'].value;
      hlbMantainRegisterToSave['finca_poblado'] = this.seetingsForm.controls['finca_poblado'].value;
      hlbMantainRegisterToSave['lote_propietario'] = this.seetingsForm.controls['lote_propietario'].value;
      hlbMantainRegisterToSave['latitud'] = this.seetingsForm.controls['latitud'].value;
      hlbMantainRegisterToSave['longitud'] = this.seetingsForm.controls['longitud'].value;
      hlbMantainRegisterToSave['estado'] = 1;
      hlbMantainRegisterToSave['sincronizado'] = 0;

      this.mantenimientosHlbLocalDbService.insertAnHlbMantain(hlbMantainRegisterToSave).then((hlbMantain)=>{
        alert("Mantenimiento hlb insertado correctamente!");
      }).catch((error)=>{
        alert(error.message);
      });

    }else{
      alert("Verifique que los datos están completos!");
    }
  }

  ngOnInit() {
  }

  openMap(){
    this.previousUrlHolderService.setPreviousUrl(this.router.url);
    this.router.navigateByUrl('/map-viewer');
  }

  borrarCoordenadas(){
    this.seetingsForm.controls['latitud'].patchValue('');
    this.seetingsForm.controls['longitud'].patchValue('');
  }

}

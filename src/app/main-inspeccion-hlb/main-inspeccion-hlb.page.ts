import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';

import {InspeccionHlbLocalService} from '../services/inspecciones_hlb/InspeccionHlbLocal.service';
import {DataContainerService} from '../services/data/data-container.service';
import {Router} from '@angular/router';
import {DateService} from '../services/date/date.service';

import {AuthService} from '../services/auth/auth.service';
import {ACTIONS} from '../../constants/user_actions';

@Component({
  selector: 'app-main-inspeccion-hlb',
  templateUrl: './main-inspeccion-hlb.page.html',
  styleUrls: ['./main-inspeccion-hlb.page.scss'],
})
export class MainInspeccionHlbPage implements OnInit {

  @ViewChild('searchbar',{static:false}) searchBar: IonSearchbar;
  searchBarActive = false;
  private rowsPerPage = 13;
  private pageCounter = 1;
  pagesQuantity = 0;
  inspeccionTraspatiosFincasList = [];
  actions = ACTIONS;

  constructor(private inspeccionHlbLocalService: InspeccionHlbLocalService,
    private dataContainerService:DataContainerService,
    private router:Router,
    private dateService:DateService,
    private authService:AuthService) {}

  ngOnInit() {}

  ionViewWillEnter(){
    this.inspeccionTraspatiosFincasList = [];
    this.pageCounter = 1;
    this.inspeccionHlbLocalService.getPagesQuantity(this.rowsPerPage).then((pagesQuantity:number)=>{
      this.pagesQuantity = pagesQuantity;
    }).then(()=>{
      this.inspeccionHlbLocalService.getInspHlbPage(this.pageCounter,this.rowsPerPage).then((hlbInspectionsList)=>{
        this.addMoreHlbInspectionsItems(hlbInspectionsList);
        console.log(hlbInspectionsList);
        this.pageCounter += 1;
      });
    });
  }

  ionViewWillLeave(){
    this.inspeccionTraspatiosFincasList = [];
    this.pagesQuantity = 0;
  }

  

  whenUserPressAKey(event:any){
    let value = event.target.value;
    this.inspeccionHlbLocalService.findHlbInspections(value).then((listaDeInspeccionesEncontradas:any)=>{
      this.inspeccionTraspatiosFincasList = listaDeInspeccionesEncontradas;
    }).catch((error)=>{
      console.log(error);
    });
  }

  change(event:any){
    this.searchBarActive = !this.searchBarActive;
    if(this.searchBarActive){
      setTimeout(() => {
        this.searchBar.setFocus();
      },100);
    }else{
      this.pageCounter = 1;
      this.inspeccionHlbLocalService.getInspHlbPage(this.pageCounter,this.rowsPerPage).then((hlbInspectionsList:any)=>{
        this.inspeccionTraspatiosFincasList = hlbInspectionsList;
        this.pageCounter += 1;
      });
    }
  }

  loadInspections(event:any){
    this.inspeccionHlbLocalService.getInspHlbPage(this.pageCounter,this.rowsPerPage).then((hlbInspectionsList)=>{
      this.addMoreHlbInspectionsItems(hlbInspectionsList);
      this.pageCounter += 1;
      event.target.complete();
    });
  }

  addMoreHlbInspectionsItems(hlbInspectionPage:any) {
    for (let i = 0; i < hlbInspectionPage.length; i++) {  
      this.inspeccionTraspatiosFincasList.push(hlbInspectionPage[i]); 
    }
  }

  onItemClick(inspHlbItem:any){
    this.dataContainerService.setData(inspHlbItem);
    this.router.navigateByUrl('/ver-editar-inspeccion-hlb');
  }

  convertirFecha(date:string){
    return this.dateService.getBeautyDate(date);
  }

}

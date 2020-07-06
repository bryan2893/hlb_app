import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';

import {InspeccionTrampaLocalService} from '../services/inspeccion_trampas/InspeccionTrampaLocal.service';
import {DataContainerService} from '../services/data/data-container.service';
import {Router} from '@angular/router';
import {DateService} from '../services/date/date.service';

@Component({
  selector: 'app-main-inspeccion-trampa',
  templateUrl: './main-inspeccion-trampa.page.html',
  styleUrls: ['./main-inspeccion-trampa.page.scss'],
})
export class MainInspeccionTrampaPage implements OnInit {

  @ViewChild('searchbar',{static:false}) searchBar: IonSearchbar;
  searchBarActive = false;
  private rowsPerPage = 13;
  private pageCounter = 1;
  pagesQuantity = 0;
  inspeccionTrampasList = [];

  constructor(private inspeccionTrampaLocalService: InspeccionTrampaLocalService,
    private dataContainerService:DataContainerService,
    private router:Router,
    private dateService:DateService) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.inspeccionTrampasList = [];
    this.pageCounter = 1;
    this.inspeccionTrampaLocalService.getPagesQuantity(this.rowsPerPage).then((pagesQuantity:number)=>{
      this.pagesQuantity = pagesQuantity;
    }).then(()=>{
      this.inspeccionTrampaLocalService.getInspTrampaPage(this.pageCounter,this.rowsPerPage).then((trapInspectionList)=>{
        this.addMoreTrapInspectionsItems(trapInspectionList);
        console.log(trapInspectionList);
        this.pageCounter += 1;
      });
    });
  }

  ionViewWillLeave(){
    this.inspeccionTrampasList = [];
    this.pagesQuantity = 0;
  }

  

  whenUserPressAKey(event:any){
    let value = event.target.value;
    this.inspeccionTrampaLocalService.findTrapInspections(value).then((listaDeInspeccionesEncontradas:any)=>{
      this.inspeccionTrampasList = listaDeInspeccionesEncontradas;
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
      this.inspeccionTrampaLocalService.getInspTrampaPage(this.pageCounter,this.rowsPerPage).then((hlbInspectionsList:any)=>{
        this.inspeccionTrampasList = hlbInspectionsList;
        this.pageCounter += 1;
      });
    }
  }

  loadInspections(event:any){
    this.inspeccionTrampaLocalService.getInspTrampaPage(this.pageCounter,this.rowsPerPage).then((hlbInspectionsList)=>{
      this.addMoreTrapInspectionsItems(hlbInspectionsList);
      this.pageCounter += 1;
      event.target.complete();
    });
  }

  addMoreTrapInspectionsItems(trapInspectionPage:any) {
    for (let i = 0; i < trapInspectionPage.length; i++) { 
      this.inspeccionTrampasList.push(trapInspectionPage[i]);
    }
  }

  onItemClick(inspTrampaItem:any){
    this.dataContainerService.setData(inspTrampaItem);
    this.router.navigateByUrl('/ver-editar-inspeccion-trampa');
  }

  convertirFecha(date:any){
    return this.dateService.getBeautyDate(date);
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';
import {TraspatioFincaLocalService} from '../services/traspatios_fincas/TraspatioFincaLocal.service';
import {DataContainerService} from '../services/data/data-container.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-mante-hlb',
  templateUrl: './main-mante-hlb.page.html',
  styleUrls: ['./main-mante-hlb.page.scss'],
})
export class MainManteHlbPage implements OnInit {

  @ViewChild('searchbar',{static:false}) searchBar: IonSearchbar;
  searchBarActive = false;
  private rowsPerPage = 13;
  private pageCounter = 1;
  pagesQuantity = 0;
  mantains = [];

  constructor(private traspatioFincaLocalService:TraspatioFincaLocalService,
    private dataContainerService:DataContainerService,
    private router: Router) { }

  ionViewWillEnter(){
    this.mantains = [];
    this.pageCounter = 1;
    this.traspatioFincaLocalService.getPagesQuantity(this.rowsPerPage).then((quantity:number)=>{
      this.pagesQuantity = quantity;
    }).then(()=>{
      this.traspatioFincaLocalService.getTraspatiosFincasPage(this.pageCounter,this.rowsPerPage).then((mantainsList)=>{
        this.addMoreHlbMantains(mantainsList);
        this.pageCounter += 1;
      });
    });
  }

  ngOnInit() {
  }


  change(){
    
    this.searchBarActive = !this.searchBarActive;
    if(this.searchBarActive){
      setTimeout(() => {
        this.searchBar.setFocus();
      },100);
    }else{
      this.pageCounter = 1;
      this.traspatioFincaLocalService.getTraspatiosFincasPage(this.pageCounter,this.rowsPerPage).then((mantains:any)=>{
        this.mantains = mantains;
        this.pageCounter += 1;
      });
    }

  }

  whenUserPressAKey(event:any){
    let value = event.target.value.toUpperCase();
    
    this.traspatioFincaLocalService.findTraspatiosFincas(value).then((listaDetraspatiosEncontrados:any)=>{
      this.mantains = listaDetraspatiosEncontrados;
    }).catch((error)=>{
      console.log(error);
    });
  }

  loadMantains(event:any){
    this.traspatioFincaLocalService.getTraspatiosFincasPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
      this.addMoreHlbMantains(trapsList);
      this.pageCounter += 1;
      event.target.complete();
    });

  }

  addMoreHlbMantains(mantainsPage:any) {

    for (let i = 0; i < mantainsPage.length; i++) {  
      this.mantains.push(mantainsPage[i]);   
    }
  }

  onItemClick(traspatioFincaItem:any){
    this.dataContainerService.setData(traspatioFincaItem);
    this.router.navigateByUrl('/ver-editar-traspatio-finca');
  }

}

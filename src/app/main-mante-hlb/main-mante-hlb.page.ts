import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';
import {LocalDbService} from '../services/mantenimientos_hlb/local-db.service';

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

  constructor(private localDbService:LocalDbService) { }

  ionViewWillEnter(){
    this.mantains = [];
    this.pageCounter = 1;
    this.localDbService.isDatabaseReady().subscribe((response)=>{
      if(response){
        this.localDbService.getPagesQuantity(this.rowsPerPage).then((quantity:number)=>{
          this.pagesQuantity = quantity;
        }).then(()=>{
          this.localDbService.getHlbMantainPage(this.pageCounter,this.rowsPerPage).then((mantainsList)=>{
            this.addMoreHlbMantains(mantainsList);
            this.pageCounter += 1;
          });
        });
      }
    });
  }

  ngOnInit() {
  }

  obtenerNumeroPaginas(){
    this.localDbService.getPagesQuantity(this.rowsPerPage).then((quantity) => {
      alert(quantity);
    });
  }

  obtenerPaginaTrampas(){
    this.localDbService.getHlbMantainPage(1,0).then((data)=>{
      alert(JSON.stringify(data));
    });
  }

  async contarRegistros(){

    try{
      let registro = await this.localDbService.count_hlb_mantains();
      alert(registro.cantidad);
      return registro.cantidad;
    }catch(error){
      throw new Error(error.message);
    }

  }

  change(){
    this.searchBarActive = !this.searchBarActive;
    setTimeout(() => {
      this.searchBar.setFocus();
    },100);
  }

  loadMantains(event){
    this.localDbService.getHlbMantainPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
      this.addMoreHlbMantains(trapsList);
      this.pageCounter += 1;
      event.target.complete();
    });

  }

  addMoreHlbMantains(mantainsPage) {

    for (let i = 0; i < mantainsPage.length; i++) {  
      this.mantains.push(mantainsPage[i]);   
    }  
  }

}

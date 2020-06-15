import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';
import {LocalDbService} from '../services/mantenimiento_trampas/local-db.service';

@Component({
  selector: 'app-main-trampas-amarillas',
  templateUrl: './main-trampas-amarillas.page.html',
  styleUrls: ['./main-trampas-amarillas.page.scss'],
})
export class MainTrampasAmarillasPage implements OnInit {

  @ViewChild('searchbar',{static:false}) searchBar: IonSearchbar;
  searchBarActive = false;
  private rowsPerPage = 13;
  private pageCounter = 1;
  pagesQuantity = 0;
  traps = [];

  constructor(private localDbService: LocalDbService) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.traps = [];
    this.pageCounter = 1;
    this.localDbService.isDatabaseReady().subscribe((response)=>{
      if(response){
        this.localDbService.getPagesQuantity(this.rowsPerPage).then((quantity:number)=>{
          this.pagesQuantity = quantity;
        }).then(()=>{
          this.localDbService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
            this.addMoreTrapItems(trapsList);
            this.pageCounter += 1;
          });
        });
      }
    });
  }

  obtenerNumeroPaginas(){
    this.localDbService.getPagesQuantity(this.rowsPerPage).then((quantity) => {
      alert(quantity);
    });
  }

  obtenerPaginaTrampas(){
    this.localDbService.getTrapsPage(1,0).then((data)=>{
      alert(JSON.stringify(data));
    });
  }

  async contarRegistros(){

    try{
      let registro = await this.localDbService.countTraps();
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

  loadTraps(event){
    this.localDbService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
      this.addMoreTrapItems(trapsList);
      this.pageCounter += 1;
      event.target.complete();
    });

  }

  addMoreTrapItems(trapsPage) {

    for (let i = 0; i < trapsPage.length; i++) {  
      this.traps.push(trapsPage[i]);   
    }  
  } 

}

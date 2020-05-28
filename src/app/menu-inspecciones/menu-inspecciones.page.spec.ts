import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuInspeccionesPage } from './menu-inspecciones.page';

describe('MenuInspeccionesPage', () => {
  let component: MenuInspeccionesPage;
  let fixture: ComponentFixture<MenuInspeccionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuInspeccionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuInspeccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

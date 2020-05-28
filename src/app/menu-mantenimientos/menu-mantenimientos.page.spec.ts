import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuMantenimientosPage } from './menu-mantenimientos.page';

describe('MenuMantenimientosPage', () => {
  let component: MenuMantenimientosPage;
  let fixture: ComponentFixture<MenuMantenimientosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuMantenimientosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuMantenimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

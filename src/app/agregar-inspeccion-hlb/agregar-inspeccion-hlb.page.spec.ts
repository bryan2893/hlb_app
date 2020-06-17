import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgregarInspeccionHlbPage } from './agregar-inspeccion-hlb.page';

describe('AgregarInspeccionHlbPage', () => {
  let component: AgregarInspeccionHlbPage;
  let fixture: ComponentFixture<AgregarInspeccionHlbPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarInspeccionHlbPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarInspeccionHlbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

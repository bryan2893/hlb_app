import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgregarManteHlbPage } from './agregar-mante-hlb.page';

describe('AgregarManteHlbPage', () => {
  let component: AgregarManteHlbPage;
  let fixture: ComponentFixture<AgregarManteHlbPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarManteHlbPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarManteHlbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

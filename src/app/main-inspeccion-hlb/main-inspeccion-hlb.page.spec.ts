import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainInspeccionHlbPage } from './main-inspeccion-hlb.page';

describe('MainInspeccionHlbPage', () => {
  let component: MainInspeccionHlbPage;
  let fixture: ComponentFixture<MainInspeccionHlbPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainInspeccionHlbPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainInspeccionHlbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

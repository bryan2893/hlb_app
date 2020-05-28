import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainManteHlbPage } from './main-mante-hlb.page';

describe('MainManteHlbPage', () => {
  let component: MainManteHlbPage;
  let fixture: ComponentFixture<MainManteHlbPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainManteHlbPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainManteHlbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

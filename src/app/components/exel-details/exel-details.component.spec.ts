import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExelDetailsComponent } from './exel-details.component';

describe('ExelDetailsComponent', () => {
  let component: ExelDetailsComponent;
  let fixture: ComponentFixture<ExelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExelDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

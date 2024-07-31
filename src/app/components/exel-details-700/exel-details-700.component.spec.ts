import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExelDetails700Component } from './exel-details-700.component';

describe('ExelDetails700Component', () => {
  let component: ExelDetails700Component;
  let fixture: ComponentFixture<ExelDetails700Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExelDetails700Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExelDetails700Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

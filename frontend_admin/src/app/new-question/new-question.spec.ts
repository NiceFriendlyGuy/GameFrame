import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuestion } from './new-question';

describe('NewQuestion', () => {
  let component: NewQuestion;
  let fixture: ComponentFixture<NewQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

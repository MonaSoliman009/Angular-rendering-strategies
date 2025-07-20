import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg } from './ssg';

describe('Ssg', () => {
  let component: Ssg;
  let fixture: ComponentFixture<Ssg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ssg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ssg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

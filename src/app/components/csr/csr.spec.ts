import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Csr } from './csr';

describe('Csr', () => {
  let component: Csr;
  let fixture: ComponentFixture<Csr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Csr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Csr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

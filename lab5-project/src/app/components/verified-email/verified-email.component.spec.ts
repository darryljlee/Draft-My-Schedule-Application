import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedEmailComponent } from './verified-email.component';

describe('VerifiedEmailComponent', () => {
  let component: VerifiedEmailComponent;
  let fixture: ComponentFixture<VerifiedEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifiedEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

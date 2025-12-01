import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissions } from './admin-permissions';

describe('AdminPermissions', () => {
  let component: AdminPermissions;
  let fixture: ComponentFixture<AdminPermissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPermissions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPermissions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderInventory } from './provider-inventory';

describe('ProviderInventory', () => {
  let component: ProviderInventory;
  let fixture: ComponentFixture<ProviderInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

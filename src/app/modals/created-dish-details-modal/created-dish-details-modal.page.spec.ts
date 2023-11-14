import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatedDishDetailsModalPage } from './created-dish-details-modal.page';

describe('CreatedDishDetailsModalPage', () => {
  let component: CreatedDishDetailsModalPage;
  let fixture: ComponentFixture<CreatedDishDetailsModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreatedDishDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [CommonModule, SharedModule],
  exports: [DashboardLayoutComponent],
})
export class DashboardLayoutModule {}

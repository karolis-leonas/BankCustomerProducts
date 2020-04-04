import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitWindowComponent } from '../components/submit-window/submit-window.component';
import { DynamicWindowComponent } from '../components/dynamic-window/dynamic-window.component';

const routes: Routes = [
  {
    path: 'submit-example',
    component: SubmitWindowComponent,
    pathMatch: 'full'
  },
  {
    path: 'dynamic-example',
    component: DynamicWindowComponent,
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'submit-example', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

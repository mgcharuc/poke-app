import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './modules/home/components/profile/profile.component';

const routes: Routes = [
  { path: '**', pathMatch: 'full', redirectTo: 'home' }, {
    path: 'home',
    component: ProfileComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

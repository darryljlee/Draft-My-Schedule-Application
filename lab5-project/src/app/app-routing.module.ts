import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateScheduleComponent } from './components/create-schedule/create-schedule.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
//import { HomeComponent } from './components/home/home.component';
import { ManageScheduleComponent } from './components/manage-schedule/manage-schedule.component';

const routes: Routes = [
 
  {path: 'createschedule', component: CreateScheduleComponent},
  {path: 'manageschedule', component: ManageScheduleComponent},
  {path:'login', component: LoginPageComponent},
  {path: '', redirectTo:'createschedule', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


export const routingComponents = [CreateScheduleComponent, ManageScheduleComponent, LoginPageComponent]
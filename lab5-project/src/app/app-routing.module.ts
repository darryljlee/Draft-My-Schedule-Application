import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateScheduleComponent } from './components/create-schedule/create-schedule.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ManageScheduleComponent } from './components/manage-schedule/manage-schedule.component';
import { BrowseComponent } from './components/browse/browse.component';
import { HomeComponent } from './components/home/home.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';






const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'createschedule', component: CreateScheduleComponent},
  {path: 'manageschedule', component: ManageScheduleComponent},
  {path:'login', component: LoginPageComponent},
  {path:'browse', component: BrowseComponent},
  {path:'createaccount', component:CreateAccountComponent},
  {path: '', redirectTo:'home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


export const routingComponents = [CreateScheduleComponent, ManageScheduleComponent, LoginPageComponent, BrowseComponent, HomeComponent, CreateAccountComponent]
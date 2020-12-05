import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';


import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import { CreateScheduleComponent } from './components/create-schedule/create-schedule.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import {HttpClientModule} from '@angular/common/http';
import { BrowseComponent } from './components/browse/browse.component';
import { HomeComponent } from './components/home/home.component';
import { AuthNavbarComponent } from './components/auth-navbar/auth-navbar.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VerifiedEmailComponent } from './components/verified-email/verified-email.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { ManageScheduleComponent } from './components/manage-schedule/manage-schedule.component';
import { SettingsComponent } from './components/settings/settings.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common' 

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CreateScheduleComponent,
    LoginPageComponent,
    BrowseComponent,
    HomeComponent,
    AuthNavbarComponent,
    CreateAccountComponent,
    NavbarComponent,
    VerifiedEmailComponent,
    AdministratorComponent,
    ManageScheduleComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{provide: LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

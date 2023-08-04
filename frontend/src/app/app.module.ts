import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ExamApiService } from 'src/exams.api.service';
import { ExamsComponent } from './exams/exams.component';
import { ExamFormComponent } from './exams/exams-form.component';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import * as Auth0 from 'auth0-web';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule, MatButtonModule} from '@angular/material';


const appRoutes: Routes = [
  { path: 'new-exam', component: ExamFormComponent },
  { path: 'callback', component: CallbackComponent },
  { path: '', component: ExamsComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    ExamsComponent,
    ExamFormComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    BrowserAnimationsModule,
    NoopAnimationsModule,
  ],
  providers: [ExamApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    Auth0.configure({
      domain: 'dev-q2wxneobv523a517.eu.auth0.com',
      audience: 'http://0.0.0.0:5000/exams',
      clientID: '3TtAly5diCtOnr3e2qSo2aT3UDNSxThb',
      redirectUri: 'http://localhost:4200/callback',
      scope: 'openid profile manage:exams'
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Exam } from 'src/exam.model';
import { ExamApiService } from 'src/exams.api.service';
import * as Auth0 from 'auth0-web';


@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  examsList: Exam[] = [];
  authenticated = false;
  constructor(private examsApi: ExamApiService){}

  signIn = Auth0.signIn;
  signOut = Auth0.signOut;
  getProfile = Auth0.getProfile;

  ngOnInit(): void {
    this.examsApi.getExams().subscribe(res => {this.examsList = res}, console.error);
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

}

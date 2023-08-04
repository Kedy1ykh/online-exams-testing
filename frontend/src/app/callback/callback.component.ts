import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Auth0 from 'auth0-web';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const self = this;
    Auth0.handleAuthCallback((err) => {
      if (err) alert(err);
      self.router.navigate(['/']);
    });
  }
}

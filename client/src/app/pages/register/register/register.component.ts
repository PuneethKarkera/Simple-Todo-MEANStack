import { Component } from '@angular/core';
import {
  AuthenticationService,
  TokenPayload,
} from 'src/app/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/lists');
      },
      (err) => {
        console.error(err);
      }
    );
  }
}

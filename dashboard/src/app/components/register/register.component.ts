import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username : String;
  email: String;
  password : String;

  constructor(private validateService : ValidateService, private ngFlashMessageService: NgFlashMessageService) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      name : this.name,
      username : this.username,
      email : this.email,
      password : this.password
    }

    // required fields
    if(!this.validateService.validateRegister(user)){
      this.ngFlashMessageService.showFlashMessage({messages:['Please Fill all the fields'],type:'danger',timeout:3000});
      return false;
    }
    if(!this.validateService.validateEmail(user.email)){
      this.ngFlashMessageService.showFlashMessage({messages:['Please use a valid email'],type:'danger',timeout:3000});
      return false;
    }
  }

}

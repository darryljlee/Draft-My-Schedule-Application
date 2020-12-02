import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  email!: String;
  password!: String;
  url = "http://localhost:3000/"
  constructor(private http:HttpClient, private route: Router) { }

  login():void{
    var accountInfo = {
      email: this.email,
      password: this.password
    }
    this.http.post<any>(this.url+'login', accountInfo).subscribe(data=> {
      console.log(data)
      if(data.message=="You didn't fill out all forms"){
        alert("You didn't fill out all forms")
      }

      else if(data.message=="You are an administrator"){
       this.route.navigate(['/administrator'])
      }
      else if(data.message=="Unable to login"){
        alert("Unable to login")
      }
      else if(data.message=="email not found"){
        alert("email not found")
      }
      else if(data.message=="Account inactive, contact support admin"){
        alert("Account inactive, contact support admin")
      }
      else if(data.message=="Incorrect password"){
        alert("Incorrect password")
      }
      else if(data.message=="sorry, unable to login"){
        alert("sorry, unable to login")
      }
      else if(data.message=="sorry, unable to login"){
        alert("sorry, unable to login")
      }
      else if(data.message=="you have been logged in"){
        alert("you have been logged in")
        localStorage.timetabletoken = data.accessToken;
        this.route.navigate(['/createschedule'])
      }
    })
  }

  ngOnInit(): void {
  }

}

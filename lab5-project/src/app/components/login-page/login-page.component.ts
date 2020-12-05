import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username!:String;
  email!: String;
  password!: String;
  verification!:String;
  url = "http://localhost:3000/";
  constructor(private http:HttpClient, private route: Router) { }
  showVerifyButton:boolean = false;


  login():void{
    var accountInfo = {
      email: this.email,
      password: this.password
    }
    this.http.post<any>(this.url+"login", accountInfo).subscribe(data=> {
     // console.log(data)
      if(data.message=="You didn't fill out all forms"){
        alert("You didn't fill out all forms")
      }
      else if (data.message=="Invalid email"){
        alert("Invalid email")
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
        alert("Account inactive, click the button to verify your account. Support scheduleAdmin@uwo.ca ")
        this.showVerifyButton = true;
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
        localStorage.timetabletoken = data.accessToken; //create a local storage variable called "timetabletoken" and then set it equal to accessToken from app.js
        localStorage.setItem("username", data.username)
        localStorage.setItem("email", data.email)

        this.route.navigate(['/createschedule'])
      }
      else if(data.message=="Your account has been deactivated"){
        alert("Your account has been deactivated. Please contact support admin at scheduleAdmin@uwo.ca. ")
      }
      else if(data.message=="Your account has been deactivated"){
        alert("Your account has been deactivated. Please contact support admin at scheduleAdmin@uwo.ca. ")
      }
     
    })
  }
  verifiedEmail(){
    var verifiedInfo = {
      username:this.username,
      email:this.email,
      password: this.password,
      verification: this.verification
    }
    this.http.put<any>(this.url+"verification", verifiedInfo).subscribe (data => {
      if(data.message == "This email is verified"){
        this.route.navigate(['/verified-email'])
      }
    })
  }

  ngOnInit(): void {
  }

}

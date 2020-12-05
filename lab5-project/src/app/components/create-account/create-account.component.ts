import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Router} from '@angular/router';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  username!:String;
  email!: String;
  password!:String;
  verification!:String;
  url = "http://localhost:3000/";

  constructor(private http:HttpClient, private route: Router) { }
  showVerifyButton:boolean = false;
  createAccount():void{
    var userProfile = {
      username:this.username,
      email:this.email,
      password: this.password,
      verification: this.verification
    }
    this.http.post<any>(this.url+"registeruser", userProfile).subscribe(data=> {
      if(data.message == "Account is created!"){
        alert("Account is created! Your username is "+this.username)
        this.showVerifyButton = true;
      }
      else if(data.message== "This email is already registered"){
        console.log("huh")
        alert("This email is already registered")
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

import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  userInfo:any[];
  url = "http://localhost:3000/";
  constructor(private http: HttpClient) {
    this.userInfo=[];
   }
  ngOnInit(): void { //populate dropdown to show all the registered users and their respective emails
    this.http.get<any>(this.url+"showallusers").subscribe(data =>{ //get request to get all the stored schedules and to append those existing names to the dropdown
      const populateUsers = document.getElementById("usersdropdown")
      for(let i =0; i<data.length; i++){
        var userEntry = document.createElement("option");
        var userText = document.createTextNode(data[i].email);
        userEntry.appendChild(userText);
        populateUsers?.appendChild(userEntry);
      } 
    })
  }

  deactivateUser(){ //deactivate a user by email
    var chosenUser = (<HTMLInputElement>document.getElementById("usersdropdown")).value;
    var model = {
      email: chosenUser
    }
    this.http.put<any>(this.url+"api/deactivate", model).subscribe(data => {
    if(data.message == "Deactivated"){
      alert("This account "+chosenUser+" is now deactivated")
    }
    })
   }

   reactivateUser(){
    var chosenUserToReactivate = (<HTMLInputElement>document.getElementById("usersdropdown")).value;
    var reactivatedUser = {
      email: chosenUserToReactivate
    }
    this.http.put<any>(this.url+"api/reactivate", reactivatedUser).subscribe(data => {
    if(data.message == "Reactivated"){
      alert("This account "+chosenUserToReactivate+" is now reactivated")
    }
    })

   }


}

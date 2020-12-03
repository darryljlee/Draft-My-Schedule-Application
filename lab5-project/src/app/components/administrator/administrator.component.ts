import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  userInfo:any[];
  constructor(private http: HttpClient) {
    this.userInfo=[];
   }
  ngOnInit(): void {
    this.http.get<any>("http://localhost:3000/showallusers").subscribe(data =>{ //get request to get all the stored schedules and to append those existing names to the dropdown
      const populateUsers = document.getElementById("usersdropdown")
      for(let i =0; i<data.length; i++){
        var userEntry = document.createElement("option");
        var userText = document.createTextNode(data[i].email);
        userEntry.appendChild(userText);
        populateUsers?.appendChild(userEntry);
      } 
    })
  }




}

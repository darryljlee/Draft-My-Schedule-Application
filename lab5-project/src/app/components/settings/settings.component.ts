import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  url = "http://localhost:3000/";
  constructor(private http: HttpClient, private route: Router) { }

  ngOnInit(): void {
  }

  changePassword(){
    const newPassword = (<HTMLInputElement>document.getElementById('password')).value;
    //call the backend for the result
    this.http.put<any>(this.url+"updatepassword", {schedToken: localStorage.timetabletoken, password:newPassword}).subscribe(data=>{
    if(data.message){
      alert(data.message)
    }
    })
  }

}

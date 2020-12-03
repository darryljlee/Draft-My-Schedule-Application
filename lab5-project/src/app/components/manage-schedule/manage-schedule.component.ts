import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-manage-schedule',
  templateUrl: './manage-schedule.component.html',
  styleUrls: ['./manage-schedule.component.css']
})
export class ManageScheduleComponent implements OnInit {
  schedules: any [];
  constructor(private http: HttpClient) { 
    this.schedules=[];
  }
 

  //displaySchedule functon that's called when user clicks on "Display Schedule"
  displaySchedule():void{
    const getSelected = (<HTMLInputElement>document.getElementById('schedulesdropdown')).value;
    this.http.get<any>("http://localhost:3000/api/schedules/getSchedule?name="+getSelected).subscribe(data => {
    this.schedules = []; 
    for (let i=0; i<data.length; i++){
      //edit: at 8:11 PM Dec 2, an issue was resolved where the app did not load the courses inside a schedule. So I changed the http request on the below line and added localhost:3000. This may be a source of error on deployment.
      this.http.get<any>("http://localhost:3000/api/courses/search/" + data[i].subject + "/" +data[i].catalog_nbr).subscribe((scheduleData:any)=> {  
        this.schedules.push(scheduleData) //pushes the data from the schedule specified by the user in the schedules dropdown
      })
    }
    })
  }

  /*deleteSchedule function that's called when the user clicks on "Delete All Schedules" */
  deleteSchedules(): void{
    this.http.delete<any>("http://localhost:3000/api/schedules/deleteall").subscribe(data =>{ //delete api request to the backend
        alert("You have deleted all the schedules.") //show alert with the following text
       //location.reload(); //automatically reload the webapge to update the dropdown
    })
  }

  //deleteChosenSchedule function that's called when the user clicks on "Delete Chosen Schedule"
  deleteChosenSchedule():void{
    var chosenSchedule = (<HTMLInputElement>document.getElementById('schedulesdropdown')).value; //store the value chosen in the existing schedules dropdown
    this.http.delete<any>("http://localhost:3000/api/schedules/?name="+chosenSchedule).subscribe(data => { //delete request for a specified schedule name
      if(data.message="the selected schedule has been deleted"){ //if message received from backend is the following, then show the alert saying that chosen schedule is deleted
        alert("The schedule "+chosenSchedule+ " is now deleted.")
        //location.reload(); //automatically reload page once schedule is deleted
      }
    })
  }
  //when webpage for manage schedules appears, populated the schedules dropdown with existing schedules names
  ngOnInit(): void {
    this.http.get<any>("http://localhost:3000/api/schedules/getallschedules").subscribe(data =>{ //get request to get all the stored schedules and to append those existing names to the dropdown
      const allSchedules = document.getElementById("schedulesdropdown")
      for(let i =0; i<data.length; i++){
        var scheduleName = document.createElement("option");
        var scheduleText = document.createTextNode(data[i].nameSched);
        scheduleName.appendChild(scheduleText);
        allSchedules?.appendChild(scheduleName);
      } 
    })
  }

}

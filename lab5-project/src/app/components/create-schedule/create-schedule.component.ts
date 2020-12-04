import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//
@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  specialChars = /^[^<>:/?#@!&;]*$/;
  courses: any [ ];

  constructor(private http: HttpClient) { 
    this.courses = []
  }

  putIntoSchedule = [];
//createSchedule functon that's called when user clicks on "create schedule button"
  createSchedule():void{
    var nameInput = (<HTMLInputElement>document.getElementById('newschedule')).value;
    var descInput = (<HTMLInputElement>document.getElementById('description')).value;
    if(!nameInput.match(this.specialChars) || !descInput.match(this.specialChars)){
      alert("Invalid input! Try not to enter special characters in either the name or description. These include ^[^<>:/?#@!&;]*$/") //check if any special characters are entered inside the form
      return;
    }
    
    this.http.post<any>("http://localhost:3000/api/schedules/createaschedule?name="+nameInput+"&description="+descInput, nameInput).subscribe(data =>{ //make a post request to create a schedule when user enters Create Schedule
      alert("You've created a nice name for your schedule. The schedule name you've created is "+nameInput+" and your description is "+descInput+"") //show alert to confirm creation of schedule and the name they've selected
      //location.reload(); //allow the page to reload with updated changes once the schedule has been created
    }
  )
  }
  addCourseToSchedule(subject:String, courseNumber:String){ //function that's called when the [+] button is clicked next to a course
    var nameOfSchedule = (<HTMLInputElement>document.getElementById('schedulesdropdown')).value;
    this.http.put<any>("http://localhost:3000/api/schedules/updateCourse?nameSched="+nameOfSchedule+ "&subject="+subject+"&courseNumber="+courseNumber, nameOfSchedule).subscribe(data =>{
      alert("You've created a nice name for your schedule. The schedule name you've created is "+nameOfSchedule)
  }
  )
  }


  submitResults():void{
    var existingDiv = document.getElementById("searchResults")
    //existingDiv.innerHTML = "";
    //existingDiv.setAttribute("class", "message");
    var subjectChoice = (<HTMLInputElement>document.getElementById("Subject")).value; //create a variable that will link the subject choice to submit button  
    var numberChoice = (<HTMLInputElement>document.getElementById("numberInput")).value;
    var componentChoice = (<HTMLInputElement>document.getElementById("Component")).value;
    var submitRequest = "http://localhost:3000/api/courses/submit?" +"Subject=" + subjectChoice + "&CourseNumber=" + numberChoice + "&Component=" + componentChoice; 
  
  
  this.http.get<any>(submitRequest).subscribe((data: any) => {
    this.courses = data;  //refers to array of type any
  
   //else if only a course number is entered, alert appears
  if(subjectChoice=="ALL SUBJECTS" && numberChoice!="" && componentChoice=="AllComponent"){
    alert("Please don't enter just a course number only")
  }
  
  //else if only a component is entered, alert appears
  else if(subjectChoice=="ALL SUBJECTS" && numberChoice=="" && componentChoice!="AllComponent"){
    alert("Please don't enter just a component only")
  }
  })}
  
  ngOnInit(): void {
    /*The following get request is used to get all the subject names to populate the form for Subject, and to remove duplicates when
    receiving from the JSON file */
    this.http.get<any>("http://localhost:3000/api/courses").subscribe(data => { 
      var getSubjects = document.getElementById("Subject"); 
        //remove the duplicates found in the json file for all the subjects, if a duplicate is found, skip it and go to the next index
        let tempArray = [];
        for(let i=0; i<data.length; i++){  
          
          let skip = false;
          for(let j = 0; j < tempArray.length; j++) { 
              if(tempArray[j] == data[i].subject) {
                skip = true; //if duplicate is found, let skip = true, and then do not store the subject name
               break;
              }
          }
            if(skip) continue;
          
            var subjectNameOptions = document.createElement("option");
            var subjectTextNode = document.createTextNode(data[i].subject) //subjects array is declared after begin returned from the server
            tempArray.push(data[i].subject);
            subjectNameOptions.appendChild(subjectTextNode);
            getSubjects?.appendChild(subjectNameOptions); //append the subjects from the json file to the dropdown
         }
    })

    //get request to populate the schedules dropdown to show all existing schedules 
    this.http.get<any>("http://localhost:3000/api/schedules/getallschedules").subscribe(data =>{ 
      const allSchedules = document.getElementById("schedulesdropdown")
      for(let i =0; i<data.length; i++){ //
        var scheduleName = document.createElement("option");
        var scheduleText = document.createTextNode(data[i].nameSched);
        scheduleName.appendChild(scheduleText);// append to the schedules dropdown and its respective text as well
        allSchedules?.appendChild(scheduleName);
      } 
    })
  }
}

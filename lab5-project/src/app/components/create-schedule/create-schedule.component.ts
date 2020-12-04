import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


//
@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  specialChars = /^[^<>:/?#@!&;]*$/;
  courses: any [ ];
  url = "http://localhost:3000/";


  constructor(private http: HttpClient, private route: Router) { 
    this.courses = []
  }

  putIntoSchedule = [];
//createSchedule functon that's called when user clicks on "create schedule button"
  createSchedule():void{
    var nameInput = (<HTMLInputElement>document.getElementById('newschedule')).value;
    var descInput = (<HTMLInputElement>document.getElementById('description')).value;
    if(nameInput.match(this.specialChars)||descInput.match(this.specialChars)){
      var scheduleToken = {
        timetabletoken:localStorage.timetabletoken,
      }
    if(descInput==""){
    this.http.post<any>(this.url+"api/schedules/createaschedule?name="+nameInput+"&schedToken="+localStorage.timetabletoken,"").subscribe(data=>{
      alert (data.message);
      //location.reload;
    })
    }
    else{
      this.http.post<any>(this.url+"api/schedules/createaschedule?name="+nameInput+"&description="+descInput+"&schedToken="+localStorage.timetabletoken,"").subscribe(data =>{ //make a post request to create a schedule when user enters Create Schedule
      alert("You've created a nice name for your schedule. The schedule name you've created is "+nameInput+" and your description is "+descInput+"") //show alert to confirm creation of schedule and the name they've selected
      location.reload(); //allow the page to reload with updated changes once the schedule has been created
    }
      )
    }   
    }
    else{
      alert("Invalid input")
    }
  }
  addCourseToSchedule(subject:String, courseNumber:String){ //function that's called when the [+] button is clicked next to a course
    var nameOfSchedule = (<HTMLInputElement>document.getElementById('schedulesdropdown')).value;
    this.http.put<any>(this.url+"api/schedules/updateCourse?nameSched="+nameOfSchedule+ "&subject="+subject+"&courseNumber="+courseNumber, nameOfSchedule).subscribe(data =>{
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
    var submitRequest = this.url+"api/courses/submit?" +"Subject=" + subjectChoice + "&CourseNumber=" + numberChoice + "&Component=" + componentChoice; 
  
  
  this.http.get<any>(submitRequest).subscribe((data: any) => {
    this.courses = data;  //refers to array of type any
  
   //else if only a course number is entered, alert appears
  if(subjectChoice=="ALL SUBJECTS" && numberChoice!="" && componentChoice=="AllComponent"){
    //alert("Please don't enter just a course number only")
  }
  
  //else if only a component is entered, alert appears
  else if(subjectChoice=="ALL SUBJECTS" && numberChoice=="" && componentChoice!="AllComponent"){
    alert("Please don't enter just a component only")
  }
  })}

  logout(){
    localStorage.timetabletoken="";
  }
  
  ngOnInit(): void {
    
    if(localStorage.timetabletoken=="" || localStorage.timetabletoken==undefined){
      this.route.navigate(['/home']);
    }

    this.http.get<any>(this.url+"api/courses").subscribe(data => { 
      var getSubjects = document.getElementById("Subject"); 
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
    this.http.get<any>(this.url+"api/schedules/getallschedules?schedToken="+localStorage.timetabletoken).subscribe(data =>{ 
      const allSchedules = document.getElementById("schedulesdropdown")
      for(let i =0; i<data.length; i++){ //
        var scheduleName = document.createElement("option");
        var scheduleText = document.createTextNode(data[i]);
        scheduleName.appendChild(scheduleText);// append to the schedules dropdown and its respective text as well
        allSchedules?.appendChild(scheduleName);
      } 
    })
  }

  createreview(receivedSubject:String, receivedCatalogNum:String, receivedClassName:String){
    var model = { //left side needs to match the backend
      username: localStorage.getItem("username"),
      courseName: receivedClassName,
      courseSubject: receivedSubject,
      courseID: receivedCatalogNum,
      dateCreated: Date(),
      theTypedReview: (<HTMLInputElement>document.getElementById("createreview")).value
    }

    this.http.put<any>(this.url+"addreview", model).subscribe(data =>{
    alert("Your review has been added!")
    })
  }
}

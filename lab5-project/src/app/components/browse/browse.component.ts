import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//
@Component({
  selector: 'app-create-schedule',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  specialChars = /^[^<>:/?#@!&;]*$/;
  constructor(private http: HttpClient) { 
    this.courses = []
  }

  courses: any [];
  putIntoSchedule = [];
//createSchedule functon that's called when user clicks on "create schedule button"
  createSchedule():void{
    var nameInput = (<HTMLInputElement>document.getElementById('newschedule')).value;
    if(!nameInput.match(this.specialChars)){
      alert("Invalid input! Try not to enter special characters") //check if any special characters are entered inside the form
      return;
    }
    this.http.post<any>("http://localhost:3000/api/schedules/createaschedule?name="+nameInput, nameInput).subscribe(data =>{ //make a post request to create a schedule when user enters Create Schedule
      alert("You've created a nice name for your schedule. The schedule name you've created is "+nameInput) //show alert to confirm creation of schedule and the name they've selected
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
    var subjectChoice = (<HTMLInputElement>document.getElementById("Subject")).value; //create a variable that will link the subject choice to submit button  
    var numberChoice = (<HTMLInputElement>document.getElementById("numberInput")).value;
    var componentChoice = (<HTMLInputElement>document.getElementById("Component")).value;
    var submitRequest = "http://localhost:3000/api/courses/submit?" +"Subject=" + subjectChoice + "&CourseNumber=" + numberChoice + "&Component=" + componentChoice; 
  
    
  this.http.get<any>(submitRequest).subscribe((data: any) => {
    this.courses = data;  //refers to array of type any
  
   //else if only a course number is entered, alert appears
  // if(subjectChoice=="ALL SUBJECTS" && numberChoice!="" && componentChoice=="AllComponent"){
  //   alert("Please don't enter just a course number only")
  // }
  
  //else if only a component is entered, alert appears
  if(subjectChoice=="ALL SUBJECTS" && numberChoice=="" && componentChoice!="AllComponent"){
    alert("Please don't enter just a component only")
  }
  })}

  searchByKeyword(){
    var keywordInput = (<HTMLInputElement>document.getElementById("keyword")).value;
    var keywordQuery = '/checkkeywords?key='+keywordInput;
    this.http.get<any>("http://localhost:3000"+keywordQuery).subscribe(data => {
      if(data.length == undefined){
        alert(data.message);
        return;
      }
      this.courses=data;
    })
  }

  keyworddetails(subject:String, catalog_nbr:String){
    this.http.get<any>("http://localhost:3000/api/courses/search/"+subject+"/"+catalog_nbr).subscribe(data => {
    let displayedKeywordString = "";       //Alert string to be displayed

    displayedKeywordString += data.subject + " " + data.catalog_nbr + "\r\n";
    for(let i = 0; i < data.course_info.length; i++) {
      displayedKeywordString += data.course_info[i].class_nbr + "\r\n";
      displayedKeywordString += data.course_info[i].facility_ID + "\r\n";
      displayedKeywordString += data.course_info[i].campus + "\r\n";
      displayedKeywordString += data.course_info[i].facility_ID + "\r\n";
      displayedKeywordString += data.course_info[i].descr + "\r\n";
      displayedKeywordString += data.course_info[i].instructors + "\r\n";
      displayedKeywordString += data.course_info[i].class_nbr + "\r\n";
      displayedKeywordString += data.course_info[i].enrl_stat + "\r\n";
      displayedKeywordString += data.catalog_description + "\r\n";
    }
    alert(displayedKeywordString);   //Display the course's details
    
    })
  }
  
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



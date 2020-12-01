const express = require('express'); //creates an express app
const app = express();              // start an express app
const port = 3000;
const low = require('lowdb')
const data = require("./Lab3-timetable-data.json");
app.use(express.static('dist/angular-lab4')); 
const FileSync = require('lowdb/adapters/FileSync')
const joi = require('joi') //impor joi dependency
app.use(express.json());
const adapter = new FileSync('db.json')
const db = low(adapter)
const specialChars = /^[^<>:/?#@!&;]*$/;
var cors = require('cors')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//const adaptToken = new Filesync ('tokens.json')

/////////////////////////////////////////////////////////////////
const encrypt = require('bcrypt') //declare encrypthing thing
const adapter_1 = new FileSync('allUserInfo.json')
const allUserInfo = low(adapter_1)
allUserInfo.defaults({ all_users: [] }).write()
app.use(cors());

/*Anything in between these big lines is for lab 5 login */
/////////////////////////////////////////////////////////////////////////// 
require('dotenv').config()
const jwt = require('jsonwebtoken')
app.use(express.json()); 

// app.get('/posts', authenticateToken, (req,res)=> {
//     res.json(posts.filter(post => post.username == req.user.name)) 
// })
// var storage = [];
// app.put('/login', (req,res) => {
// const email1 = req.body.email;
// const password1 = req.body.password;

// if(!email1||!password1){
//     return res.send({message: "You didn't fill out all forms"})
// }

// const userProfile = {
//     email:email1,
//     password: password1
//   }
// const storage1 = allUserInfo.get('all_users').find({email:email1}).value()
// const storage2 = allUserInfo.get('all_users').find({password:password1}).value()

// console.log(storage1)

// if(storage1 != undefined && storage2 != undefined){
// res.send(storage1)
// }
// //if passwords match, send a message that you are given permission. Inside I'd need to check token info. Check if email is ACTIVE
// //check email, check matching passwords, then check jwt

// const resultValidation = validateIncomingEmail(email1);

// if (resultValidation.error){
//     return res.send({message: "Invalid email"});
// }

// const adminEmail = "scheduleAdmin@uwo.ca"
// const adminPassword = "lab5"

// if(email1 == adminEmail && password1==adminPassword){

//     let user = {
//         email, 
//         password,
//         username:"Administrator"
//     }

//     try{
//         const adminToken = generateAdminToken(user);
//         const adminRefreshToken = jwt.sign(user, ADMIN_TOKEN_SECRET);
//         adaptToken.get('tokens').push({adminRefreshToken: adminRefreshToken})
//         return res.send({
//             accessToken: adminAccessToken,
//             refreshToken: adminRefreshToken,
//             username: user.username,
//             message:"You are an administrator"
//         })
//     }
//     catch {
//         return res.send({
//             message: "Unable to login"
//         })
//     }
// }

// const user = user_db.get('all_users').find({email: email1}).value();

// if(user == null){
//     return res.send({
//         message: "email not found"
//     })
// }
// else if (user.verification != "Active"){
//     return res.send({message:"Account inactive, contact support admin"})
// }

// try{
//     if(await bcrypt.compare(password. user.password)){
//         const accessToken = generateAccessToken(user);
//         const refreshToken = jwt.sign(user,REFRESH_TOKEN_SECRET);
//         adaptToken.get('tokens').push({refreshToken: refreshToken}).write();
//         res.send({
//             accessToken:accessToken,
//             refreshToken:refreshToken,
//             username:user.username
//         })
//     }
//     else{
//         return res.send({
//             message: "Incorrect password"
//         })
//     }
// }
// catch {
//     return res.send({
//         message:"sorry, unable to login"
//     })
// }

// // const username = req.body.username;
// // const user = {name: username}
// // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
// // res.json({accessToken:accessToken})

// })

// function generateAccessToken(user){
//     return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn:'20m'})
// }

// function generateAdministratorAccessToken(user){
//     return jwt.sign(user, ADMIN_TOKEN_SECRET, {expiresIn: '20m'})
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////very dangerous ^^^
// function authenticateToken(req,res,next){
// const authHeader = req.headers['authorization']
// const token = authHeader && authHeader.split(' ')[1] //return token as undefined or the actual token
// if (token == null){
// return res.sendStatus(401);
// }
// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
//     if(err){
//         return res.sendStatus(403); //"we see you have a token, but you no longer have access"
//     }
//     req.user = user;
//     next();

// })
// }

app.post('/registeruser', async(req,res) => {
const hasher = await encrypt.genSalt();
const protectedPassword = await encrypt.hash(req.body.password, hasher); //hash the unprotected password received from body with req.body.password


const model = { //pass sensitive info into body 
    username: req.body.username,
    email: req.body.email,
    password: protectedPassword,
    verification: req.body.verification
}
//checkEmail = req.body.email;
if(allUserInfo.get('all_users').find({email: req.body.email}).value()){
return res.status(400).send({message:"This email is already registered"});
}
else{
    if(validateIncomingEmail(req.body.email)){
        allUserInfo.get('all_users').push(model).write()
        res.status(200).send({message:"Account is created!"})
        return;
    }
    else{
        res.status(400).send({message:"Invalid email"})
        return;
    }
     
}
})

function validateIncomingEmail(incomingEmail) {
    const symbols = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return incomingEmail.match(symbols);
}

storeVerification = [];
app.put('/verification', (req,res)=> {
//verifyEmail = req.body.email;
storeVerification = allUserInfo.get('all_users').find({email: req.body.email}).assign({verification:"Active"}).write()
res.status(200).send({message:"This email is verified"})
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

db.defaults({ schedules: [] }).write() //create the existing defaults for the db.json file. 

//Question 1: to implement the backend functionality for showing the entire JSON file
app.get('/api/courses', (req,res) => {
let returnedArray = [];
for (i=0; i< data.length; i++){ //iterate through the json file push all the course's subjects and course numbers in returnedArray[]
    returnedArray.push({
        "subject": data[i].subject,
        "className": data[i].className
    });
} 
removeDuplicates(returnedArray);
res.send(returnedArray); //send the returnedArray
})


function removeDuplicates(Array){ //any array passed through here is filtered of its duplicates
    return Array.filter((a,b) => Array.indexOf(a) === b) 
};
//Item 2: to implement the backend functionality where you can search by subject code ONLY. Uncomment the lines in the if statement
//if you want to see the catalog number and the course name as well.
app.get('/api/courses/search/:subjectCode' , (req,res) => {
    const getSubject = req.params.subjectCode; 
    let returnedArray = [];
    for (i=0; i< data.length; i++){
        if(getSubject ==data[i].subject){
            returnedArray.push({
                //"subject": data[i].subject,
                "catalogNumber": data[i].catalog_nbr,
               //"classdesc": data[i].className
            })
        }
    }
    if(returnedArray.length <= 0){
        res.status(404).send("couldn't find matching searches for your subject code")
    }
    else{
        res.send(returnedArray);
    } 
}
)
//new for lab 5
app.get('/api/courses/searchnum/:catalognum' , (req,res) => {
    const catalognum = req.params.catalognum.toUpperCase(); 
    let numArray = [];
    for (i=0; i< data.length; i++){
        if(catalognum ==data[i].catalog_nbr){
            numArray.push(data[i])
        }
    }
    if(numArray.length <= 0){
        res.status(404).send("couldn't find matching searches for your catalog number")
    }
    else{
        res.send(numArray);
    } 
}
)

//Item 3: get request for an inputted subject name and catalog number and an optional component
app.get('/api/courses/search/:subjectCode/:catalognum' , (req,res) => {
    //input sanitization for input of subject name, course number, and component
    const schemanocomponent = joi.object({})
    const resultValid = schemanocomponent.validate(req.query);

    constWithComponent = joi.object({
        component:joi.string().max(3).min(3).required()
    })
    const withComponentResult = constWithComponent.validate(req.query);

    if(resultValid.error && withComponentResult.error){
        res.status(400).send({message: "Bad query."})
        return;
    }
    const getSubject = req.params.subjectCode; 
    const getCatalog = req.params.catalognum;
    
    if(!req.query.component){                                                 
    for (i=0; i< data.length; i++){
        if(getSubject ==data[i].subject && getCatalog==data[i].catalog_nbr){
            res.send(data[i])
            return;
            }
        }
    }
    else {
        for (i=0; i< data.length; i++){
            if(getSubject ==data[i].subject && getCatalog==data[i].catalog_nbr && req.query.component == data[i].course_info[0].ssr_component){
                res.send(data[i])
                return; 
            }
        }
    }
    res.send("No matching search results") //won't execute if something is returned in the if or else statement
}
)


//Q4 the backend functionality that allows user to enter the name of the schedule they want
app.post('/api/schedules/createaschedule' , (req,res) => {
    //input sanitization for the input of the name of the schedule
    const schema = joi.object({
        name: joi.string().max(20).min(1).regex(specialChars).required()
    })

    const resultValid = schema.validate(req.query);
    if(resultValid.error){
        res.status(400).send({message: "Bad query."})
        return;
    }
    storedData = req.query; 
 
    if(db.get('schedules').find({nameSched:storedData.name}).value()){
    return res.status(400).send({message:"You've already created a schedule of this name."});    
    }
    else{
        db.get('schedules').push({nameSched:storedData.name, listOfCourses:[]}).write()
        return res.status(200).send(
            {message:"You have added a schedule"}
            )
    }
 })

//Q5 replace the course pairs inside an existing schedule. If the schedule name doesn't exist

app.put('/api/schedules/addCourse', (req, res) => {
    /*Input sanitization here, there will be two because one is a query, another is an array in the body.*/
    const queryschema = joi.object({
        nameSched: joi.string().max(20).regex(specialChars).required()
    })
    const bodyschema=joi.object({
        listOfCourses:joi.array().regex(specialChars).required() //required means you have to have this.
    })

    const resultValid = queryschema.validate(req.query);
    const resultsValid2 = bodyschema.validate(req.body);
    if(resultValid.error){
        res.status(400).send({message: "Bad message."})
        return;
    }
    else if(resultsValid2.error){
        res.status(400).send({message:"Bad body request"})
    }
    const name = req.query.nameSched;
    const scheduleCourses = req.body.listOfCourses;
    let schedules = db.get('schedules').find({nameSched: name}).value(); 
    if(schedules) {//if an existing schedule name matches what the user enters
      schedules.listOfCourses = scheduleCourses; 
      db.set({schedules: schedules}).write(); //update the subject-course pairs in the selected schedule
      res.send("Course is added");
    } else {
      res.status(404).send("400 error"); //if a schedule that doesn't exist is trying to be updated, send back this error
    }
  });
//this is the new one for q5, course code, subject, 
app.put('/api/schedules/updateCourse', (req,res) => {
    const queryschema = joi.object({
        nameSched: joi.string().max(20).regex(specialChars).required(),
        subject: joi.string().max(20).regex(specialChars).required(),
        courseNumber: joi.string().max(5).min(5).regex(specialChars).required()
    })
    const resultValid = queryschema.validate(req.query);
    if(resultValid.error){
        res.status(400).send({message: "Bad message."})
        return;
    }
    const name = req.query.nameSched;
    const subject = req.query.subject;
    const courseNumber = req.query.courseNumber;
    let schedules = db.get('schedules').find({nameSched: name}).value(); 
    if(schedules) {//if an existing schedule name matches what the user enters
        let duplicate = false;
        for(i = 0; i < schedules.listOfCourses.length; i++) {
        if(schedules.listOfCourses[i].subject == subject && schedules.listOfCourses[i].catalog_nbr == courseNumber) {
        duplicate = true;
        break;
        }
        }
        if(duplicate){
            res.status(400).send("You've already added this course");
            return;
        }
        schedules.listOfCourses.push({"subject":subject,"catalog_nbr":courseNumber} ); 
        db.set({schedules: schedules}).write(); //update the subject-course pairs in the selected schedule
        res.send("Course is added");
      } else {
        res.status(404).send("400 error"); //if a schedule that doesn't exist is trying to be updated, send back this error
      }
}
)

//Q6: this back enf functionality is to show the courses for a specified schedule name. 
app.get('/api/schedules/getSchedule' ,  (req,res) => {
    //input sanitization for the schedule name input
    const schema = joi.object({
        name: joi.string().max(20).min(1).required()
    })

    const resultValid = schema.validate(req.query);
    if(resultValid.error){
        res.status(400).send({message: "Bad request."})
        return;
    }

    const findSchedule = req.query.name;
    const schedules = db.get('schedules').find({nameSched:findSchedule}).value ();

    if(schedules){ //if user input name matches an existing name, res.send the courses associated with that schedule
        res.send(schedules.listOfCourses); 
    }
    else{
        res.status(404).send({message: "Cannot find the specified schedule."})
    }
}
)

//Q7: this app delete request is responsible for deleting a schedule depending on the query name that the user enters.
app.delete('/api/schedules', (req,res) => {
//input sanitization
const deleteschema = joi.object({
name: joi.string().max(20).min(1).required()
})

const resultValid = deleteschema.validate(req.query);
if(resultValid.error){
res.status(400).send({message: "Bad query."})
return;
}

storedData = req.query.name;
if(db.get('schedules').find({nameSched: storedData}).value()){ ///if user input name matches an existing schedule name, delete the entire schedule
    db.get('schedules').remove({nameSched: storedData}).write()
    res.status(200).send({message:"the selected schedule has been deleted"});
}
else{
    return res.status(404).send({
        message: "The schedule you inputted is not found" //else, send back a 404 message saying not found.
    })
}
})

//Q8: this app get function is responsible for returning all the schedules stored inside the db.json
app.get('/api/schedules/getallschedules', (req,res) => {
let courses = [];

courses = db.get('schedules').value();
res.send(courses);
}
)
//Q9: this app delete method is responsible for deleting all of the schedules stored inside the db.json file
app.delete('/api/schedules/deleteall', (req,res) => {
db.unset("schedules").write(); //deletes schedule array containing all saved schedules 
db.defaults({ schedules: [] }).write() //creates the new defaults (making a new array)
res.send({message: "You have deleted all schedules. "});
})

///this get request helps submit the information that's been entered in the forms in the frontend
app.get('/api/courses/submit' , (req,res) => {

finalQuery = req.query;  //query variable that stores everythign the user wants to submit
querySubjectName = finalQuery.Subject;  //the subject attriute of their final query
queryCourseNum = finalQuery.CourseNumber.toUpperCase(); //the course attribute of their final query
queryComponent = finalQuery.Component; //the component attribute of their final query


if(querySubjectName=="ALL SUBJECTS" && queryCourseNum == "" && queryComponent=="AllComponent"){ // if statement if th user doesn't choose anything inside any of the forms 
res.send({
    message: "You've exceeded the amount of maximum search results"  //message is sent to the frontend saying that the maximum amount of search results has been reached
})
}

//this is the else if that runs if all the forms have something entered inside.
else if (querySubjectName!="ALL SUBJECTS" && queryCourseNum != "" && queryComponent!="AllComponent"){ 
    let allStored = []; 
    for(i=0; i< data.length; i++){ //if else if is satisfied, then iterate through the json file and then push all matching search results into the array
        if(querySubjectName==data[i].subject && queryCourseNum==data[i].catalog_nbr && queryComponent==data[i].course_info[0].ssr_component){
            allStored.push(data[i]);
        }
    }
    res.send(allStored); //send back the array with the search results
}
//this is the else if that runs if the subject and the course number are specified only (not component)
else if(querySubjectName!="ALL SUBJECTS" && queryCourseNum != "" && queryComponent=="AllComponent"){
    let allStored = [];
    for(i=0; i< data.length; i++){ //if else if is satisfied, then iterate through the json file and then push all matching search results into the array
        if(querySubjectName==data[i].subject && queryCourseNum==data[i].catalog_nbr){
            allStored.push(data[i]);
        }
    }
    res.send(allStored);
}

//search with subject only
else if (querySubjectName!="ALL SUBJECTS" && queryCourseNum == "" && queryComponent=="AllComponent"){
let allStored=[];
for(i=0; i< data.length; i++){
    if(querySubjectName==data[i].subject){
        allStored.push(data[i]);
    }
}
res.send(allStored)
}
//search by coursenum only
else if (querySubjectName=="ALL SUBJECTS" && queryCourseNum != "" && queryComponent=="AllComponent"){
    let allStored = [];
    for(i=0; i< data.length; i++){
        if(queryCourseNum==data[i].catalog_nbr){
            allStored.push(data[i]);
        }
    }
    res.send(allStored)
}

//search by component only
else if (querySubjectName=="ALL SUBJECTS" && queryCourseNum == "" && queryComponent!="AllComponent"){
    res.send({
        message: "Do not search by component only."  //send back a message saying that you cannot search by component only 
    })
}
}
)

app.listen(port, () => console.log('Listening on port 3000')) //the listen method that specifies the port the localhost will be on and shows console log message in terminal
const express = require('express'); //creates an express app
const app = express();              // start an express app
const port = 3000;
app.use(express.json());
const low = require('lowdb')
const data = require("./Lab3-timetable-data.json");
app.use(express.static('dist/angular-lab4')); 
const FileSync = require('lowdb/adapters/FileSync')
const joi = require('joi') 
const adapter = new FileSync('db.json')
const db = low(adapter)
const specialChars = /^[^<>:/?#@!&;]*$/;
var cors = require('cors')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const adaptToken = new FileSync ('tokens.json') 
const Tokens = low(adaptToken)
Tokens.defaults({tokens:[]}).write()
require('dotenv').config()
const jwt = require('jsonwebtoken')


const encrypt = require('bcrypt') //declare encrypthing thing
const adapter_1 = new FileSync('allUserInfo.json')
const allUserInfo = low(adapter_1)
allUserInfo.defaults({ all_users: [] }).write()
app.use(cors());
const similarity = require('string-similarity')

const ADMIN_TOKEN = "XjQ61FvPkqnaqQ3p3raz";
const ACCESS_TOKEN = "n9rhIUzmXzQK08Nao8dZ";
const REFRESH_TOKEN_SECRET = "SXSPh7lRk9gkURwZ1xiS";

var storage = [];
app.post('/login', async(req,res) => {
const loginEmail = req.body.email;
const loginPassword = req.body.password;

if(!loginEmail||!loginPassword){
    return res.send({message: "You didn't fill out all forms"})
}


const resultValidation = validateIncomingEmail(loginEmail);

if (resultValidation == null){
    return res.send({message: "Invalid email"});
}

//Administrator code
const adminEmail = "scheduleAdmin@uwo.ca"
const adminPassword = "lab5"

if(loginEmail == adminEmail && loginPassword==adminPassword){
    let loggedIn = {
        loginEmail, 
        loginPassword,
        username:"Administrator"
    }

    try{
        const adminToken = generateAdministratorAccessToken(loggedIn);
        const adminRefreshToken = jwt.sign(loggedIn, ADMIN_TOKEN);
        Tokens.get('tokens').push({adminRefreshToken: adminRefreshToken}).write()
        return res.send({
            accessToken: adminToken,
            REFRESH_TOKEN_SECRET: adminRefreshToken,
            username: loggedIn.username,
            message:"You are an administrator"
        })
    }
    catch {
        return res.send({
            message: "Unable to login"
        })
    }
}
//administrator code
const userLogin = allUserInfo.get('all_users').find({email: loginEmail}).value();

if(userLogin == null){
    return res.send({
        message: "email not found"
    })
}
else if (userLogin.verification == "Inactive"){
    return res.send({message:"Account inactive, contact support admin"})
}
else if(userLogin.verification == "Deactivated"){
    return res.send({message: "Your account has been deactivated"})
}

    encrypt.compare(loginPassword, userLogin.password, function(err, comparison){
        if(!err){
            if(comparison){
                const accessToken = generateAccessToken(userLogin);
                const refreshToken = jwt.sign(userLogin,REFRESH_TOKEN_SECRET);
                Tokens.get('tokens').push({REFRESH_TOKEN_SECRET: refreshToken}).write();
                res.send({
                    accessToken:accessToken,
                    refreshingToken:refreshToken,
                    username:userLogin.username,
                    email: userLogin.email,
                    message:"you have been logged in"
                })
            }
            else{
                return res.send({
                    message: "Incorrect password"
                })
            }
        }
        else{
            return res.send({
                message:"sorry, unable to login"
            })
        }
    }    
)
})



//register lab 5
app.post('/registeruser', async(req,res) => {
const hasher = await encrypt.genSalt();
const protectedPassword = await encrypt.hash(req.body.password, hasher); //hash the unprotected password received from body with req.body.password

const model = { //pass sensitive info into body 
    username: req.body.username,
    email: req.body.email,
    password: protectedPassword,
    //verification: req.body.verification
    verification: "Inactive"
}

if(allUserInfo.get('all_users').find({email: req.body.email}).value()){
res.send({message:"This email is already registered"});
return;
}
else{
    if(validateIncomingEmail(req.body.email)){
        allUserInfo.get('all_users').push(model).write()
        res.send({message:"Account is created!"})
        return;
    }
    else{
        res.send({message:"Invalid email"})
        return;
    }
}
})
//verification
storeVerification = [];
app.put('/verification', (req,res)=> {
//verifyEmail = req.body.email;
storeVerification = allUserInfo.get('all_users').find({email: req.body.email}).assign({verification:"Active"}).write()
res.status(200).send({message:"This email is verified"})
})

//validation
function validateIncomingEmail(incomingEmail) {
    const symbols = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return incomingEmail.match(symbols);
}


function generateAdministratorAccessToken(loggedIn){
    return jwt.sign(loggedIn, ADMIN_TOKEN, {expiresIn: '20m'})
}

//generate tokens
function generateAccessToken(loggedIn){
    return jwt.sign(loggedIn, ACCESS_TOKEN, {expiresIn:'20m'})
}


//deactivate user
app.put('/api/deactivate' , (req,res) => {
deactivate = req.body.email;
deactivateUser = allUserInfo.get('all_users').find({email:deactivate}).assign({verification: "Deactivated"}).write();
res.send({message: "Deactivated"})
})
//reactivate user
app.put('/api/reactivate' , (req,res) => {
    reactivate = req.body.email;
    reactivateUser = allUserInfo.get('all_users').find({email:reactivate}).assign({verification: "Active"}).write();
    res.send({message: "Reactivated"})
})

app.put('/public', (req,res) => {
//public = req.body.scheduleToChange; 
publicSchedule = db.get('schedules').find({nameSched:req.body.scheduleToChange}).assign({visible: "Public"}).write();
res.send({message: "This schedule is now public"})
})

app.put('/private', (req,res) => {
   // private = req.body.makePrivateSchedule; 
    privateSchedule = db.get('schedules').find({nameSched:req.body.scheduleToChange}).assign({visible: "Private"}).write();
    res.send({message: "This schedule is now private"})
   })
   

app.get('/checkkeywords', (req,res) => {
        key = req.query.key.toUpperCase();
        let words = [];
        for (i=0; i<data.length;i++){
            let idName = data[i].className;
            let catalog = data[i].catalog_nbr.toString();
            let wordComparison = similarity.compareTwoStrings(idName, key);
            let compareCatalog = similarity.compareTwoStrings(catalog, key);
            if(wordComparison >=0.63 || compareCatalog >=0.63){ //checks for difference in characters
                words.push(data[i]);
            }
        }
        if(words.length ==0){
            res.send({message: "No matching search results"})
        }
        else{
            res.send(words)
        }
})

app.get('/showallusers', (req,res) => {
    let userStorage = [];
    userStorage = allUserInfo.get('all_users').value();
    res.send(userStorage);
}
)

app.put('/updatepassword', async(req,res)=> {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////input sanitize here
    console.log(req.body)
    let userInfo = {};
    let schedToken= req.body.schedToken;
    try {
        userInfo = jwt.verify(schedToken, ACCESS_TOKEN); //schedToken is encrypted user data, and access token is key to encrypted data. jwt.verify
    } catch(err) {
        res.send("An error occurred");
        return;
    }

const hasher = await encrypt.genSalt();
const protectedPassword = await encrypt.hash(req.body.password, hasher);
if(allUserInfo.get("all_users").find({email: userInfo.email})){//find the user who made the update password request
allUserInfo.get("all_users").find({email: userInfo.email}).assign({password:protectedPassword}).write();
res.send({message: "Your password is now changed"})
} 
else{
    res.send({message: "User cannot be found"})
}
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
        res.send("couldn't find matching searches for your subject code")
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
        res.send("couldn't find matching searches for your catalog number")
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
        res.send({message: "Bad query."})
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
app.post('/api/schedules/createaschedule' , (req,res) => {    //input sanitization. Potential room for error
    
    const schema = joi.object({
        name: joi.string().max(20).min(1).regex(specialChars).required(),
        description: joi.string().max(20).regex(specialChars),
        schedToken : joi.string().required()
    })

    const resultValid = schema.validate(req.query);
    if(resultValid.error){
        res.send({message: "Bad query."})
        return;
    }
    storedData = req.query; 

    let userInfo = {};
    let schedToken= req.query.schedToken;
    try {
        userInfo = jwt.verify(schedToken, ACCESS_TOKEN); //change AccessToken
    } catch(err) {
        res.send("An error occurred");
        return;
    }

    //let ownerOfSchedule = userInfo.username;
    //let ownerOfEmail = userInfo.email;
    let counter = 0;
    let listOfSched = db.get('schedules').value();
    for(let i=0; i < listOfSched.length; i++){
        if(listOfSched[i].email ==userInfo.email){
            counter++;
        }
    }
 
    if(db.get('schedules').find({nameSched:req.query.name, email:userInfo.email}).value()){
    return res.send({message:"You've already created a schedule of this name."});    
    }
    else if(counter ==20){
        res.send({message:"The maximum number of schedules you can have is 20"})
    }
    else{
        db.get('schedules').push({nameSched:req.query.name,description: req.query.description, email:userInfo.email, owner:userInfo.username, visible:"Private", listOfCourses:[]}).write()
        return res.send(
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
        res.send({message: "Bad message."})
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
            res.send("You've already added this course");
            return;
        }
        schedules.listOfCourses.push({"subject":subject,"catalog_nbr":courseNumber} ); 
        db.set({schedules: schedules}).write(); //update the subject-course pairs in the selected schedule
        res.send("Course is added");
      } else {
        res.send("400 error"); //if a schedule that doesn't exist is trying to be updated, send back this error
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
        res.send({message: "Bad request."})
        return;
    }

    const findSchedule = req.query.name;
    const schedules = db.get('schedules').find({nameSched:findSchedule}).value ();

    if(schedules){ //if user input name matches an existing name, res.send the courses associated with that schedule
        res.send(schedules.listOfCourses); 
    }
    else{
        res.send({message: "Cannot find the specified schedule."})
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
let schema = joi.object({
  schedToken: joi.string().required()
 })
let resultValid = schema.validate(req.query);

if(resultValid.error){
    res.send({message: "Bad request."})
    return;
}
//verify schedule token

let userInfo = {};
    let schedToken= req.query.schedToken;
    try {
        userInfo = jwt.verify(schedToken, ACCESS_TOKEN); //change AccessToken
    } catch(err) {
        res.send("An error occurred");
        return;
    }

let userScheduleArray = [];
let userReturnArray = [];

userScheduleArray = db.get('schedules').value();

for(let i=0; i<userScheduleArray.length; i++){
    if(userScheduleArray[i].email == userInfo.email){
        userReturnArray.push(userScheduleArray[i].nameSched)
    }
}
res.send(userReturnArray);
})
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
        let checkOnly = data[i].catalog_nbr.toString();
        if(!isNaN(queryCourseNum)) {
        checkOnly = checkOnly.replace(/\D/g,'');
        }       
        if(querySubjectName==data[i].subject && queryCourseNum==checkOnly && queryComponent==data[i].course_info[0].ssr_component){
            allStored.push(data[i]);
        }
    }
    res.send(allStored); //send back the array with the search results
}
//this is the else if that runs if the subject and the course number are specified only (not component)
else if(querySubjectName!="ALL SUBJECTS" && queryCourseNum != "" && queryComponent=="AllComponent"){
    let allStored = [];
    for(i=0; i< data.length; i++){ //if else if is satisfied, then iterate through the json file and then push all matching search results into the array
        let checkOnly = data[i].catalog_nbr.toString();
        if(!isNaN(queryCourseNum)) {
        checkOnly = checkOnly.replace(/\D/g,'');
        }   
        if(querySubjectName==data[i].subject && queryCourseNum==checkOnly){
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
        let checkOnly = data[i].catalog_nbr.toString();
        if(!isNaN(queryCourseNum)) {
        checkOnly = checkOnly.replace(/\D/g,'');
        }   
        if(queryCourseNum==checkOnly){
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

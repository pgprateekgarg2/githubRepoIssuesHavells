// express 
const express = require('express')

//axios
const axios = require('axios')

//body parser
const bodyParser = require('body-parser')

// moment.js
const moment = require('moment')

//express app initialization
const app = express()

// setting up templating engine
app.set('view engine','ejs')
// including static folder in app
app.use(express.static("public"))

//using bodyparser in app
app.use(bodyParser.urlencoded({extended:true}))

// port
const port = process.env.PORT || 3000

// total number of issues count
let totalIssues = 0

// count for issues in last 24 hours
let issuesWithInADay = 0

// count of issues in last 7 days
let issuesWithInAWeek = 0

// count of issues before 7 days
let issuesBeforeAWeek = 0

// name of repository owner
let owner = 'name'

// name of repository
let repo = 'name'

// router to load main page and results will also be displayed on this
app.get('/',(req,res)=>{

// rendering the template
res.render('index',{totalIssues,issuesWithInADay,issuesWithInAWeek,issuesBeforeAWeek,owner,repo})

})

// route to handle post request
app.post('/',async(req,res)=>{
    // receiving the link of repo
    var link = req.body.link
    // spliting the query string on the basis of '/'
    link = link.split("/")
    // removing extra elements from link
    link = link.splice(3,link.length)
    // owner of repository
    owner = link[0]
    // repository name
    repo = link[1]
    
    // initializing current date
    let today = moment()

    // initializing date 24 houts ago
    let withInADay = moment().subtract({'hours':'24'})

    // initializing date 7 days ago
    let withInAWeek = moment().subtract({'hours':'168'})

    try{

        const data = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?per_page=100&state=open`)
        // checking if there is any issue or not
        if(data.data.length !== 0){
            // temp array in which issues will be stored
            let arr = []
            // filtering the open issues by removing pull requests
            let issues = data.data.filter((issue)=>{
                return !issue.pull_request
            })
            // total numbers of issues
            totalIssues = issues.length

            // looping on issues to find count for issues within 24 hours
            issues.forEach((issue)=>{
                created_at = moment(issue.created_at).toISOString()
                if(created_at > withInADay.toISOString() && created_at < today.toISOString() ){
                    arr.push(issue)
                }
            })
            // setting value for issues within 24 hours
            issuesWithInADay = arr.length   
            arr = []
            // looping on issues to find count for issues within 24 hours
            issues.forEach((issue)=>{
                created_at = moment(issue.created_at).toISOString()
                if(created_at < withInADay.toISOString() && created_at > withInAWeek.toISOString() ){
                    arr.push(issue)
                }
            })
            // setting value for issues before 24 hours and within 7 days
            issuesWithInAWeek = arr.length
            arr = []
            // looping on issues to find count for issues before 7 days
            issues.forEach((issue)=>{
                created_at = moment(issue.created_at).toISOString()
                if(created_at < withInAWeek.toISOString()){
                    arr.push(issue)
                }
            })
            // setting value for issues before 7 days
            issuesBeforeAWeek = arr.length
            arr = []
            // return res.send({totalIssues
            //     ,issuesWithInADay,issuesWithInAWeek,issuesBeforeAWeek})
            res.redirect('/')
        } else{
                // if no issue found the all the values will be set to zero
                totalIssues = 0
                issuesWithInADay = 0
                issuesWithInAWeek = 0
                issuesBeforeAWeek = 0
            res.redirect('/')
        }
    } catch(e){
        res.send({message:'Internal server error or check your link'})
    }
})

// starts the server on the defined port
app.listen(port,()=>{
    console.log('server is running on ',port)
})
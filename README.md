# githubRepoIssuesHavells

## 1) Create a repository on GitHub and write a program in any programming language that will do the following:

Input: User can input a link to any public GitHub repository

Output: Your UI should display a table with the following information -

- Total number of open issues

- Number of open issues that were opened in the last 24 hours

- Number of open issues that were opened more than 24 hours ago but less than 7 days ago

- Number of open issues that were opened more than 7 days ago 

 

2) Deploy your application online to any provider: Digital Ocean, AWS, Heroku or whatever you're comfortable with.



Solution :- 

I took reference from github developer docs and found the api to find all the issues in a repository. Then added some parameters to querystring to get the open issue only.
"axios" (a promise based HTTP client for the browser and node.js) is used to hit the api and get the data. There i a problem i can view upto 100 records maximum but in some 
repositories the issues were more than 100, to paginate there was no pointer or reference given to pass in query string to move on the next page to i kept the number of issues to maximum 100.

The link used to get issues from a repository is :- 'https://api.github.com/repos/:owner/:repo/issues?per_page=100&state=open'.

The github rest api recognise the pull request and issue as same but they can be differentiated on the basis of 'pull_request'
so, i filtered the open issues from pull request using filter().

Now, i got open issues and  to classify these issues on the basis of the above given criteria i used the 'created_at' key present in every issue and used moment.js to generate date. 
(as time format for 'created_at' repo was utc so i generated utc date and time from moment.js)

length of the issue array returned from the filter() is the total number of issues

if the repo 'created_at < today's date and current time' and 'created_at' > (today's date and current time) - 24 hours then issue is appended to array and number of open issues that were opened in the last 24 hours = length of array

array = []

if the repo 'created_at < 'created_at' > (today's date and current time) - 24 and 'created_at' > (today's date and current time')-168 hours then issue is appended to array and Number of open issues that were opened more than 24 hours ago but less than 7 days ago = length of array

array = []

if the repo 'created_at < (today's date and current time')-168 hours  then issue is appended to array and Number of open issues that were opened more than 7 days ago  = length of array

And the result is displayed in the window


EJS (Embedded javascript is used ) is used as templating engine.


Live link :- https://gitissuecounterhavells.herokuapp.com/
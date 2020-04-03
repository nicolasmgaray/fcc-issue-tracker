# Project Issue Tracker

<h3>User Stories</h3>

- Prevent cross site scripting(XSS attack).
- I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
- The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
- I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
- I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
- I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
- I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
- All 11 functional tests are complete and passing.

<h3>Example get usage</h3>

/api/issues/{project}
/api/issues/{project}?open=true&assigned_to=Joe

<h3>Example return:</h3>

[{"_id":"5871dda29faedc3491ff93bb","issue_title":"Fix error in posting data","issue_text":"When we post data it has an error.","created_on":"2017-01-08T06:35:14.240Z","updated_on":"2017-01-08T06:35:14.240Z","created_by":"Joe","assigned_to":"Joe","open":true,"status_text":"In QA"},...]

<h3>Live Basic Frontend Example</h3> 

Go to [https://fcc-issue-tracker-challenge.glitch.me/apitest/](https://fcc-issue-tracker-challenge.glitch.me/apitest/) project issues



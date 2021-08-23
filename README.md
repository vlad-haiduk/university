# Services:

## APP
****

### `Department:`
| ATTRIBUTE | TYPE | DESCRIPTION |
|---|---|---|
|name*|string|Name of department|
|head*|string|ObjectId of department head (Lector)|
|created_at|datetime|Department creation datetime (**readonly**)|

`GET` localhost:3000/department/{_id_}
<br>Get department by id
<p>
 Response:
</p>

<code>
{<br>
"status": "success",<br>
"data": {<br>
    "created_at": "2021-08-20T01:14:30.017Z",<br>
"name": "Test",<br>
"head": "611f00fd9a36350aedabc244",<br>
"id": "611f0207e485f00b3231d4c0"<br>
}<br>
}
</code>

`GET` localhost:3000/department/list
<br>Get list of departments
<p>
 Response:
</p>

<code>
{<br>
  "status": "success",<br>
  "data": [<br>
    {<br>
      "created_at": "2021-08-20T01:14:30.017Z",<br>
      "name": "Test",<br>
      "head": "611f00fd9a36350aedabc244",<br>
      "id": "611f0207e485f00b3231d4c0"<br>
    }<br>
  ]<br>
}<br>
</code>

`GET` localhost:3000/department/count
<br>Get total count of departments
<p>
 Response:
</p>

<code>
{<br>
  "status": "success",<br>
  "data": {<br>
    "count": 1<br>
  }<br>
}<br>
</code>

`GET` localhost:3000/department/find
<br>Find department by param
<br><b>List of params:</b>
* name
<p>
Request:
</p>
<code>curl --request GET 
  --url 'http://localhost:3000/department/find?name=Test' 
  --header 'Content-Type: application/json'
</code>
<p>
 Response:
</p>

<code>
{<br>
  "status": "success",<br>
  "data": [<br>
    {<br>
      "created_at": "2021-08-20T01:14:30.017Z",<br>
      "name": "Test",<br>
      "head": "611f00fd9a36350aedabc244",<br>
      "id": "611f0207e485f00b3231d4c0"<br>
    }<br>
  ]<br>
}<br>
</code>

`POST` localhost:3000/department/new
<br>Create new department
<br><b>Fields:</b>
* name
* head

### `Lector:`
| ATTRIBUTE | TYPE | DESCRIPTION |
|---|---|---|
|name*|string|Name of lector|
|email*|string|Email of lector|
|salary*|number|Salary of lector|
|degree*|enum: [assistant, associate_professor, professor]|Degree of lector|
|departments|array|Departments in which the lector works|
|created_at|datetime|Lector creation datetime (**readonly**)|

`GET` localhost:3000/lector/{_id_}
<br>Get lector by id
<p>
 Response:
</p>

<code>
{<br>
  "status": "success",<br>
  "data": {<br>
    "departments": [],<br>
    "created_at": "2021-08-21T18:50:54.437Z",<br>
    "name": "Vlad Haiduk",<br>
    "email": "vladgaiduk53@gmail.com",<br>
    "salary": 50000,<br>
    "degree": "assistant",<br>
    "id": "61214b46a266bd05a9452d5a"<br>
  }<br>
}<br>
</code>

`GET` localhost:3000/lector/list
<br>Get list of lectors
<p>
 Response:
</p>

<code>
"status": "success",<br>
  "data": [<br>
    {<br>
      "departments": [<br>
        "611f0207e485f00b3231d4c0"<br>
      ],<br>
      "created_at": "2021-08-20T01:07:14.559Z",<br>
      "name": "Vlad Haiduk",<br>
      "email": "vladgaiduk53@gmail.com",<br>
      "salary": 50000,<br>
      "degree": "assistant",<br>
      "id": "611f00761a49570a9b9c5cab"<br>
    },<br>
    {<br>
      "departments": [],<br>
      "created_at": "2021-08-20T01:09:55.637Z",<br>
      "name": "Test",<br>
      "email": "test@test.com",<br>
      "salary": 50000,<br>
      "degree": "assistant",<br>
      "id": "611f00fd9a36350aedabc244"<br>
    }<br>
]<br>
}<br>
</code>

`GET` localhost:3000/lector/count
<br>Get total count of lectors
<p>
 Response:
</p>

<code>
{<br>
  "status": "success",<br>
  "data": {<br>
    "count": 10<br>
  }<br>
}<br>
</code>

`GET` localhost:3000/lector/find
<br>Find department by param
<br><b>List of params:</b>
* department
<p>
Request:
</p>
<code>curl --request GET 
  --url 'http://localhost:3000/lector/find?department=611f0207e485f00b3231d4c0' 
  --header 'Content-Type: application/json'
</code>
<p>
 Response:
</p>

<code>
{<br>
  "status": "success",<br>
  "data": [<br>
    {<br>
      "departments": [<br>
        "611f0207e485f00b3231d4c0"<br>
      ],<br>
      "created_at": "2021-08-20T01:07:14.559Z",<br>
      "name": "Vlad Haiduk",<br>
      "email": "vladgaiduk53@gmail.com",<br>
      "salary": 50000,<br>
      "degree": "assistant",<br>
      "id": "611f00761a49570a9b9c5cab"<br>
    }<br>
]<br>
}<br>
</code>

`POST` localhost:3000/lector/new
<br>Create new department
<br><b>Fields:</b>
* name
* email
* salary
* degree

`POST` localhost:3000/lector/{_id_}/update_membership
<br>Add the lector to the departments
<br><b>Fields:</b>
* department_ids
<p>
Request:
</p>
<code>
curl --request POST 
  --url http://localhost:3000/lector/612153aad79cff0771df407b/update_membership 
  --header 'Content-Type: application/json' 
  --data '{
	"department_ids": [
		"611f0207e485f00b3231d4c0"
	]
}'
</code>
<p>
 Response:
</p>
<code>
{<br>
  "status": "success",<br>
  "data": {<br>
    "departments": [<br>
      "611f0207e485f00b3231d4c0"<br>
    ],<br>
    "created_at": "2021-08-21T19:26:35.358Z",<br>
    "name": "Vlad Haiduk",<br>
    "email": "vladgaiduk1@gmail.com",<br>
    "salary": 50000,<br>
    "degree": "assistant",<br>
    "id": "612153aad79cff0771df407b"<br>
  }<br>
}<br>
</code>

## API
****
`POST` localhost/message

| ATTRIBUTE | TYPE | DESCRIPTION |
|---|---|---|
|message*|string|Message command|
**Message commands:**
1. Who is head of department {department_name}
2. Show {department_name} statistic
3. Show the average salary for department {department_name}
4. Show count of employee for {department_name}
5. Global search by {template}
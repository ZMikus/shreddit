# shreddit

*MVP*
-Fix errors:
	-LOGIN : If User's email is already registered, send registration error
	-LOGIN : If User has already created a plan, user is brought to plan rather than create plan 
	-CREATE : Fix bug in creating plyo workout
	-CREATE : User should be able to add activity to workout plan
	-UPDATE : User should be able to modify activities in existing workout plan
	-LOGOUT : User should be taken to homepage upon logout (rather than recieve CANNONT GET error)

-Refactor Front-End in ReactJS & connect existing Back-End

*Stretch Goals*
-Implement Google Maps 3rd Party API to find nearest gym/park
-Find API w/ Premade workouts
- - - - - - - - - - - - - - - - - - - - - - - - -

*User Stories*
- User is brought to SHREDDIT homepage:
	- IF USER IS NOT REGISTERED >> User Registers:
			-name
			-email
			-password

		- New Users are brought to "Select Plan"

		-SELECT PLAN-
			- User selects:
				- activity type(s)
				- quantity of activities per workout
				- start date

	- IF USER IS ALREADY REGISTERED >> User Logs in:
		-email
		-password

		-Registered users should be taken to their exisiting plan after login

		-SHOW PLAN- displays users 4-week workouts based on activity types & quantity of activities
			-User can complete(remove) workouts from their plan
			-User can add new activity to their workout day
				-Name (string)
				-Type (dropdown options: Weights, Plyos, Cardio)
				-Qty/Duration: String
			-User can edit their plan
				-Name (string)
				-Type (dropdown options: Weights, Plyos, Cardio)
				-Qty/Duration: String

			*Strech Goal*
			-User can search the nearest gym/park depending on their current location
- - - - - - - - - - - - - - - - - - - - - - - - -

*Routes*

AUTH:
GET auth/login : prompts exisiting users to log in

POST auth/login : finds user by id ands shows previously created plan

GET auth/register: prompts new users to register for account

POST auth/register: creates new user

GET auth/logout : destroys session & log's out user


SHREDDIT:
POST shreddit/ : creates users plans based on prefered workout types, quantity of activities per workout & start date

GET shreddit/:id : finds plan by id and populates workouts

DELETE shreddit/:id : removes workout from user's plan upon completion

GET shreddit/:id/edit : finds workout by ID & allows users to update details of workout

*Stretch Goal*
THIRD PARTY:
POST shreddit/map : sends users location parameters

GET shreddit/map : returns gyms / parks in nearest to the user location
- - - - - - - - - - - - - - - - - - - - - - - - - 

*Models*

USER MODEL:
  	name:{type: String, required: true},
  	email:{type: String, required: true},
  	password:{type: String,required: true}


PLAN MODEL:
	startDate: {type: Date, default: Date.now},
	name:{type: String},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	workouts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}]


WORKOUT MODEL:
  	day: {type: Date},
  	activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activities'}]


ACTIVITY MODEL:
  	type: {type: String, required: true},
  	duration: {type: String},
  	quantity: {type: Number},
  	name: {type: String, required: true}
- - - - - - - - - - - - - - - - - - - - - - - - - 




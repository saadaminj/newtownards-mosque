# newtownards-mosque

The is the mosque website in react and node js with sqlite database.

The website has dashboard and admin panel.

Admin panel has login method, JWT authentication, and origin tracking. it will not accept any request if it is not from origin which is our frontend ip & port.

if you are first time user. just enter any arbitary string has password. if it will not find password in database. it will generate a password and ask you to use this password in future. The database is storing hash of that password for security 
reasons.

I am using node version: v24.11.0

How to run frontend :

git clone the project in your local pc
open cmd inside the project
cd /mosque-website/
npm install
npm run dev

the website will run on localhost:5173

access admin panel on localhost:5173/admin

to run the server on docker use these commands:

use "docker compose build --no-cache" to build the container without using cache
use "docker compose up" to run the container
use "docker compose up -d" to run the container in background

use "docker compose down" to stop and remove the container

How to run database :

to create jwt key use this command in terminal:

first create .env file inside server-api/ and copy this inside the file:
"
JWT_SECRET=<copy you key here>
FRONTEND_DEV_ORIGIN=http://localhost:5173
FRONTEND_PROD_ORIGIN=http://localhost:4173
DB_FILE=data/app.db
PORT=5001
DOMAIN=http//localhost
"

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
then copy the key generated and assign it to JWT_SECRET variable in .env file 

git clone the project in your local pc
open cmd inside the project
cd /server-api/
npm install
npm start

to run the server on docker use these commands:

use "docker compose build --no-cache" to build the container without using cache
use "docker compose up" to run the container
use "docker compose up -d" to run the container in background

use "docker compose down" to stop and remove the container


the database will run on localhost:5001

The mosque website is using tailwind css, having emerald theme. you can change the colors by replacing every emerald work with [slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose]. Make sure you search and replace the word in case sensitive manner. or else, it might replace any other string in the site.

to run db server:

docker compose down
docker compose build --no-cache
docker compose up

in Admin panel to upload prayer times:

you can either import the json file in the same format as "project/server-api/prayerTimes.json"
or import json using input.

to generate json from an image follow these instructions:

go to any AI chatbot site i.e Chatgpt, Gemini, etc

upload an image where there are prayer times mentioned. 

use the prompt mentioned in "project/mosque-website/src/prompt.txt"

change the prompt as per the image. The image i use is in "project/mosque-website/src/april.jpg"

the response you get from AI, just copy and paste it to "localhost:5173/admin" -> input -> click "import json input"

please make sure to click "Save Changes" any time you make any change to the admin panel.

The delete function is directly linked to databases, edit and add functionality is not directly linked, but you have to click "Save changes" to make the changes permanent
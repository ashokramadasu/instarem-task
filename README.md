# NodeJS developer task of Instarem

Node REST APIs using Mongoose, Express and Jsonwebtokens.

## Requirements

- [Node and npm](http://nodejs.org)

## Installation

1. Clone the repository: `git clone https://github.com/ashokramadasu/instarem-task`
2. Install the application: `npm install`
3. Place your own MongoDB URI in `config/index.js`
4. Start the server: `node app.js` or `npm start`
5. make requests to rest apis using Postman at `http://localhost:3000/` or `https://instaremtask.herokuapp.com`

## Usage of API

1. make POST request to `/getToken` API with username and password(see config file for credentials)
2. All apis starts with `/api/*` are secured by JWT token
3. Please add authorization header as `JWT <token obtained from /getToken>`
4. Available GET Apis are `/api/list` , `/api/count`, `/api/stats` and `/api/search`
5. Suggestions always welcome. Have a nice day.


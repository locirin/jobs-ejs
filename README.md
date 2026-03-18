It is a server-rendered web application built with Express and MongoDB.  
Users can register, log in, join the same family board using a family code, and manage shared tasks.

## Technologies Used

- Node.js
- Express
- EJS
- MongoDB
- Mongoose
- Passport (authentication)
- Express Session
- CSRF protection

## Features

- User registration
- User login and logout
- Family board using a shared family code
- Create tasks
- Edit your own tasks
- Delete your own tasks
- Update status of your own tasks
- Server-side authorization
- CSRF protection

## Run Locally

1. Clone the repository.

2. Install dependencies:
   npm install

3. Create a `.env` file in the root folder and add: 
    MONGO_URI=[your_mongodb_connection_string]
    SESSION_SECRET=[your_session_secret]

    **Do not commit your real `.env` file to GitHub.

4. Start the app:
   npm start

5. Open in browser:
   http://localhost:3000

## Live Version

https://jobs-ejs-f35s.onrender.com

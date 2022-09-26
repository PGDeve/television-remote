# Remote and television BE
Node.js app handling requests and DB access for television and remote controller apps.

## Installation
Install Node.js and run `npm install` to install project dependencies.  
You need to have a Firebase account, configure a realtime database and then paste your Firebase realtime database URL in your `.env` file as the **FIREBASE_DATABASE_URL** key.  
Once you have your DB running you can use `npm run db` to populate it with the data in *db-scripts/channels.json*.  
You'll also need to place your Firebase admin SDK credentials in *config/* in a file called **firebase-adminsdk.json** (you can see a template in file *config/firebase-adminsdk-template.json*).

## Available Scripts
In the project directory, you can run:

### `npm start`

Runs the server in development mode on [http://localhost:3088](http://localhost:3088) by default.  
PORT can be configured in .env file.  
**Note: in order for the app to run you need to modify your `.env` file and add the URL of Firebase realtime database.**

### `npm run test`
Launches the test runner in the interactive watch mode.

### `npm run db`
Populates your Firebase realtime database it with the data in *db-scripts/channels.json*.

### `npm run tsc`
Compiles typescript source code in js to be run and deployed with Node.js and puts the result in the *lib/* folder.
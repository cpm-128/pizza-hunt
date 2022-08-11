// this is where all the IndexedDB functionality for the application is handled
// this script will be imported to the appropriate html pages

// create a variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'pizza_hunt" and set it to version 1
// acts as an event listener for the db
const request = indexedDB.open('pizza_hunt', 1);
// this is where all the IndexedDB functionality for the application is handled
// this script will be imported to the appropriate html pages

// create a variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'pizza_hunt" and set it to version 1
// acts as an event listener for the db
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant t oversion 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store to hold the data
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function(event) {
    // store offline db object to global db var define earlier
    db = event.target.result;

    // check if app is online
    if (navigator.online) {
        //uploadPizza();
    }
};

request.onerror = function(event) {
    console.log('>> offline connection to db failed >>' , event.target.errorCode);
}

// if submit new pizza with no internet connection
function saveRecord(record) {
    // open new transaction with db with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to store
    pizzaObjectStore.add(record);
}
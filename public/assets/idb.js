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

    // check if app is online when a user returns
    if (navigator.online) {
        uploadPizza();
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

// POST the saved pizza object(s) to the server so it can be uploaded with connection is reestablished
function uploadPizza() {
    // open a transaction on db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to variable
    const getAll = pizzaObjectStore.getAll();

    // getAll success
    getAll.onsuccess = function() {
        // if data in store, send to api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accpetion: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse)
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    // access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // clear all items in store
                    pizzaObjectStore.clear();
                    alert('All saved pizza has been submitted.');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
};

// listen to app coming back online during the same session
window.addEventListener('online', uploadPizza);
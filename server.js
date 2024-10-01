// Import dependencies
const express = require("express");
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config();

// Create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE 
});

// Test the connection
db.connect((err) => {
    if (err) {
        return console.log('Error connecting to the database: ', err);
    }
    console.log('Connected to MySQL: ', db.threadId);
});

// Retrieve all patients
app.get('', (req, res) => { 
    const getPatients = "SELECT * FROM patients";
    db.query(getPatients, (err, data) => {
        if (err) {
            console.log("Error retrieving patients:", err);
            return res.status(400).send("Failed to get patients");
        }
        res.status(200).send(data); 
    });
});

//Displays all providers with there first name, last name and provider_speciality

app.get('/getProviders', (req, res) => {
    const getProviders = 'SELECT first_name, last_name provider_speciality FROM providers';
    db.query(getProviders,(err, data) => {
        if(err) {
            console.log("Error retrieving providers:", err);
            return res.status(400).send("Failed to get providers");
        }
        res.status(200).send(data);
        });
    });


    // Retrieve all patients by their first name
app.get('/getPatientsByFirstName', (req, res) => {
    const { first_name } = req.query; 
    
    if (!first_name) {
        return res.status(400).send("First name is required");
    }

    const getPatientsByFirstName = "SELECT * FROM patients WHERE first_name = ?";
    
    db.query(getPatientsByFirstName, [first_name], (err, data) => {
        if (err) {
            console.log("Error retrieving patients by first name:", err);
            return res.status(500).send("Failed to get patients");
        }
        if (data.length === 0) {
            return res.status(404).send("No patients found with the given first name");
        }
        res.status(200).send(data);
    });
});

// Retrieve all providers by their specialty

app.get('/getProvidersBySpecialty', (req, res) => {
    const { specialty } = req.query; 
    
    if (!specialty) {
        return res.status(400).send("Provider specialty is required");
    }

    const getProvidersBySpecialty = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
    
    db.query(getProvidersBySpecialty, [specialty], (err, data) => {
        if (err) {
            console.log("Error retrieving providers by specialty:", err);
            return res.status(500).send("Failed to get providers");
        }
        if (data.length === 0) {
            return res.status(404).send("No providers found with the given specialty");
        }
        res.status(200).send(data); 
    });
});



// Start the server
app.listen(3300, () => {
    console.log(`Server is running on port 3300...`);
});

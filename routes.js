const express = require('express');
const router = express.Router();
const sql = require('mysql2');
const validator = require('fastest-validator');

const connection = sql.createConnection({
    connectionLimit:10,
    password:'#MickyMouse12',
    user:'root',
    database:'candidates',
    host:'localhost',
    port:'3307'
})

connection.connect(function(err) {
    if(err) {
        console.log("error while connection");
    }
    else {
        console.log("connected to database");
    }
})


router.post('/candidate', (req,res) => {
       /* Validation block start for fields in database */
        let candidateDataObj = {};
        candidateDataObj.ctc = req.body.candidates_data.ctc;
        const candidate = {
            name: req.body['Name'],
            email: req.body['Email ID'],
            contactNumber: req.body['Contact Number'],
            candidatesData: req.body.candidates_data,
            currency: candidateDataObj.ctc.ctcCurrency,
            ctcUnit: candidateDataObj.ctc.ctcUnit
        }
        const schema = {
            name: {type: "string", max: 15},
            email: {type: "email", max: 30},
            contactNumber: {type: "number"},
            candidatesData: {type: "object"},
            currency: {type: "enum", values: [ "INR", "USD", "EUR" ]},
            ctcUnit:  {type: "enum", values: ctcUnits(candidateDataObj)}
        }
        const v = new validator();
        const validationResponse = v.validate(candidate,schema);
        if(validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResponse
            });
        }
        /* Validation block end for fields in database */
        const selectQueryString = `SELECT * FROM candidates.candidate_summary`;
        connection.query(selectQueryString,(err,result) => {
        if(err) {
            res.status(500).send('Some error occurred');
        }
        else {
            if(result.length > 0) {
                const found = result.some((value) => {
                    return value.name === req.body.Name || value.email_id === req.body['Email ID'] || value.phone_number === req.body['Contact Number'];
                })
                if(found) {
                    res.status(400).json({
                        message: "Entered values already exist"
                    });
                }
                else {
                    insertValues(req.body,res);
                }
            }
            else {
                insertValues(req.body,res);
            }
        }
    })
})

function insertValues(value,request) {
    value.candidates_data = JSON.stringify(value.candidates_data);
    const insertQueryString = `INSERT INTO candidate_summary (name, email_id, phone_number, candidates_data) VALUES ('${value.Name}','${value['Email ID']}','${value['Contact Number']}','${value.candidates_data}')`;
    connection.query(insertQueryString,(err,result) => {
        if(err) {
            request.status(500).send("Error");
        }
        else {
            request.status(200).send("Data inserted successfully");
        }
    })
}

function ctcUnits(value) {
    if(value.ctc.ctcCurrency === "INR") {
        return ["Lakhs","Crores"];
    }
    else {
        return ["Millions","Thousands"]
    }
}

module.exports = router;
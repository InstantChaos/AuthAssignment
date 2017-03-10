/* 
File name: contacts.js
author: Franco Chong
student id: 300649025
webapp name: Assignment2 */

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//define the user models
let UserModel = require('../models/users');
let User = UserModel.User; //alias for user model object

// define the contacts model
let buscontact = require('../models/contacts');

//create a function to check if the user is authenticated
function requireAuth(req, res, next) {
    //checks if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

/* GET contacts List page. READ */
router.get('/', requireAuth, (req, res, next) => {
    // find all contacts in the contacts collection
    buscontact.find((err, contacts) => {
        if (err) {
            return console.error(err);
        }
        else {
            //sorting the contacts by changing to lower case first then compares them
            contacts.sort((beforeName, afterName) => {
                let firstName = beforeName.Name.toLowerCase();
                let secondName = afterName.Name.toLowerCase();
                
                //returns a -1 if the name comes after the name thats comparing it
                if (firstName < secondName) {
                    return -1;
                }
                //returns a 1 if the name comes before the name thats comparing it
                if (firstName > secondName) {
                    return 1;
                }
                //returns 0 if nothing matches
                else {
                    return 0;
                }
            });
            res.render('contacts/index', {
                title: 'contacts',
                contacts: contacts,
                displayName: req.user.displayName
            });
        }
    });

});

//  GET the contact Details page in order to add a new contact
router.get('/add', requireAuth, (req, res, next) => {

    res.render('contacts/details', {
        title: "Add a new Contact",
        contacts: '',
        displayName: req.user.displayName

    });

});

// POST process the contact Details page and create a new contact - CREATE
router.post('/add', requireAuth, (req, res, next) => {

    let newContact = buscontact({
        "Name": req.body.name,
        "Number": req.body.number,
        "Email": req.body.email

    });

    buscontact.create(newContact, (err, contacts) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/contacts');
        }
    });

});

// GET the contact Details page in order to edit an existing contact
router.get('/:id', requireAuth, (req, res, next) => {

    try {
        //get a reference to the id fomr the url
        let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        //find one contacts by its id
        buscontact.findById(id, (err, contacts) => {
            if (err) {
                console.log(err);
                res.end(error);
            } else {
                //show the contacts details view
                res.render('contacts/details', {
                    title: 'Contact Details',
                    contacts: contacts,
                    displayName: req.user.displayName

                })
            }
        });
    } catch (err) {
        console.log(err);
        res.redirect('/errors/404');
    }

});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {

    let id = req.params.id;

    let updatedContact = buscontact({
        "_id": id,
        "Name": req.body.name,
        "Number": req.body.number,
        "Email": req.body.email
    });

    buscontact.update({ _id: id }, updatedContact, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            //refresh the contacts list
            res.redirect('/contacts');
        }
    });


});

// GET - process the delete by contacts id
router.get('/delete/:id', requireAuth, (req, res, next) => {

    let id = req.params.id;

    buscontact.remove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            //refresh the contacts list
            res.redirect('/contacts');
        }
    });
});


module.exports = router;

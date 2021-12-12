const {
    body
} = require('express-validator');
const {
    validationResult
} = require('express-validator');
const model = require('../models/connectionModel');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    console.log(id);
    if (!(req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
}

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({
        min: 8,
        max: 64
    })
];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({
        min: 8,
        max: 64
    })
];
exports.validateStory = [body('title', 'Title must be 3 or more characters').isLength({min:3}).trim().escape(),
body('topic', 'topic must be 3 or more characters').isLength({min:3}).trim().escape(),
body('description', 'description must be 10 or more characters').isLength({min:10}).trim().escape(),
body('hostname', 'Hostname cannot be empty').notEmpty().trim().escape(),
//body('email', 'email cannot be empty').notEmpty().trim().escape(),
body('location', 'location cannot be empty').notEmpty().trim().escape(),
//body('image', 'image URL cannot be empty').notEmpty().trim().escape(),
// body('StartTime', 'start Date cannot be empty').notEmpty().trim().custom((value, {req})=>{
//     let startDate = req.body.startDate;
//     startDate = startDate.slice(0, 10) + " " + startDate.slice(11);
//     let dateObj = DateTime.fromFormat(startDate, "yyyy-MM-dd HH:mm");
//     if(!dateObj.isValid){
//         throw new Error('Start DateTime is not a valid DateTime');
//     }
//     else{
//         let dateNow = DateTime.now().toFormat("yyyy-MM-ddHH:mm");
//         dateNow = dateNow.slice(0, 10) + "T" + dateNow.slice(11);
//         if (req.body.startDate <= dateNow){
//             throw new Error('Start DateTime should be after Present DateTime');
//         }
//         else return true;
//     }
// }),
// body('endTime', 'End Date cannot be empty').notEmpty().trim().custom((value, {req})=>{
//     let endDate = req.body.endDate;
//     endDate = endDate.slice(0, 10) + " " + endDate.slice(11);
//     let dateObj = DateTime.fromFormat(endDate, "yyyy-MM-dd HH:mm");
//     if(!dateObj.isValid){
//         throw new Error('End DateTime is not a valid DateTime');
//     }
//     else{
//         if (req.body.startDate >= req.body.endDate){
//             throw new Error('End DateTime should be greater than Start DateTime');
//         }
//         else return true;
//     }
// })
];
// exports.validateStory = [body('title', 'Name must be 3 or more characters').isLength({
//         min: 3
//     }).trim().escape(),
//     body('topic', 'Topic must be 3 or more characters').isLength({
//         min: 3
//     }).trim().escape(),
//     body('description', 'Details must be 10 or more characters').isLength({
//         min: 10
//     }).trim().escape(),
//     body('hostname', 'Hostname cannot be empty').notEmpty().trim().escape(),
//     // body('emailID', 'EmailID cannot be empty').notEmpty().trim().escape(),
//     body('location', 'location cannot be empty').notEmpty().trim().escape(),
//     body('image', 'Image URL cannot be empty').notEmpty().trim().escape(),
//     body('startTime', 'Start Time cannot be empty').notEmpty().trim().custom((value, {
//         req
//     }) => {
//         let startDate = req.body.startTime;
//         console.log("Dare", startDate);
//         startDate = startDate.slice(0, 10) + " " + startDate.slice(11);
//         console.log("Dare 2", startDate);
//         let dateObj = DateTime.fromFormat(startDate, "yyyy-MM-dd hh:mm").toISO();

//         console.log("fgdsfghjkkgf->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", dateObj);
//         if (!dateObj.isValid) {
//             req.flash('error', 'Start DateTime is not a valid DateTime');
//         } else {
//             let dateNow = DateTime.now().toFormat("yyyy-MM-ddHH:mm");
//             dateNow = dateNow.slice(0, 10) + "T" + dateNow.slice(11);
//             if (req.body.startTime <= dateNow) {
//                 req.flash('error', 'Start DateTime should be after Present DateTime');
//             } else return true;
//         }
//     }),
//     body('endTime', 'End Time cannot be empty').notEmpty().trim().custom((value, {
//         req
//     }) => {
//         let endDate = req.body.endTime;
//         endDate = endDate.slice(0, 10) + " " + endDate.slice(11);
//         let dateObj = DateTime.fromFormat(endDate, "yyyy-MM-dd HH:mm");
//         if (!dateObj.isValid) {
//             req.flash('error', 'End DateTime is not a valid DateTime');
//         } else {
//             console.log("Starrt time-> ", req.body.startTime, "End time ->", req.body.endTime);
//             if (req.body.startTime >= req.body.endTime) {
//                 req.flash('error', 'End DateTime should be greater than Start DateTime');

//             } else return true;
//         }
//     })
// ];


exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.isValidRSVP = (req, res, next) => {
    let status = req.body.status;
    if (status == null) {
        req.flash('error', 'RSVP cannot be empty');
        res.redirect('/');
    } else {
        status = req.body.status.toUpperCase();
        if (status == 'YES' || status == 'NO' || status == 'MAYBE') {
            next();
        } else {
            req.flash('error', 'RSVP can only be YES, NO or MAYBE');
            res.redirect('/');
        }
    }
};

exports.isUserConnection = (req, res, next) => {
    model.findById(req.params.id)
        .then(connection => {
            if (connection.author._id == req.session.user._id) {
                req.flash('error', 'Cannot RSVP to your own Event');
                res.redirect('/');
            } else {
                next();
            }
        })
        .catch(err => next(err));
};
const model = require('../models/connectionModel');
const user = require('../models/userModel');
const {
    isEmpty
} = require('lodash');
const {
    connection
} = require('mongoose');
const rsvpModel = require('../models/rsvp');

exports.index = (req, res, next) => {
    model.find()
        .then(connections => {
            let conn = connections.reduce((b, a) => {
                b[a.topic] = [...b[a.topic] || [], a];
                return b;
            }, {});
            if (!isEmpty(conn)) {
                console.log(conn);
                res.render('./connections/index', {
                    conn
                });
            } else {
                console.log(conn);
                res.render('./connections/index', {
                    conn
                });
            }
        })
        .catch(err => next(err));
};

// GET /connections/new : show the webpage form to create a new connection
exports.new = (req, res) => {
    res.render('./connections/new');
};

// POST /connections : create a new connection
exports.create = (req, res, next) => {
    let connection = new model(req.body);
    connection.author = req.session.user;
    console.log(connection.author);
    connection.save() //insert the document to the database
        .then(connection => res.redirect('/connections'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                err.status = 400;
            }
            next(err);
        });
};

// let updateTime = (connection) => {
//     connection.startDate = connection.startDate.slice(0, 10) + " " + connection.startDate.slice(11);
//     connection.endDate = connection.startDate.slice(0, 10) + " " + connection.endDate.slice(11);
//     return connection;
// }

exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('author', user)
        .then(connection => {
            if(connection)
            {
                //connection = ChangeTournamentTimeStamp(tournament);
                let rsvpCnt = 0;
                rsvpModel.find({connectionId: req.params.id, status:"YES"})
                .then(rsvpConnections=>{
                    if(rsvpConnections) rsvpCnt = rsvpConnections.length;
                    res.render('./connections/show', {connection, rsvpCnt});
                })
                .catch(err => next(err));
            } 
            else {
                let err = new Error('Cannot find a connection with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};


// GET /connections/:id/edit : send a html form to edit the connection identified by id
exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
        .then((connection) => {
            if (connection) {
                return res.render('./connections/edit', {
                    connection
                });
            } else {
                let err = new Error('Cannot find a connection with id: ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// PUT /connections/:id : Update the connection identified by id
exports.update = (req, res, next) => {
    let id = req.params.id;
    let connection = req.body;
    model.findByIdAndUpdate(id, connection, {
            useFindAndModify: false,
            runValidators: true
        })
        .then((connection) => {
            if (connection) {
                res.redirect('/connections/' + id);
            } else {
                let err = new Error('Cannot find a connection with id: ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                err.status = 400;
            next(err);
        });
};

// DELETE /connections/:id : Delete the connection identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, {
            useFindAndModify: false
        })
        .then(connection => {
            if (connection) {
                res.redirect('/connections');
            } else {
                let err = new Error('Cannot find a connection with id: ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
}

exports.createRSVP = (req, res, next) => {
    let status = req.body.status.toUpperCase();
    rsvpModel.find({
            connectionId: req.params.id,
            userID: req.session.user
        })
        .then(rsvpDetails => {
            if (rsvpDetails.length == 1) {
                rsvpDetails[0].status = status;
                rsvpModel.findByIdAndUpdate(rsvpDetails[0]._id, rsvpDetails[0], {
                        useFindAndModify: false,
                        runValidators: true
                    })
                    .then(rsvpObj => {
                        if (rsvpObj) {
                            req.flash('success', 'Successfully updated RSVP');
                            res.redirect('/users/profile');
                        } else {
                            let err = new Error("Unable to update RSVP");
                            err.status = 404;
                            next(err);
                        }
                    })
                    .catch(err => next(err));
            } else {
                let rsvpObj = new rsvpModel();
                rsvpObj.status = status;
                rsvpObj.userID = req.session.user;
                rsvpObj.connectionId = req.params.id;
                rsvpObj.save()
                    .then(rsvpDetails => {
                        req.flash('success', 'Successfully created RSVP for this tournament');
                        res.redirect('/users/profile');
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
};

exports.deleteRSVP = (req, res, next) => {
    rsvpModel.deleteOne({
            connectionId: req.params.id,
            userID: req.session.user
        })
        .then(rsvpDetails => {
            if (rsvpDetails) {
                req.flash("success", "RSVP deleted successfully");
                res.redirect("/users/profile");
            }
        })
        .catch(err => next(err));
}
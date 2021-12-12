const Connection = require('../models/connectionModel');

// check if user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    else {
        req.flash('error','You are logged in already');
        return res.redirect('/users/profile');
    }
};

// check if user is logged in
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    else {
        req.flash('error','You need to log in first');
        return res.redirect('/users/login');
    }
};

//check if user is author of the story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    console.log("session: ")
    console.log(req.session.user);
    console.log(typeof(req.session.user));
    Connection.findById(id)
    .then(conn=>{
        if(conn){
            console.log(conn);
        console.log("author:")
            console.log(conn.author);
            if(conn.author == req.session.user){
                next();
            } else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
        else {
            let err = new Error('Cannot find a connection with id ' + req.params.id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
}
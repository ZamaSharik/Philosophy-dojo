const model = require('../models/userModel');
const Connection = require('../models/connectionModel');
const rsvpModel = require('../models/rsvp');
const { connection } = require('mongoose');

exports.new = (req, res)=>{
    return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    //res.send('Created a new story');

    let user = new model(req.body);//create a new connection document
    user.save()//insert the document to the database
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/users/login')
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    console.log(req.body);
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        console.log(user);
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.firstName = user.firstName;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id),Connection.find({author:id})])
    .then(results=>{
        const [user,connections] = results;
        let topics = getTopics(connections);
        rsvpModel.find({ userID: id }).populate('connectionId', connection.connectionId)
        .then(rsvpArr => {
            res.render('./user/profile', { user, connections,topics, rsvpArr });
        })
        .catch(err => next(err));
        })
    .catch(err=>next(err));
};

let getTopics = (connections) => {
    let topics = undefined;
    connections.forEach(conn=>{
        let topicName =  conn.topic;
        if(topics === undefined){
            topics = [];
            topics.push(topicName);
        }
        else if(topics.findIndex(name => name === topicName) == -1)
        topics.push(topicName);
    });
    return topics;
}

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
 };
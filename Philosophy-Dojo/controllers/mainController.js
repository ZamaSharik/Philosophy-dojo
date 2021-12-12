const model = require('../models/connectionModel');

exports.index = (req, res) => {
    res.render('index');
}

exports.aboutPage = (req, res)=>{
    res.render('./info/about');
};

exports.contactPage = (req,res)=>{
    res.render('./info/contact');
};

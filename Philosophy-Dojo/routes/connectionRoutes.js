const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const {validateId, isUserConnection} = require('../middlewares/validator');
const { validateStory, validationResult, validateResult, isValidRSVP } = require('../middlewares/validator');

const router = express.Router();

// GET /connections : send all the connections to the user

router.get('/', controller.index);

// GET /connections/new : show the webpage form to create a new connection

router.get('/new', isLoggedIn, controller.new);

// POST /connections : create a new connection

router.post('/', isLoggedIn, validateStory, validateResult, controller.create);

// GET /connections/:id : send details of a connection by ID

router.get('/:id', validateId, controller.show);

// GET /connections/:id/edit : send a html form to edit the connection identified by id

router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

// PUT /connections/:id : Update the connection identified by id

router.put('/:id', validateId, isLoggedIn, isAuthor, validateStory, validateResult, controller.update);

// DELETE /connections/:id : Delete the connection identified by id

router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

//RSVP for tournament
router.post('/:id/rsvp', validateId, isLoggedIn, isValidRSVP, isUserConnection, controller.createRSVP);

//RSVP Maybe for tournament
router.post('/:id/rsvpDelete', validateId, isLoggedIn, controller.deleteRSVP)

module.exports = router;
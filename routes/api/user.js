const express = require('express');
const router = express.Router();


// Load users model
const Users = require('../../models/users');

// @route GET api/users/test
// @description tests books route
// @access Public
router.get('/test', (req, res) => res.send('users route testing!'));

// @route GET api/users/
// @description Get all books
// @access Public
router.get('/', (req, res) => {
  Users.find()
    .then(usr => res.json(usr))
    .catch(err => res.status(404).json({ nobooksfound: 'No users found' }));
});

//check user
router.post('/check', (req, res) => {
  if(req.body.do=='login'){
    Users.find({userEmail:(req.body.userEmail)}).exec((err,usr)=>{
      res.connection.setTimeout(1000);
      if(usr[0].pass==req.body.pass && usr[0].userEmail==req.body.userEmail)res.json({status:'success',userName:usr[0].userName});
      else res.json({status:'fail'});
    });
    return;
  }

  else Users.find({userEmail:req.body.userEmail}).exec((err,usr)=>{
    console.log('check'+usr);
    res.connection.setTimeout(1000);
    if(usr.length!=0)res.json({status:'valid'});
    else res.json({status:'invalid'});
  })
});

// @route GET api/users/:id
// @description Get single book by id
// @access Public
router.get('/:id', (req, res) => {
  Users.findById(req.params.id)
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ nobookfound: 'No Book found' }));
});

// @route GET api/users
// @description add/save book
// @access Public
router.post('/', (req, res) => {
  console.log('52'+req.body);
  Users.create(req.body)
    .then(book =>{ res.json({status:'added',userName:req.body.userName})})
    .catch(err => res.status(400).json({ error: 'Unable to add this user' }));
});

module.exports = router;
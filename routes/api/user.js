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
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ nobooksfound: 'No users found' }));
});

//check user
router.post('/check', (req, res) => {
  if(req.body.do=='login'){
    Users.find({userEmail:(req.body.userEmail)}).exec((err,usr)=>{
      res.connection.setTimeout(1000);
      if(usr[0].pass==req.body.pass && usr[0].userEmail==req.body.userEmail)res.send('success');
      else res.send('fail');
    });
    return;
  }

  else Users.find({userEmail:req.body.userEmail}).exec((err,usr)=>{
    console.log('check'+usr);
    res.connection.setTimeout(1000);
    if(usr.length!=0)res.send('valid');
    else res.send('invalid');
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
    .then(book =>{ res.send('added')})
    .catch(err => res.status(400).json({ error: 'Unable to add this user' }));
});

async function handleUserTimeout(parm){
  setTimeout(()=>{Users.updateOne({userEmail:parm.userEmail},{logged:'offline'})},3000);
}

function getUser(req){
  Users.find({userEmail:req.body.userEmail}).exec((err,usr)=>{
    return usr;
  });
}

router.post('/log', (req, res) => {
  res.connection.setTimeout(1000);
  Users.updateOne({userEmail:req.body.userEmail},{logged:'online'})
  .then(data=>{
    handleUserTimeout(req.body);
    res.json({userName:getUser(req)});
})
});

module.exports = router;
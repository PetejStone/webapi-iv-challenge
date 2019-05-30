const express = require('express');



const Users = require('./userDb.js')
const Posts = require('../posts/postDb.js')

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
    try {
        const user = await Users.insert(req.body);
        res.status(201).json(user);
      } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
          message: 'Error adding the user',
        });
      }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
    const messageInfo = { ...req.body, user_id: req.params.id };

    try {
      const message = await Posts.insert(messageInfo);
      res.status(210).json(message);
    } catch (error) {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    }
});

router.get('/', (req, res) => {
    Users.get()
  .then(user => {
    res.status(200).json({user})
  })
  .catch(err => {
    res.status(500).json({error: "Users could not be retrieved"})
  })
});

router.get('/:id', validateUserId, async (req, res) => {
    try {
        const user = await Users.getById(req.params.id);
          res.status(200).json(user);
        
      } catch (error) {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the user',
        });
      }
});

router.get('/:id/posts', async (req, res) => {
    try {
        const id = await Users.getUserPosts(req.params.id);
          res.status(200).json(id);
        
      } catch (error) {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the user',
        });
      }
});

router.delete('/:id',validateUserId, async (req, res) => {
    try {
        const user = await Users.remove(req.params.id);
          res.status(200).json('successfully removed user');
        
      } catch (error) {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the user',
        });
      }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try {
        const user = await Users.update(req.params.id, req.body);
        res.status(201).json(user);
      } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
          message: 'Error adding the user',
        });
      }
});

//custom middleware

async function validateUserId( req, res, next) {
 
  const id = await Users.getById(req.params.id);
if (id) {
  req.user = id
  next()
} else {
  res.status(400).json({message: "Invalid user id"})
}
};

function validateUser(req, res, next) {
  const bodyLength = Object.keys(req.body);//converts object to array to get length
  const username = req.body;
  if (req.body && req.body.name) {
    next();
  }
  if (bodyLength.length <= 0)  {
    res.status(400).json({message: 'missing user data'})
  }
  if ( !username.name ) {
    res.status(400).json({message: 'missing required name field'})
  }
};

function validatePost(req, res, next) {
const bodyLength = Object.keys(req.body);//converts object to array to get length
  const username = req.body;
  if (req.body && req.body.text) {
    next();
  }
  if (bodyLength.length <= 0)  {
    res.status(400).json({message: 'missing post data'})
  }
  if ( !username.text ) {
    res.status(400).json({message: 'missing required text field'})
  }
};

module.exports = router;
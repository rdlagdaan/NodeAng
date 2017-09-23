const Agent = require('../models/agent'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {


  /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
  router.get('/allAgents', (req, res) => {
    // Search database for all blog posts
    Agent.find({}, (err, agents) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!agents) {
          res.json({ success: false, message: 'No agents found.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, agents: agents }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
  });

  /* ===============================================================
     GET SINGLE BLOG
  =============================================================== */
  /*router.get('/singleAgent/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No agent ID was provided.' }); // Return error message
    } else {
      // Check if the blog id is found in database
      Agent.findOne({ _id: req.params.id }, (err, agent) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid agent id' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!agent) {
            res.json({ success: false, message: 'Agent not found.' }); // Return error message
          } else {
            // Find the current user that is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error
              } else {
                // Check if username was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
                } else {
                  // Check if the user who requested single blog is the one who created it
                  if (user.username !== blog.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this blog.' }); // Return authentication reror
                  } else {
                    res.json({ success: true, blog: blog }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  });*/

  return router;
};
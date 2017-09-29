const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const ucfirst = require('ucfirst');
const inputIs = require('input-is');;
module.exports = (router) => {


  /* ==============
     CREATE USER
  ============== */
  router.post('/create', (req, res) => {
    //Declare and assign form data
    var validDate = inputIs.date(req.body.BirthDate);

    // Check if EmailAddress was provided
    if (!req.body.EmailAddress) {
      res.json({ success: false, message: 'You must provide an Email Address' }); // Return error
    } else {
      // Check if FirstName or LastName was provided
      if (!req.body.FirstName || !req.body.LastName) {
        res.json({ success: false, message: 'You must provide a LastName or FirstName' }); // Return error
      } else {
        // Check if Password was provided
        if (!req.body.Password) {
          res.json({ success: false, message: 'You must provide a Password' }); // Return error
        } else {
          //Check if BirthDate was provided
          if(!req.body.BirthDate) {
            res.json({ success: false, message: 'You must provide a BirthDate' }); // Return error
          } else {
            if(!req.body.Gender) {
              res.json({ success: false, message: 'You must provide a Gender' }); // Return error
            } else {
              //Invalid BirthDate Format
              if(!validDate) {
                res.json({ success: false, message: 'Invalid BirthDate: ' + req.body.BirthDate }); // Return error
              } else {
                //Check if valid Gender
                if(!(req.body.Gender == 'M' || req.body.Gender == 'F')) {
                  res.json({ success: false, message: 'Invalid Gender: ' + req.body.Gender }); // Return error
                } else {
                          // Create new user object and apply user input
                          let user = new User({
                            EmailAddress: req.body.EmailAddress.toLowerCase(),
                            FirstName: ucfirst(req.body.FirstName),
                            LastName: ucfirst(req.body.LastName),
                            Password: req.body.Password,
                            BirthDate: req.body.BirthDate,
                            Gender: req.body.Gender
                          }); //let user = new User({
                          
                          // Save user to database
                          user.save((err) => {
                            // Check if error occured
                            if (err) {
                              // Check if error is an error indicating duplicate account
                              if (err.code === 11000) {
                                res.json({ success: false, message: 'Email Address already exists!!!' }); // Return error
                              } else {
                                // Check if error is a validation rror
                                if (err.errors) {
                                  // Check if validation error is in the Email Address field
                                  if (err.errors.EmailAddress) {
                                    res.json({ success: false, message: err.errors.EmailAddress.message }); // Return error
                                  } else {
                                    // Check if validation error is in the username field
                                    if (err.errors.LastName || err.errors.FirstName) {
                                      res.json({ success: false, message: err.errors.LastName.message }); // Return error
                                    } else {
                                      // Check if validation error is in the password field
                                      if (err.errors.Password) {
                                        res.json({ success: false, message: err.errors.Password.message }); // Return error
                                      } else {
                                        res.json({ success: false, message: err }); // Return any other error not already covered
                                      } //if (err.errors.Password)
                                    } //if (err.errors.LastName || err.errors.FirstName)
                                  } //if (err.errors.EmailAddress)
                                } else {
                                  res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                                } //if (err.errors)
                             } //if (err.code === 11000)
                            } else {
                              res.json({ success: true, message: 'Account registered!' }); // Return success
                            } //if (err)
                          }); //user.save((err) => {
                } // if(!(Gender == 'M' || Gender == 'F'))            
              } //if(!validDate) {
            } //if(!Gender)
          } //if(!BirthDate)                  
        } //if (!Password)
      } // if (!FirstName || !LastName)
    } //if (!EmailAddress)
  });


  /* ============================================================
     Route to check if user's EmailAddress is available for registration
  ============================================================ */
  router.get('/checkEmailAddress/:EmailAddress', (req, res) => {
    // Check if EmailAddres was provided in paramaters
    console.log(req.params.EmailAddress);
    if (!req.params.EmailAddress) {
      res.json({ success: false, message: 'EmailAddress was not provided' }); // Return error
    } else {
      // Search for user's EmailAddress in database;
      User.findOne({ EmailAddress: req.params.EmailAddress }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's EmailAddress is taken
          if (user) {
            res.json({ success: false, message: 'EmailAddress is already taken' }); // Return as taken e-mail
          } else {
            res.json({ success: true, message: 'EmailAddress is available' }); // Return as available e-mail
          }
        }
      });
    }
  });



  /* ========
  LOGIN ROUTE
  ======== */
  router.post('/login', (req, res) => {
    // Check if EmailAddress was provided
    if (!req.body.EmailAddress) {
      res.json({ success: false, message: 'No EmailAddress was provided' }); // Return error
    } else {
      // Check if Password was provided
      if (!req.body.Password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
      } else {
        // Check if EmailAddress exists in database
        User.findOne({ EmailAddress: req.body.EmailAddress.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if EmailAddress was found
            if (!user) {
              res.json({ success: false, message: 'EmailAddress not found.' }); // Return error
            } else {
              const validPassword = user.comparePassword(req.body.Password); // Compare password provided to password in database
              // Check if Password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    EmailAddress: user.EmailAddress
                  }
                }); // Return success and token to frontend
              }
            }
          }
        });
      }
    }
  });

  /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

  /* ===============================================================
     Route to get Users data
  =============================================================== */
  router.get('/getUsers', (req, res) => {
    // Search for EmailAddress in database
    User.findOne({ _id: req.decoded.userId }).select('EmailAddress FirstName LastName').exec((err, EmailAddress) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if EmailAddress was found in database
        if (!EmailAddress) {
          res.json({ success: false, message: 'EmailAddress not found' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, EmailAddress: EmailAddress }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

  /* ===============================================================
     Route to get user data
  =============================================================== */
  router.get('/getUser/:EmailAddress', (req, res) => {
    // Check if EmailAddress was passed in the parameters
    if (!req.params.EmailAddress) {
      res.json({ success: false, message: 'No EmailAddress was provided' }); // Return error message
    } else {
      // Check the database for EmailAddress
      User.findOne({ EmailAddress: req.params.EmailAddress }).select('EmailAddress LastName FirstName').exec((err, EmailAddress) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
        } else {
          // Check if user was found in the database
          if (!EmailAddress) {
            res.json({ success: false, message: 'EmailAddress not found.' }); // Return error message
          } else {
            res.json({ success: true, EmailAddress: EmailAddress }); // Return the public user's profile data
          }
        }
      });
    }
  });

  return router; // Return router object to main index.js
}
/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS

// Validate Function to check email Address length
let emailAddressLengthChecker = (EmailAddress) => {
  // Check if email Address exists
  if (!EmailAddress) {
    return false; // Return error
  } else {
    // Check the length of email Address string
    if (EmailAddress.length < 5 || EmailAddress.length > 30) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid email Address
    }
  }
};

// Validate Function to check if valid email Address format
let validEmailAddressChecker = (EmailAddress) => {
  // Check if email Address exists
  if (!EmailAddress) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid email Address
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(EmailAddress); // Return regular expression test results (true or false)
  }
};

// Array of email Address Validators
const emailAddressValidators = [
  // email Address Validator
  {
    validator: emailAddressLengthChecker,
    message: 'email Address must be at least 5 characters but no more than 30'
  },
  // Second Email Validator
  {
    validator: validEmailAddressChecker,
    message: 'Must be a valid email Address'
  }
];


// Validate Function to check FirstName length
let firstNameLengthChecker = (FirstName) => {
  // Check if FirstName exists
  if (!FirstName) {
    return false; // Return error
  } else {
    // Check length of FirstName string
    if (FirstName.length < 3 || FirstName.length > 50) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid FirstName
    }
  }
};

// Validate Function to check if valid FirstName format
let validFirstName = (FirstName) => {
  // Check if FirstName exists
  if (!FirstName) {
    return false; // Return error
  } else {
    // Regular expression to test if FirstName format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(FirstName); // Return regular expression test result (true or false)
  }
};

// Array of FirstName validators
const firstNameValidators = [
  // First LastName validator
  {
    validator: firstNameLengthChecker,
    message: 'First Name must be at least 3 characters but no more than 50'
  },
  // Second FirstName validator
  {
    validator: validFirstName,
    message: 'First Name must not have any special characters'
  }
];



// Validate Function to check LastName length
let lastNameLengthChecker = (LastName) => {
  // Check if LastName exists
  if (!LastName) {
    return false; // Return error
  } else {
    // Check length of LastName string
    if (LastName.length < 3 || LastName.length > 50) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid LastName
    }
  }
};

// Validate Function to check if valid LastName format
let validLastName = (LastName) => {
  // Check if LastName exists
  if (!LastName) {
    return false; // Return error
  } else {
    // Regular expression to test if LastName format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(LastName); // Return regular expression test result (true or false)
  }
};

// Array of LastName validators
const lastNameValidators = [
  // First LastName validator
  {
    validator: lastNameLengthChecker,
    message: 'Last Name must be at least 3 characters but no more than 50'
  },
  // Second LastName validator
  {
    validator: validLastName,
    message: 'Last Name must not have any special characters'
  }
];

// Validate Function to check password length
let passwordLengthChecker = (Password) => {
  // Check if password exists
  if (!Password) {
    return false; // Return error
  } else {
    // Check password length
    if (Password.length < 8 || Password.length > 35) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Validate Function to check if valid password format
let validPassword = (Password) => {
  // Check if password exists
  if (!Password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(Password); // Return regular expression test result (true or false)
  }
};

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  // Second password validator
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];





// User Model Definition
const userSchema = new Schema({
  EmailAddress: { type: String, required: true, unique: true, lowercase: true, validate: emailAddressValidators },
  FirstName: { type: String, required: true, validate: firstNameValidators },
  LastName: { type: String, required: true, validate: lastNameValidators },
  Password: { type: String, required: true, validate: passwordValidators },
  BirthDate: { type: Date, required: true },
  Gender: { type: String, required: true }

});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('Password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.Password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.Password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(Password) {
  return bcrypt.compareSync(Password, this.Password); // Return comparison of login password to password in database (true or false)
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);
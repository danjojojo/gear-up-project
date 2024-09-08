const bcrypt = require('bcrypt');
const saltRounds = 10;

// Replace 'your_plain_password' with the actual password you want to hash
const plainPassword = '12345';

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed Password:', hash);
});
const mongoose = require("mongoose");
let bcrypt = require("bcrypt-nodejs");

const user = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "agency"],
    default: "agency"
  },
  imgUrl: {
    type: String,
    default: "Profil.png"
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  password: {
    type: String,
    required: true,
  },
  
 agency : {type: mongoose.Schema.Types.ObjectId, ref: 'agency'}

});


user.methods.comparePassword = function(candidatePassword, cb) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

user.pre("save", function() {
  console.log(this.password);
  this.password = bcrypt.hashSync(this.password);
  console.log(this.password);
});

module.exports = mongoose.model("user", user);

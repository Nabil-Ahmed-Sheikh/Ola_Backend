const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationSchema = new Schema({

  institution: {
    type: String,
  },

  subject: {
    type: String,
  },

  from: {
    type: String,
  },

  till: {
    type: String,
  }

});

const WorkSchema = new Schema({

  organization: {
    type: String,
  },

  position: {
    type: String,
  },

  from: {
    type: String,
  },

  till: {
    type: String,
  }

});



const UserSchema = new Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
    enum : ['USER','ADMIN'],
    default: "USER",
  },

  status: {
    type: String,
    required: true,
    enum : ['ACTIVE','INACTIVE','DELETED','BANNED'],
    default: "ACTIVE", //ACTIVE
  },

  gender: {
    type: String,
    required: true,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    default: "MALE"
  },

  profilePhoto: {
    type: String,
  },

  coverPhoto: {
    type: String,
  },

  work: [WorkSchema],

  education: [EducationSchema],

  relationShip: {
    type: String,
    enum: ["Single", "Married", "In a relationship"]
  },
  
  interest: [], 

}, { timestamps: true });

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};




module.exports = User = mongoose.model("user", UserSchema, 'user');

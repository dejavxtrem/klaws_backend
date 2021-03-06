const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const availableTimesSchema = mongoose.Schema({
   weekday: {type: String, required: true},
   morning: { type: String, required: true},
   afternoon: {type: String, required: true}
})



const nailTechSchema =  mongoose.Schema({
    avatar: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required:true},
    type:{type: String, required:true},
    salonname: {type: String, required:true},
    address: {type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    zipcode: {type: String, required: true},
    availabletimes: [availableTimesSchema],
    openinghour: {type: String, required: true},
    closinghour: {type: String, requied: true},
    artistLat: { type: String },
    artistLong: { type: String },
    accuracy: { type: String },
}
, {timestamp: true})




nailTechSchema.methods.checkPassword = function(passwordAttempt, callback) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
  });
};




nailTechSchema.pre("save", function (next) {
  const nailTech = this;

  if (!nailTech.isModified("password")) {
    return next();
  } 

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(nailTech.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      nailTech.password = hash;
      next();
    });
  });
});



// nailTechSchema.methods.comparePassword = function (nailTechPassword) {
//   console.log(nailTechPassword)
//   const nailTech = this;
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(nailTechPassword, nailTech.password, (err, isMatch) => {
//       if (err) {
//         return reject(err);
//       }
//       if (!isMatch) {
//         return reject(false);
//       }
    
//       resolve(true);
      
      
//     });
//   }).catch() 
// };





nailTechSchema.methods.withoutPassword = function () {
  const nailTech = this.toObject();
  delete nailTech.password;
  return nailTech;
};

module.exports = mongoose.model("nailArtist", nailTechSchema);

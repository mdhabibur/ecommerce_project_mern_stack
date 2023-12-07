import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
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
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//for checking if password matches or not
userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

//now need to hash password before saving to database and for that 'pre' method is used
userSchema.pre("save", async function (next) {
  if(!this.isModified('password')){
    next();
  }

  //if password is alright , then hash it and save it 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  //here this refers to the current user object

});


const User = mongoose.model('User', userSchema);

export default User;
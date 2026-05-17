const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    gender: {
     type: String,
     enum: ['Male', 'Female', 'Other', ''],
     default: '',
    },
   dateOfBirth: {
    type: Date,
    default: null,
   },
   avatar: {
    type: String,
    default: '',
   },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin','seller'],
      default: 'user',
    },
    sellerRequest: {
      status: {
       type: String,
       enum: ['none', 'pending', 'approved', 'rejected'],
       default: 'none',
      },
     requestedAt: {
       type: Date,
      default: null,
      },
     reviewedAt: {
      type: Date,
      default: null,
     },
    rejectionCount: {
       type: Number,
        default: 0 
      },
     },
    phone: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    resetPasswordOtp: {
     type: String,
     select: false,
   },
   resetPasswordOtpExpiry: {
    type: Date,
    select: false,
   },
  },
  {
    timestamps: true, 
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

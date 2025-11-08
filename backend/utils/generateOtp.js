// utils/generateOtp.js

// 🔹 Simple 6-digit OTP generator function
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

import dotenv from 'dotenv'
dotenv.config(
  {
      path: '../.env'
  }
)
// console.log("COOKIE_EXPIRE:", process.env.COOKIE_EXPIRE);

export const sendToken = (user, statusCode, message, res) => {
    const token = user.getJWTToken();
    const cookieExpireInDays = parseInt(process.env.COOKIE_EXPIRE, 10);

  const options = {
    expires: new Date(Date.now() + cookieExpireInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      message,
      token,
    });
};
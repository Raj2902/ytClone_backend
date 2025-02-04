import ServerError from "../Errors/serverError.mjs";

export default function PasswordValidation(req, res, next) {
  //this is the middleware for validating the password
  try {
    const { password } = req.body;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{7,14}$/;
    if (!regex.test(password)) {
      //check for the password correct format if its valid
      const error = new Error();
      error.status = 400;
      error.message = `Password must contain at least one lowercase letter, one uppercase letter, one number,length 8-15 characters,
         and one special character (@,$,!,%,*,?,&).`;
      throw error;
    }
    next(); //if the password is valid then call the next middleware
  } catch (err) {
    ServerError(res, err);
  }
}

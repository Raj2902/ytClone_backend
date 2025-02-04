import checkUserExists from "../middlewares/ValidateLoginEntry.mjs";
import PasswordValidation from "../middlewares/PasswordValidation.middleware.mjs";
import formidableData from "../middlewares/formidable/formidable.middleware.mjs";
import validateJWT from "../middlewares/JWT/validate.mjs";
//import all the controllers
import RegisterController, {
  LoginController,
} from "../controllers/Auth.controller.mjs";
import ServerError from "../Errors/serverError.mjs";

export default function UserRoutes(router) {
  router.post(
    "/register",
    formidableData,
    PasswordValidation,
    RegisterController
  );
  router.post("/login", checkUserExists, LoginController);
  router.get("/validatejwt", validateJWT, (req, res) => {
    try {
      res.status(200).json({ message: "User logged in" });
    } catch (error) {
      ServerError(res, error);
    }
  });
}

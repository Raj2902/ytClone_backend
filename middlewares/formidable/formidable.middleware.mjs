import formidable from "formidable";
import ServerError from "../../Errors/serverError.mjs";

export default function formidableData(req, res, next) {
  try {
    const form = formidable({});
    //files are mandatory to send.
    form.parse(req, (err, fields, files) => {
      if (err) {
        ServerError(res, err);
      }
      // send data in json format
      let response = {};
      for (const [key, values] of Object.entries(fields)) {
        if (key == "categories" || key == "tags" || key == "comments") {
          response[key] = values;
        } else {
          response[key] = values[0];
        }
      }
      for (const [key, values] of Object.entries(files)) {
        response[key] = values[0];
      }
      req.body = response;
      next();
    });
  } catch (err) {
    ServerError(res, err);
  }
}

import ServerError from "../Errors/serverError.mjs";
export default function TeststController(req, res) {
  try {
    res.status(200).json({ message: "Test Router is working." });
  } catch (err) {
    ServerError(res, err);
  }
}

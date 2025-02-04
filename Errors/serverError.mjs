export default function ServerError(res, err) {
  //sending the server error of catch resuable code.
  return res.status(500).json({ message: err.message });
}

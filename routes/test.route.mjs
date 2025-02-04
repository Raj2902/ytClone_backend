import TeststController from "../controllers/Test.controller.mjs";

export default function TestRoutes(router) {
  router.get("/test", TeststController);
}

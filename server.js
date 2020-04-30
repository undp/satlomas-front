const express = require("express");
const next = require("next");
const nextI18NextMiddleware = require("next-i18next/middleware");

const nextI18next = require("./i18n");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));

  server.get("/layers", (req, res) => {
    return res.redirect("/admin/layers");
  });

  server.get("/layers/:uuid", (req, res) => {
    const actualPage = "/layers";
    const queryParams = {
      uuid: req.params.uuid
    };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/maps", (req, res) => {
    return res.redirect("/admin/maps");
  });

  server.get("/maps/:uuid", (req, res) => {
    const actualPage = "/maps";
    const queryParams = {
      uuid: req.params.uuid
    };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/admin/:section", (req, res) => {
    const { section } = req.params;
    return app.render(req, res, "/admin", { section: section });
  });

  server.get("/admin/rules/new/:tab", (req, res) => {
    const { tab } = req.params;
    return app.render(req, res, "/admin", { section: "create_rule", tab });
  });
  server.get("/admin/rules/:tab/:id", (req, res) => {
    const { id, tab } = req.params;
    return app.render(req, res, "/admin", { section: "create_rule", id, tab });
  });

  server.get("*", (req, res) => handle(req, res));

  await server.listen(3000);
  console.log("> Ready on http://localhost:3000"); // eslint-disable-line no-console
})();

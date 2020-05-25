const express = require("express");
const next = require("next");
const nextI18NextMiddleware = require("next-i18next/middleware").default;

const nextI18next = require("./i18n");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  await nextI18next.initPromise;
  server.use(nextI18NextMiddleware(nextI18next));

  server.get("/maps/:type", (req, res) => {
    const actualPage = "/changes-map";
    const queryParams = { type: req.params.type };
    app.render(req, res, actualPage, queryParams);
  });

  const ruleTypes = ["parameter", "scope-type", "scope"];
  for (let i = 0; i < ruleTypes.length; i++) {
    const ruleType = ruleTypes[i];

    server.get(`/user/${ruleType}-rules/new`, (req, res) => {
      return app.render(req, res, "/user", { section: `create-${ruleType}-rule` });
    });

    server.get(`/user/${ruleType}-rules/:id`, (req, res) => {
      const { id } = req.params;
      return app.render(req, res, "/user", { section: `create-${ruleType}-rule`, id });
    });
  }

  server.get("/user/:section", (req, res) => {
    const { section } = req.params;
    return app.render(req, res, "/user", { section: section });
  });

  server.get("*", (req, res) => handle(req, res));

  await server.listen(3000);
  console.log("> Ready on http://localhost:3000"); // eslint-disable-line no-console
})();

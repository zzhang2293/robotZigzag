const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const express = require("express");

// A dict of user:token
let token_cache = {};

// A dict of user:number_of_tokens_generated
let token_counter = {};

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(express.json());

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/backend/tournament/*": "/$1",
    "/backend/*": "/$1",
  })
);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// Fake getting a random maze
server.get("/maze_configurations/random/", (req, res) => {
  res.jsonp({
    id: Math.floor(Math.random() * 10000),
    name: "example maze",
    start_row: 0,
    start_col: 0,
    end_row: 6,
    end_col: 6,
    level_configuration: [
      ["d", "9", "8", "a", "c", "9", "c"],
      ["5", "5", "3", "c", "3", "6", "5"],
      ["5", "1", "e", "3", "8", "c", "7"],
      ["1", "6", "9", "c", "7", "3", "c"],
      ["5", "9", "6", "3", "a", "c", "5"],
      ["5", "7", "b", "a", "c", "5", "5"],
      ["3", "a", "a", "a", "6", "3", "6"],
    ],
  });
});

// Change user avatar
server.put("/profiles/avatar", (req, res) => {
  const user = Object.keys(token_cache).find(
    (user) => token_cache[user] === req.headers.authorization
  );

  const profiles = require("./db.json").profiles;
  const valid_profile = profiles.find((p) => user.id === p.user);

  const newAvatar = req.body.avatar;
  valid_profile.avatar = newAvatar;
  res.jsonp({ status: "ok" });
});

// Get the number of online users
server.get("/profiles/online", (req, res) => {
  res.jsonp(Object.keys(token_cache).length);
});

// Fake endpoint for sending code
server.post("/communication/receive_file", (req, res) => {
  res.jsonp({
    status: "ok",
    telemetry: [{ time: 0, position: [0, 0] }],
  });
});

// Auth profile mock
server.get("/users/me", (req, res) => {
  delete require.cache[require.resolve("./db.json")];
  const user = Object.keys(token_cache).find(
    (user) => token_cache[user] === req.headers.authorization
  );
  const users = require("./db.json").users;
  const valid_user = users.find((u) => user === u.username);
  res.jsonp(valid_user);
});

// Mock the endpoint for retrieving one's own profile
server.get("/profiles/me", (req, res) => {
  delete require.cache[require.resolve("./db.json")];
  const user = Object.keys(token_cache).find(
    (user) => token_cache[user] === req.headers.authorization
  );
  const users = require("./db.json").users;
  const valid_user = users.find((u) => user === u.username);
  if (!valid_user) {
    res.sendStatus(500);
    return;
  }
  const profiles = require("./db.json").profiles;
  const valid_profile = profiles.find((p) => valid_user.id === p.user);
  res.jsonp(valid_profile);
});

// Log out function
server.post("/auth/token/logout", (req, res) => {
  const user = Object.keys(token_cache).find(
    (user) => token_cache[user] === req.headers.authorization
  );
  delete token_cache[user];
  res.sendStatus(200);
});

// Log in
server.post("/auth/token/login", (req, res) => {
  const users = require("./db.json").users;
  const valid_user = users.find(
    (u) => req.body.username === u.username && req.body.password === u.password
  );
  if (valid_user) {
    token_counter.username = (token_counter.username ?? 0) + 1;
    let token = Buffer.from(
      `${valid_user.username}:${valid_user.password}:${token_counter.username}`
    ).toString("base64");
    res.jsonp({
      auth_token: token,
    });
    token_cache[valid_user.username] = `Token ${token}`;
  } else {
    if (
      (req.body.username ?? []).length === 0 ||
      (req.body.password ?? []).length === 0
    ) {
      let rr = {};
      if ((req.body.username ?? []).length === 0) {
        rr.username = ["This field may not be blank."];
      }
      if ((req.body.password ?? []).length === 0) {
        rr.password = ["This field may not be blank."];
      }
      res.status(400).jsonp(rr);
    }
    res.status(401).jsonp({
      non_field_errors: ["Unable to log in with provided credentials."],
    });
  }
});

// Access control
server.use((req, res, next) => {
  let allow_any = ["/backend/auth/token/login"];

  function isAuthorized(req) {
    return (
      allow_any.includes(req.path) ||
      Object.values(token_cache).includes(req.headers.authorization)
    );
  }

  if (isAuthorized(req)) {
    // add your authorization logic here
    next(); // continue to JSON Server router
  } else {
    if ((req.headers.authorization ?? "").length > 0) {
      res.status(401).jsonp({
        detail: "Invalid token.",
      });
    } else {
      res.status(401).jsonp({
        detail: "Authentication credentials were not provided.",
      });
    }
  }
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});

import jsonServer from "json-server";
import cookieParser from "cookie-parser";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(cookieParser());
server.use(jsonServer.bodyParser); // parser for POST request

server.post("/api/login", (req, res) => {
  const { account, password } = req.body;

  const db = router.db;
  const user = db.get("users").find({ account, password }).value();

  if (user) {
    res.cookie("user_account", user.account, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      account: user.account,
      role: user.role,
    });
  } else {
    res.status(401).json({
      message: "Login failed",
    });
  }
});

server.get("/api/me", (req, res) => {
  try {
    const account = req.cookies.user_account;

    if (!account) {
      return res.status(401).json({
        message: "Not login",
      });
    }

    const db = router.db;
    const user = db.get("users").find({ account }).value();

    if (user) {
      res.status(200).json({
        account: user.account,
        role: user.role,
      });
    } else {
      res.status(401).json({
        message: "User not found",
      });
    }
  } catch (e) {
    console.error("Internal serror error", e);
    res.status(500).json({
      message: "Internal Serror Error",
    });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log("Mock server is running");
});

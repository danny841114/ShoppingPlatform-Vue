import jsonServer from "json-server";
import cookieParser from "cookie-parser";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults(); // 靜態檔案分析，CORS 跨域支援，日誌支援

server.use(middlewares);
server.use(cookieParser());
server.use(jsonServer.bodyParser); // parser for request body

server.post("/api/login", (req, res) => {
  try {
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
  } catch (e) {
    console.error("Internal serror error", e);
    res.status(500).json({
      message: "Internal Serror Error",
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

server.post("/api/logout", (req, res) => {
  res.clearCookie("user_account");
  res.status(200).json({
    message: "Logout successfully",
  });
});

server.get("/api/product/filter", (req, res) => {
  try {
    const size = parseInt(req.query.size) || 10;
    const page = parseInt(req.query.page) || 0;
    const keyword = String(req.query.keyword) || "";

    const db = router.db;
    let products = db.get("products").value() || [];

    if (keyword) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword.toLowerCase()) ||
          p.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    const totalElements = products.length;
    const totalPages = Math.ceil(totalElements / size);

    const start = page * size;
    const end = start + size;
    const paginatedProducts = products.slice(start, end);

    res.jsonp({
      totalPages: totalPages,
      totalElements,
      totalElements,
      page: page,
      size: size,
      products: paginatedProducts,
    });
  } catch (e) {
    console.error("Internal serror error", e);
    res.status(500).json({
      message: "Internal Serror Error",
    });
  }
});

const rewriter = jsonServer.rewriter({ "/api/product": "/products" });
server.use(rewriter);

server.use(router);
server.listen(3000, () => {
  console.log("Mock server is running on http://localhost:3000");
});

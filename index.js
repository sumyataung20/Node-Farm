const fs = require("fs");
const url = require("url");
const http = require("http");
const replaceTemplate = require("./modules/replaceTemplate");
console.log(replaceTemplate);

const tempOverview = fs.readFileSync(
     "./Templates/template-overview.html",
     "utf-8"
);
const tempCard = fs.readFileSync("./Templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync(
     "./Templates/template-product.html",
     "utf-8"
);
const data = fs.readFileSync("./Data/data.json", "utf-8");
const dataObj = JSON.parse(data);
console.log(dataObj);
const server = http.createServer((req, res) => {
     // const pathName = req.url;
     // console.log(pathName);

     const { query, pathname } = url.parse(req.url, true);
     // console.log(query);
     // console.log(pathname);

     if (pathname === "/" || pathname === "/overview") {
          // res.end("This is overview");

          res.writeHead(200, { "Content-type": "text/html" });
          const cardsHtml = dataObj
               .map((el) => replaceTemplate(tempCard, el))
               .join("");
          const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
          console.log(output);
          console.log(cardsHtml);
          res.end(output);
     } else if (pathname === "/product") {
          res.writeHead(200, { "Content-type": "text/html" });
          const product = dataObj[query.id];
          const output = replaceTemplate(tempProduct, product);
          res.end(output);
     } else if (pathname === "/api") {
          res.writeHead(200, { "Content-type": "application/json" });
          res.end(data);
     } else {
          res.writeHead(404, {
               "Content-type": "text/html",
               "my-own-header": "hello-world",
          });
          res.end("<h1>Page not found </h1>");
     }
});

server.listen(8000, "127.0.0.1", () => {
     console.log("Listening on port 8000");
});

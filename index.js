const http = require("http");
const db = require("./connection/db");
const hostname = "localhost";
const port = 3000;

const { pagination } = require("./pagination");

const server = http.createServer((req, res) => {
  const { headers, method, url } = req;

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;


  console.log("node js");

  if (url === "/users") {
    const Users = db.users;


    const query = {
        order: [["id", "DESC"]],
      }
    
      const option = {
        req:req,
        page:1,
        limit:10,
        metatags:'paginationInfo', // Optional
        lists:"userlist",  // Optional
        range:5
      }
    

    pagination(Users,option, { ...query }, (response) => {
        res.write(JSON.stringify({ payload: response }));
        res.end();
    });

   
  } else {
    res.write("easycodingcourse");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

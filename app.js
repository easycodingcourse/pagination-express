require('dotenv').config()
const express = require("express");
const app = express();
const port = 3000;
const db = require("./connection/db");
const { pagination } = require("./pagination");

app.get("/users", (req, res) => {
  console.log("express");
  const Users = db.users;
  const query = {
    attributes:{
      exclude:['created_at','updated_at']
    },
    where:{
      status:1
    },
    order: [["id", "DESC"]],
  };

  const option = {
    req: req,
    page: 2,
    limit: 5,
    matatags: "paginationInfo", // Optional
    lists: "userlist", // Optional
    range: 5,
  };

  // 1. Option 1
  pagination(Users, option, { ...query }, (response) => {
    res.json({ payload: response });
  });

  // 2. Option 2
  // getList(res,option,query)
});

// const getList = async (res,option,query)=>{
//   const response = await pagination(Users,option,{...query});
//     res.json({ payload: response })
// }

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

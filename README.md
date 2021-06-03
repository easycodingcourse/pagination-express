# pagination-express

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![MIT License][license-image]][license-url]
[![Slack][slack-image]][slack-url]

> Node.js pagination-express is the complete pagination solution.

**v1.0.0+**: As of `v1.0.0`, we short description write here.

## Install

```bash

npm install -save pagination-express

or

npm install pagination-express


or

npm i pagination-express


```

## API

```js
const { pagination } = require("pagination-express");
```



```js


  const query = {
    attributes: ["firstName", "lastName"],
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
    range: 5,  // Optional if need paging
  };


// ## method 1
pagination(Users, option, { ...query }, (response) => {
    res.json({ payload: response });
});

// Or

// ## method 2
const response = await pagination(Users, option, { ...query });
res.json({ payload: response });


```







## Example 1 with Sequelize ORM 

```js
// # app.js

const express = require("express");
const app = express();
const { pagination } = require("./pagination");
// model define as any way
const db = require("./connection/db");
const Users = db.users;
// or
// const Users = require("./connection/db").users;

app.get("/users", (req, res) => {
  // get page number from req as nay method as your wish
  const { page, limit } = req.query;

  // you can use all sequelize ORM query here........
  const query = {
    attributes: ["firstName", "lastName"],
    where:{
      status:1
    },
    order: [["id", "DESC"]],
  };

  const option = {
    req: req,
    page: page,
    limit: 10,   // give a limit
    range: 5
  };



  pagination(Users, option, { ...query }, (response) => {
    res.json({ payload: response });
  });

  // or you can use anohter method

  // you need a async function to run it
  // const response = await pagination(Users, option, { ...query });
  // res.json({ payload: response });


  
});
```



```json

// # Output


// http://localhost:3000/users?page=2&limit=5

{
  "payload": {
    "paginationInfo": {
      "status": true,
      "totalList": 101,
      "currentList": 5,
      "totalPage": 21,
      "hasNextPage": true,
      "hasPreviousPage": true,
      "page": {
        "totalPage": 21,
        "currentPage": 2,
        "nextPage": 3,
        "previousPage": 1
      },
      "currentPage": {
        "page": 2,
        "url": "http://localhost/users?page=2&limit5"
      },
      "nextPage": {
        "page": 3,
        "url": "http://localhost/users?page=3&limit5"
      },
      "previousPage": {
        "page": 1,
        "url": "http://localhost/users?page=1&limit5"
      },
      "paging": [
        {
          "active": false,
          "page": 1
        },
        {
          "active": true,
          "page": 2
        },
        {
          "active": false,
          "page": 3
        },
        {
          "active": false,
          "page": 4
        },
        {
          "active": false,
          "page": 5
        }
      ]
    },
    "userlist": [
      {
        "id": 96,
        "firstName": "demo95",
        "lastName": "user"
      },
      {
        "id": 95,
        "firstName": "demo94",
        "lastName": "user"
      },
      {
        "id": 94,
        "firstName": "demo93",
        "lastName": "user"
      },
      {
        "id": 93,
        "firstName": "demo92",
        "lastName": "user"
      },
      {
        "id": 92,
        "firstName": "demo91",
        "lastName": "user"
      }
    ]
  }
}


```



## Change default name of object field
1. matatags
2. list



```js

  const option = {
    req: req,
    page: page,
    limit: 10,
    matatags: "paginationInfo", // Optional for change default name of matatags 
    lists: "userlist", // Optional for change default name of list 
    range: 5
  };

```


## use can use it with async function also

```js

  const response = await pagination(Users, option, { ...query });
  res.json({ payload: response });


```


## License

[MIT][license-url]

[downloads-url]: https://npmjs.org/package/pagination-express


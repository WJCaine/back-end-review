# billy-nc-news

##Getting Started

https://billy-nc-news.herokuapp.com

This is a server allowing us to access topics, users, articles and comments all relating to news articles.

---

## Cloning

In order to clone this project go to https://github.com/WJCaine/back-end-review. Fork the project then go to the appropriate directory in your terminal then use:

```bash
git clone https://github.com/WJCaine/back-end-review.git
```

## Prerequisites

in order to run, this app requires the use of the knex postSql package and the express package. Additionally several packages were used in the development and testing of the server. These are as follows mocha, chai, chai-sorted, sams-chai-sorted and supertest - all used for testing.

This server was written on node V12.10.0 and psql V10.6.
###Installing
These can be installed as follows

```bash
npm i knex pg express

```

and for testing

```bash
npm i mocha chai chai-sorted sams supertest
```

Note additional tests specifically relating to heroku can be carried out using

```bash
heroku logs --tail
```

##Setup

In order for the server to work it is necessary to write a knexfile.js

At the top of this file add the following lines

```javascript
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";
```

This file should contain a baseConfig object. This object should contain a key "Client" with a value of "pg", a "migration" key with a value of an object containing a "directory" key, which is a path to the migrations directory. Similary it must contain a "seed" key with a value of an object containing a "directory" key with a value of a path to the "seed" directory.

Additionally in this file you must construct a customConfig object. Within this there are 3 objects; with keys "test", "development", and "production". The "test" and "production" object both contain a key "connection" with itself value being an object containing a "database" key with a value of the name of your development and test databases appropriately. If using linux these 2 object must also contain your PSQL username and password.

The production object should be as follows

```javascript
production: {
  connection: `${DB_URL}?ssl=true`;
}
```

then to seed and migrate the project use

```bash
npm run seed
```

note that there are additional commands to migrate the database without seeding it. Consult package.json to see these commands.

## Testing

The tests for this server are stored in the /spec/ file. There are seperate functions for testing the app itself and utility functions.

Main

```bash
npm test
```

These are the test to ensure all endpoints on the app are returning the correct data, with the correct status code, all in the correct format.

### Utilities

```bash
npm run test-utils
```

These are used to test utility function, mostly used to manipulate data into the form the sql require it to be in for seeding.

## Deployment

in order to deploy simply use

```bash
heroku open
```

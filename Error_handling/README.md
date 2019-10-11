billy-nc-news

https://billy-nc-news.herokuapp.com

This is a server allowing us to access topics, users, articles and comments all relating to news articles.

---

Prerequisites

in order to run, this app requires the use of the knex postSql package and the express package. Additionally several packages were used in the development and testing of the server. These are as follows mocha, chai, chai-sorted, sams-chai-sorted and supertest - all used for testing.
Installing
These can be installed as follows

```{Bash}
npm i knex pg express

```

and for testing

`````{bash}
npm i mocha chai chai-sorted sams supertest
```{bash}

Note additional tests specifically relating to heroku can be carried out using

```{bash}
heroku logs --tail
```{bash}
---

Testing

The tests for this server are stored in the /spec/ file. There are seperate functions for testing the app itself and utility functions.

Main

````{bash}
npm test
```{bash}

These are the test to ensure all endpoints on the app are returning the correct data, with the correct status code, all in the correct format.

Utilities
```{bash}
npm run test-utils
```{bash}

These are used to test utility function, mostly used to manipulate data into the form the sql require it to be in for seeding.

___
`````

Deployment

in order to deploy simply use

```{bash}
heroku open
```

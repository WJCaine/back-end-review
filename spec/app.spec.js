process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = require("chai");
const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app.js");
chai.use(require("chai-sorted"));

describe("app", () => {
  after(() => connection.destroy());
  beforeEach(() => {
    return connection.seed.run();
  });
  it("ALL:405 when given any valid URL with an unpermitted method", () => {
    return request(app)
      .delete("/api/articles")
      .expect(405);
  });
  it('ALL:404 When given any invalid URL returns an error 404 with message "the requested URL was not found on this server"', () => {
    return request(app)
      .get("/BADURL")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal(
          "the requested URL was not found on this server"
        );
      });
  });
  describe("/api", () => {
    describe("/topics", () => {
      it("GET 200  : Returns a list of all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an("object");
            expect(body.topics[0]).to.have.keys("slug", "description");
            expect(body.topics[0]).to.eql({
              description: "The man, the Mitch, the legend",
              slug: "mitch"
            });
          });
        //
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        it("GET:200 Returns all details about the user specified in parameter", () => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.eql({
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
              });
            });
        });
        it("ERROR:404 , throws a 404 error when a username which does not exist is passed ", () => {
          return request(app)
            .get("/api/users/badusername")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("User not found");
            });
        });
      });
    });
    describe("/articles", () => {
      it("GET:200 , returns an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.have.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("GET:200 , accepts a sort_by query , whcih defaults to created_at", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("title", { descending: true });
          });
      });
      it("GET:200 if given a sorted_by query for non-existant column, revert to default", () => {
        return request(app)
          .get("/api/articles?sort_by=badColumn")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET:200 , ignores any order queries other than asc or desc (defaults to desc)", () => {
        return request(app)
          .get("/api/articles?order=badQuery")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET:200 , accepts an order query, defaulting to ascending", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", { ascending: true });
          });
      });
      it("GET:200 , accepts an author query, showing only articles by a given author", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.author).to.equal("icellusedkars");
            });
          });
      });
      it("GET:200 , accepts an topic query, showing only articles on a given topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("GET:404 - if a query contains a topic of a user which does not exist throw 404 with message dependent on what is missing", () => {
        return request(app)
          .get("/api/articles?topic=kitten")
          .expect(404)
          .then(({ body }) => {
            expect(body).to.contain.key("msg");
          });
      });
      it("GET:200 - if a query would be empty but has a valid topic and author query simply returns an emptnpmy array", () => {
        return request(app)
          .get("/api/articles?topic=cats&author=icellusedkars")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.eql([]);
          });
      });
      describe("/:article_id", () => {
        it("GET:200 retrieves an given article using its article id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: 13,
                votes: 100
              });
            });
        });
        it('GET:404 if given an article_id which does not exist throw 404 "No such article found"', () => {
          return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("No such article found");
            });
        });
        it('GET:400, if given an article_id which is not an integer throw a 400 "Bad parameter syntax"', () => {
          return request(app)
            .get("/api/articles/whyonearth")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax in request");
            });
        });
        it("PATCH:200 allows user to update the vote count on a given article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: 13,
                votes: 101
              });
            });
        });
        it("PATCH:200 , if given no body simply returns the unchanged comment to the user", () => {
          return request(app)
            .patch("/api/articles/1")
            .send()
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: 13,
                votes: 100
              });
            });
        });
        it("PATCH:404 , throws a 404 when user tries to update a article which does not exist", () => {
          return request(app)
            .patch("/api/articles/20000")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("No such article found");
            });
        });
        it('PATCH:400 , if given a body with key in incorrect format will throw a 400 error "invalid formatting on body of request"', () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ bad_key: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax in request");
            });
        });
        it("POST:201 /comments, takes an object with properties username and body and responds with the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: "icellusedkars",
              body: "the cheese stands alone"
            })
            .expect(201)
            .then(({ body: { comment } }) => {
              console.log(comment);
              expect(comment).to.have.keys(
                "article_id",
                "author",
                "body",
                "comment_id",
                "created_at",
                "votes"
              );
              expect(comment.votes).to.equal(0);
              expect(comment.body).to.equal("the cheese stands alone");
              expect(comment.article_id).to.equal(1);
            });
        });
        it("POST:404 , throws a 404 when asked to add comment to article which does not exist", () => {
          return request(app)
            .post("/api/articles/9999/comments")
            .send({
              username: "icellusedkars",
              body: "the cheese stands alone"
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("No such article found");
            });
        });
        it("POST:400 , throws a 400 when given a article_id in the wrong format", () => {
          return request(app)
            .post("/api/articles/theresbeenamurder/comments")
            .send({
              username: "icellusedkars",
              body: "the cheese stands alone"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax in request");
            });
        });
        it("POST:400 , throws a 400 when given a body in the wrong format", () => {
          return request(app)
            .post("/api/articles/theresbeenamurder/comments")
            .send({
              username: 1234,
              body: "the cheese stands alone"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax in request");
            });
        });
        it("POST:400 , throws a 400 when given a body in the wrong format", () => {
          return request(app)
            .post("/api/articles/theresbeenamurder/comments")
            .send({
              author: "icellusedkars",
              body: "the cheese stands alone"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax in request");
            });
        });
        it("POST:400, throws 400 when request does not include all required keys", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              author: "icellusedkars"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax in request");
            });
        });
        it("GET:200 /comments, given an article id can retrieve all comments assosciated with that article", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.an("array");
              expect(body.comments[0]).to.have.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
        it("GET:404 /comments, given an article_id in the correct format but which does not exist throws a 404", () => {
          return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("No such article found");
            });
        });
        it("GET:200 returns an empty array when given a valid article_id which has no comments.", () => {
          return request(app)
            .get("/api/articles/12/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.eql([]);
            });
        });
        it('GET:400 throws a 400 with "Invalid input syntax in request" when given an article_id of the wrong format ', () => {
          return request(app)
            .get("/api/articles/potato/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax in request");
            });
        });
        it("GET:200 /comments , accepts a sort_by query which allows us to order the comments by a specific key defaulting to created_at", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("votes", { descending: true });
            });
        });
        it("GET:200 /comments , also accepts an order parameter, which may be set to ascending or descending and defaults to ascending.", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at", {
                ascending: true
              });
            });
        });
        it("GET:200 /comments, ignores any additional queries or invalid queries,  using the default value instead.", () => {
          return request(app)
            .get(
              "/api/articles/1/comments?order=asdf&sort_by=ghjk&whywouldyou=dothis"
            )
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
      });
    });
    describe("/comments", () => {
      it("PATCH:200 , takes an object containing inc_votes and updates vote count by that amount.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(26);
          });
      });
      it("PATCH:200 , if given a request with no body simply returns the unchanged comment to the user", () => {
        return request(app)
          .patch("/api/comments/1")
          .send()
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(16);
          });
      });
      it("PATCH:404 , throws a 404 when given a valid comment_id which does not exist", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No such comment found");
          });
      });
      it('PATCH:400 , if given a body with key in incorrect format will throw a 400 error "invalid formatting on body of request"', () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ badlabel: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("invalid formatting on body of request");
          });
      });
      it("PATCH:400 , if given a body with non-integer value for votes throws 400", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "Naughty Naughty" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax in request");
          });
      });
      it("DELETE:204 , deletes an object giving no respone other than 204", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE:404 , returns a 404 when no comment with that ID exists.", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Item to be deleted could not be found");
          });
      });
      it("DELETE:400, returns a 400 when given a comment with an invalid ID", () => {
        return request(app)
          .delete("/api/comments/banana")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax in request");
          });
      });
    });
  });
});

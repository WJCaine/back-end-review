process.env.NODE_ENV = 'test'
const chai = require('chai')
const { expect } = require('chai')
const request = require('supertest')
const connection = require('../db/connection')
const app = require('../app.js')
chai.use(require('chai-sorted'))

describe('app', () => {
  after(() => connection.destroy())
  beforeEach(() => {
    return connection.seed.run()
  });
  it('ALL:404 When given any invalid URL returns an error 404 with message "the requested URL was not found on this server"', () => {
    return request(app).get('/BADURL').expect(404).then(({ body }) => {
      expect(body.msg).to.equal("the requested URL was not found on this server")
    })
  })
  describe('/api', () => {
    describe('/topics', () => {
      it('GET 200  : Returns a list of all topics', () => {
        return request(app).get('/api/topics').expect(200).then(({ body }) => {
          expect(body).to.be.an('object')
          expect(body.topics[0]).to.have.keys('slug', 'description')
          expect(body.topics[0]).to.eql({
            description: 'The man, the Mitch, the legend',
            slug: 'mitch',
          })
        })
        // 

      });

    })
    describe('/users', () => {
      describe('/:username', () => {
        it('GET:200 Returns all details about the user specified in parameter', () => {
          return request(app).get('/api/users/icellusedkars').expect(200).then(({ body: { user } }) => {
            expect(user).to.eql({
              username: 'icellusedkars',
              name: 'sam',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
            })

          })
        })
        it('ERROR:404 , throws a 404 error when a username which does not exist is passed ', () => {
          return request(app).get('/api/users/badusername').expect(404).then(({ body }) => {
            expect(body.msg).to.equal('User not found')
          })
        });

      });

    });
    describe('/articles', () => {
      it('GET:200 , returns an array of article objects', () => {
        return request(app).get('/api/articles').expect(200).then(({ body }) => {
          expect(body.articles).to.be.an('array')
          expect(body.articles[0]).to.have.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
        })
      })
      it('GET:200 , accepts a sort_by query , whcih defaults to created_at', () => {
        return request(app).get('/api/articles?sort_by=title').expect(200).then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy('title')
        })
      });
      it('GET:200 if given a sorted_by query for non-existant column, revert to default', () => {
        return request(app).get('/api/articles?sort_by=badColumn').expect(200).then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy('created_at')
        })
      })
      it('GET:200 , ignores any order queries other than asc or desc (defaults to asc)', () => {
        return request(app).get('/api/articles?order=badQuery').expect(200).then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy('created_at')
        })
      })
      it('GET:200 , accepts an order query, defaulting to ascending', () => {
        return request(app).get('/api/articles?order=desc').expect(200).then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy('created_at', { descending: true })
        })
      });
      it('GET:200 , accepts an author query, showing only articles by a given author', () => {
        return request(app).get('/api/articles?author=icellusedkars').expect(200).then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article.author).to.equal('icellusedkars')
          })
        })
      });
      it('GET:200 , accepts an topic query, showing only articles on a given topic', () => {
        return request(app).get('/api/articles?topic=mitch').expect(200).then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article.topic).to.equal('mitch')
          })
        })

      });
      it.only('GET:404 - if a query will return an empty array - throws a 404 "No results matching this query."', () => {
        return request(app).get('/api/articles?author=bigcheesestilton').expect(404).then(({ body }) => {
          expect(body.msg).to.equal("No results matching this query.")
        })
      })
      describe('/:article_id', () => {
        it('GET:200 retrieves an given article using its article id', () => {
          return request(app).get('/api/articles/1').expect(200).then(({ body }) => {
            expect(body).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13,
              votes: 100,
            })
          })

        });
        it('GET:404', () => {

        });
        it('PATCH:201 allows user to update the vote count on a given article', () => {
          return request(app).patch('/api/articles/1').send({ inc_votes: 1 }).expect(201).then(({ body }) => {
            expect(body).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13,
              votes: 101,
            })
          })

        })
        it('POST:201 /comments, takes an object with properties username and body and responds with the posted comment', () => {
          return request(app).post('/api/articles/1/comments').send({ username: 'icellusedkars', body: 'the cheese stands alone' }).expect(201).then(({ body }) => {
            expect(body).to.have.keys('article_id', 'author', 'body', 'comment_id', 'created_at', 'votes')
            expect(body.votes).to.equal(0)
            expect(body.body).to.equal('the cheese stands alone')
            expect(body.article_id).to.equal(1)
          })
        })
        it('GET:200 /comments, given an article id can retrieve all comments assosciated with that article', () => {
          return request(app).get('/api/articles/1/comments').expect(200).then(({ body }) => {
            expect(body.comments).to.be.an('array')
            expect(body.comments[0]).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body')
          })
        })
        it('GET:200 /comments , accepts a sort_by query which allows us to order the comments by a specific key defaulting to created_at', () => {
          return request(app).get('/api/articles/1/comments?sort_by=votes').expect(200).then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy('votes')
          })
        })
        it('GET:200 /comments , also accepts an order parameter, which may be set to ascending or descending and defaults to ascending.', () => {
          return request(app).get('/api/articles/1/comments?order=desc').expect(200).then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy('created_at', { descending: true })

          })

        })

      });

    });
    describe('/comments', () => {
      it('PATCH:201 , takes an object containing inc_votes and updates vote count by that amount.', () => {
        return request(app).patch('/api/comments/1').send({ inc_votes: 10 }).expect(201).then(({ body }) => {
          expect(body.votes).to.equal(26)
        })
      });
      it('DELETE:204 , deletes an object giving no respone other than 204', () => {
        return request(app).delete('/api/comments/1').expect(204)
      })
    });

  });

});
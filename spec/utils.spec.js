process.env.NODE_ENV = "test";
const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("takes an array as an argument and returns an array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("takes a unix time as an input and outputs something in the form psql requires, with created_at property renamed to created_at", () => {
    const singleObjArr = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];

    const expectedDate = new Date(1479818163389);
    expect(formatDates(singleObjArr)[0].created_at).to.eql(expectedDate);
  });
  it("does the same for multi-object arrays", () => {
    const multiObjArr = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1445923595321
      }
    ];
    const expectedDate = new Date(1479818163389);
    const expectedDate2 = new Date(1445923595321);
    expect(formatDates(multiObjArr)[0].created_at).to.eql(expectedDate);
    expect(formatDates(multiObjArr)[1].created_at).to.eql(expectedDate2);
  });
  it("does not mutate the original array", () => {
    const original = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const originalCopy = [...original];
    formatDates(original);
    expect(original).to.eql(originalCopy);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("converts an array of single length phone data in a reference object for that persons phone number", () => {
    const input = [
      { name: "vel", phoneNumber: "01134445566", address: "Northcoders, Leeds" }
    ];
    const actual = makeRefObj(input, "name", "phoneNumber");
    const expected = {
      vel: "01134445566"
    };
    expect(actual).to.eql(expected);
  });
  it("converts an array of any length phone data in a reference object for that persons phone number", () => {
    const input = [
      {
        name: "vel",
        phoneNumber: "01134445566",
        address: "Northcoders, Leeds"
      },
      {
        name: "ant",
        phoneNumber: "01612223344",
        address: "Northcoders, Manchester"
      },
      { name: "mitch", phoneNumber: "07777777777", address: null }
    ];
    const actual = makeRefObj(input, "name", "phoneNumber");
    const expected = {
      vel: "01134445566",
      ant: "01612223344",
      mitch: "07777777777"
    };
    expect(actual).to.eql(expected);
  });
  it("Accepts two additional arguments which can be used to alter the key-value pair being created", () => {
    const input = [
      {
        name: "vel",
        phoneNumber: "01134445566",
        address: "Northcoders, Leeds"
      },
      {
        name: "ant",
        phoneNumber: "01612223344",
        address: "Northcoders, Manchester"
      },
      { name: "mitch", phoneNumber: "07777777777", address: null }
    ];
    const actual = makeRefObj(input, "phone number", "address");
  });
  const expected = {
    01134445566: "Northcoders",
    01612223344: "Northcoders",
    07777777777: null
  };
  const songs = [
    {
      track: "11:11",
      artist: "Dinosaur Pile-Up",
      releaseYear: 2015,
      album: "Eleven Eleven"
    },
    {
      track: "Powder Blue",
      artist: "Elbow",
      releaseYear: 2001,
      album: "Asleep In The Back"
    }
  ];
  actual2 = makeRefObj(songs, "track", "artist");
  expected2 = {
    "11:11": "Dinosaur Pile-Up",
    "Powder Blue": "Elbow"
  };
  expect(actual2).to.eql(expected2);
});

describe("formatComments", () => {
  it("Recieves an array of objects as first argument and reference object as second arguments and outputs an array", () => {
    expect(formatComments([], {})).to.eql([]);
  });
  it("Takes a single object in an array and a reference object and formats the object in the array correctly.", () => {
    const singleComment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const desiredDate = new Date(1511354163389);
    const singleReference = { "They're not exactly dogs, are they?": 12 };
    expect(formatComments(singleComment, singleReference)).to.eql([
      {
        author: "butter_bridge",
        article_id: 12,
        created_at: desiredDate,
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16
      }
    ]);
  });
  it("does the same for an array containing multiple objects.", () => {
    const multiObjArr = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "something else",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const multiRefObj = {
      "Living in the shadow of a great man": 1,
      "something else": 2
    };
    const expected = [
      {
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1479818163389),
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14
      },
      {
        author: "icellusedkars",
        article_id: 2,
        created_at: new Date(1448282163389),
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100
      }
    ];
    expect(formatComments(multiObjArr, multiRefObj)).to.eql(expected);
  });
  it("does not mutate the original array", () => {
    const multiObjArr = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "something else",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const multiObjArrCopy = [...multiObjArr];
    const multiRefObj = {
      "Living in the shadow of a great man": 1,
      "something else": 2
    };
    formatComments(multiObjArr, multiRefObj);
    expect(multiObjArr).to.eql(multiObjArrCopy);
  });
});

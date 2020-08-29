## Introduction

This project contains an API server to retrieve viral posts from instagram users

## Command line usage

This project can also be used as a command line tool, i.e. run a command to retrieve data from instagram
See [`commands/scrape`](src/commands/scrape/README.md)

## API features

1. Retrieve viral posts from a user profile: `GET /media/user/:username`

- 1. If instagram blocks(temporarily?) our IP because we sent too many requests in a short period of time,authenticate user and proceed

1. **TODO** Retrieve posts from a post URL `GET /media/post/:posturl`

- If page is private, skip
- If page has fewer than a certain number of posts, skip.
- Number of likes is used as the metric for extracting viral posts. Optionally, comments can be used also.

**Configurable**

- `NUM_TO_SCRAPE`: Number of posts to scrape
- `NUM_TO_CALC_AVERAGE_ENGAGEMENT`: Number to posts to use for calculating the median engagement rate of a user
- `VIRAL_THRESHOLD`: The fraction of engagement that must be greater than the median engagement in order for a post to be considered as viral. e.g. `0.5 = (1 + 0.5) * average_engagement`
- `MIN_FOLLOWER`: _TBD_
- `MIN_POSTS`: _TBD_

## Prerequisites

1. Install [git](https://git-scm.com/downloads)
1. Install [nodejs](https://nodejs.org/en/download/)
1. Install [MySQL](https://www.mysql.com/)

### Environment variables

- `NODE_ENV`: 'development' or 'test' or 'production'
- `DB_NAME`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `INSTAGRAM_USER`
- `INSTAGRAM_PASSWORD`

## Usage

- Clone project: `git clone https://github.com/hanchiang/instagram-node-api.git`
- Install dependencies: `npm install`
- Start server: `npm run debug`
- Visit server at `localhost:3000`

## Response

**1. `/media/user/:username`**

```javascript
{
  payload: {
    id: "259220806",
    username: "9gag",
    fullname: "9GAG: Go Fun The World",
    numPosts: 24040,
    numFollowers: 53961371,
    numFollowing: 29,
    isPrivate: false,
    isVerified: true,
    profilePicUrl: "https://instagram.fsin9-1.fna.fbcdn.net/v/t51.2885-19/s150x150/18645376_238828349933616_4925847981183205376_a.jpg?_nc_ht=instagram.fsin9-1.fna.fbcdn.net&_nc_ohc=KlAJ_-uOHigAX9hExv2&oh=2b7f81bb509f4ffa69e3c0ea5b21d718&oe=5F6A4D82",
    isBusinessAccount: true,
    businessCategory: "Content & Apps",
    businessEmail: "9gag@9gag.com",
    csrfToken: "ZwCuuPOE4JvYQtodHS0IAxSLvyTHHozb",
    countryCode: "SG",
    languageCode: "en",
    locale: "en_US",
    averageLikes: 404667,
    averageComments: 4926.65,
    viralPosts: [
      {
        id: "2379768819261354837",
        userId: "259220806",
        isVideo: false,
        numComments: 10633,
        numLikes: 1006023,
        url: "https://www.instagram.com/p/CEGoyHvn7NV",
        mediaSource: "https://instagram.fsin9-1.fna.fbcdn.net/v/t51.2885-15/e15/118199425_121839406033441_1276973825853807065_n.jpg?_nc_ht=instagram.fsin9-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=rru33FOXNOkAX9f5eE7&oh=7b18d125b1ca084a5fe5648912b0d69f&oe=5F68D8E0",
        captions: [
          {
            node: {
              text: "Floofy ewok 📸 @kokoro_official - #fluff #toypoodle #9gag"
            }
          }
        ],
        commentsDisabled: false,
        takenAt: 1597910571,
        dimension: {
          height: 640,
          width: 640
        },
        location: null
      }
    ]
  }
}
```

## Notes

- permission error when installing packages as `node`
- Due to instagram's API limitation, media can only be fetched in small batches, therefore fetching a large amount of posts(e.g. 500) takes about 20 seconds
  - Storing posts in the database is not a good idea due to the maintenance overhead of keeping them up to date(criteria for viral posts can be changed, posts can be removed by user, engagement on posts can keep changing).

## Troubleshooting docker

**npm install**

- If `package-lock.json` is created as a directory instead of a file, npm throws `EISDIR: illegal operation on a directory, read`. So remove it, run `npm install` in container and verify that `package-lock.json` is correctly created as a file

## TODO

- [x] Migrate PostgreSQL to MySQL
- [x] Migrate to Typescript
- [x] Proper error handling
- [x] Eliminate code duplication by adapting CLI code from `commands/scrape` to use code from `lib/insta.ts`
- [x] Improve code organisation
- [x] Add support for authentication. This is trigggered when instagram detects too many request coming from an unauthenticated user
  - [] Improve/fix authentication
  - [] Use proxies, rotate user agent
- [ ] Add support for posts with multiple photo/video
- [ ] Add support to retrieve media from post URL, i.e. `instagram.com/p/<shortcode>`
- [ ] Add more tests
- [ ] Add types for posts and other data
- [ ] API documentation
- [ ] Save posts to database?
- [ ] Feature flag to toggle saving user and posts to database
- [ ] Get followers list
  - [ ] display list of followers with more following than followers
  - [ ] display list of followers who are inactive
  - [ ] provide an option to unfollow

## References

- [good node docker defaults - Bret fisher](https://github.com/BretFisher/node-docker-good-defaults) from docker guru Bret Fisher
- [node docker setup - Digital ocean](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)
- [Instagram developer changelog](https://www.instagram.com/developer/changelog/)

## Feedback

Please leave your feedback by opening a new [issue](https://github.com/hanchiang/instagram-node-api/issues)

## Disclaimer

This is not affliated, endorsed or certified by Instagram. This is an independent and unofficial API. Strictly not for spam. Exercise discretion and use at your own risk.

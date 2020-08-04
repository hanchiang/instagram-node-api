## Features

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

- `DB_NAME`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `NODE_ENV`: 'development' or 'test' or 'production'

## Usage

- Install dependencies: `npm install`
- Start server: `npm run dev`
- Visit server at `localhost:3000`

## Command line usage

See [`commands/scrape`](commands/scrape/README.md)

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
- [ x ] Proper error handling
- [ ] Improve code organisation
- [ ] Add more tests
- [ ] Eliminate code duplication by adapting model in `commands/scrape/model.ts` to `insta.ts`
- [ ] Update posts output format to become more human readable
- [ ] Standardise data retrieved in `ontext()`
- [ ] Add types for posts and other data
- [ ] Save posts to database?
- [ ] Feature flag to toggle saving user and posts to database
- [ ] Get followers list
  - [ ] display list of followers with more following than followers
  - [ ] display list of followers who are inactive
  - [ ] provide an option to unfollow

## References

- [good node docker defaults - Bret fisher](https://github.com/BretFisher/node-docker-good-defaults) from docker guru Bret Fisher
- [node docker setup - Digital ocean](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)
- [Kubernetes nginx ingress](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes)
- [Instagram developer changelog](https://www.instagram.com/developer/changelog/)

## Feedback

Please leave your feedback by opening a new [issue](https://github.com/hanchiang/instagram-node-api/issues)

## Disclaimer

This is not affliated, endorsed or certified by Instagram. This is an independent and unofficial API. Strictly not for spam. Exercise discretion and use at your own risk.

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

## Usage

- Install packages: `npm install`
- Start server: `npm run dev`

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

- [ ] Migrate to Typescript
- [ ] Migrate PostgreSQL to MySQL
- [ ] Improve code organisation
- [ ] Feature flag to toggle saving user and posts to database
  - [ ] Eliminate code duplication by adapting model in `commands/scrape/model.js` to `insta.js`
- [ ] Get followers list
  - [ ] display list of followers with more following than followers
  - [ ] display list of followers who are inactive
  - [ ] provide an option to unfollow

## References

- [good node docker defaults - Bret fisher](https://github.com/BretFisher/node-docker-good-defaults) from docker guru Bret Fisher
- [node docker setup - Digital ocean](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)
- [Kubernetes nginx ingress](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes)
- [Instagram developer changelog](https://www.instagram.com/developer/changelog/)

## Disclaimer

This is not affliated, endorsed or certified by Instagram. This is an independent and unofficial API. Strictly not for spam. Exercise discretion and use at your own risk.

## Usage
1. Put usernames in `server/input/input.txt`, one username per line. Create `input.txt` if it doesn't exist.
2. Make sure [nodejs](https://nodejs.org/en/download/) is installed
3. Install project dependencies: `npm install`
4. Run `node server/index.js`
5. See the output in `server/output`. Each username has its own folder, with file name is the following format: `{numFollowers}-{averageLikes}-{averageComments}-(YYYYMMDD-HHmmss)`

## Features
* If page is private, skip
* If page has fewer than a certain number of posts, skip.
* Use number of likes as the metric for extracting viral posts. Optionally, comments can be used also.

**Configurable**  
* `NUM_TO_SCRAPE`: Number of posts to scrape
* `NUM_TO_CALC_AVERAGE_ENGAGEMENT`: Number to posts to use for calculating the median engagement rate of a user
* `VIRAL_THRESHOLD`: The fraction of engagement that must be greater than the median engagement in order for a post to be considered as viral. e.g. `0.5 = (1 + 0.5) * median_engagement`
* `MIN_FOLLOWER`: *TBD*
* `MIN_POSTS`: *TBD*

## Notes
* permission error when installing packages as `node`
* If encounter error: password authentication failed for user "postgres", remove the data volume on host, run `docker-compose down` and `docker-compose up`. 

## Troubleshooting docker
**npm install**
* If `package-lock.json` is created as a directory instead of a file, npm throws `EISDIR: illegal operation on a directory, read`. So remove it, run `npm install` in container and verify that `package-lock.json` is correctly created as a file

**bind mounting postgres volume**
* `PermissionError: [Errno 13] Permission denied:` is thrown when `docker-compose build` is run. So run `sudo chown -R $USER /path/to/data` to set the correct permissions

## TODO
* tests

## Acknowledgement
* [good node docker defaults](https://github.com/BretFisher/node-docker-good-defaults) from docker guru Bret Fisher
* [node docker digital ocean](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)
* [Postgres health check](https://github.com/peter-evans/docker-compose-healthcheck)
## Features
* If page is private, skip
* If page has fewer than a certain number of posts, skip.
* Number of likes is used as the metric for extracting viral posts. Optionally, comments can be used also.

**Configurable**  
* `NUM_TO_SCRAPE`: Number of posts to scrape
* `NUM_TO_CALC_AVERAGE_ENGAGEMENT`: Number to posts to use for calculating the median engagement rate of a user
* `VIRAL_THRESHOLD`: The fraction of engagement that must be greater than the median engagement in order for a post to be considered as viral. e.g. `0.5 = (1 + 0.5) * average_engagement`
* `MIN_FOLLOWER`: *TBD*
* `MIN_POSTS`: *TBD*

## Notes
* permission error when installing packages as `node`
* Due to instagram's API limitation, media can only be fetched in small batches, therefore fetching a large amount of posts(e.g. 500) takes about 20 seconds
  * Storing posts in the database is not a good idea due to the maintenance overhead of keeping them up to date(criteria for viral posts can be changed, posts can be removed by user, engagement on posts can keep changing).

## Troubleshooting docker
**npm install**
* If `package-lock.json` is created as a directory instead of a file, npm throws `EISDIR: illegal operation on a directory, read`. So remove it, run `npm install` in container and verify that `package-lock.json` is correctly created as a file

**bind mounting postgres volume**
* `PermissionError: [Errno 13] Permission denied:` is thrown when `docker-compose build` is run. So run `sudo chown -R $USER /path/to/data` to set the correct permissions

**postgres authentication error**
* If encounter error: password authentication failed for user "postgres", remove the data volume on host, run `docker-compose down` and `docker-compose up`. 

## TODO

## References
* [good node docker defaults - Bret fisher](https://github.com/BretFisher/node-docker-good-defaults) from docker guru Bret Fisher
* [node docker setup - Digital ocean](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)
* [Postgres health check - Peter evans](https://github.com/peter-evans/docker-compose-healthcheck)
* [Insert multiple rows with node-postgres](https://github.com/brianc/node-postgres/issues/957)
## Prerequisites

1. Install [git](https://git-scm.com/downloads)
1. Install [nodejs](https://nodejs.org/en/download/)

## Usage

1. Clone project: `git clone https://github.com/hanchiang/instagram-node-api.git`
1. Install project dependencies: `npm install`
1. Store the list of usernames you want to scrape in `input/input.txt`, one username per line.
1. Start scraping: `npm run build && node dist/commands/scrape/index.js`
1. See the output in `dist/commands/scrape/output/`. Each user has their name as the folder name, with file name in the following format: `{numFollowers}-{averageLikes}-{averageComments}-(YYYYMMDD-HHmmss)`
1. Sample data can be found in `dist/commands/scrape/sample/`

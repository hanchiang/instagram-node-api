## Usage

1. Store the list of usernames you want to scrape in `input/input.txt`, one username per line.

1. Install project dependencies: `npm install`
1. Start scraping: `npm run build && node dist/commands/scrape/index.js`
1. See the output in `dist/commands/scrape/output/`. Each user has their name as the folder name, with file name in the following format: `{numFollowers}-{averageLikes}-{averageComments}-(YYYYMMDD-HHmmss)`

## Usage

1. Clone the repository: `git clone https://github.com/hanchiang/instagram-content-finder.git`.
1. Store the list of usernames you want to scrape in `input/input.txt`, one username per line.

1. Install project dependencies: `npm install`
1. Run `node index.js`
1. See the output in `output`. Each user has their name as the folder name, with file name in the following format: `{numFollowers}-{averageLikes}-{averageComments}-(YYYYMMDD-HHmmss)`

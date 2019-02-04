## postgresql_test folder
This folder is mounted as a volume to the postgres container for testing purpose

### Data folder
The `data` folder contains the actual postgres data

### Other files
Files such as `init-test-db.sql` are run once when the postgres container is initialised.  
They can be used to create tables, users, etc.
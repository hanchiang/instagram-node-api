## API
* Retrieve a list of media of a profile: `/media/user/{username}`
  * Query instagram's graphql endpoint. Data is not stored in database

## Database
* postgres

### Data stored
**user data**
* id
* username
* fullname
* numPosts
* numFollowers
* numFollowing
* isPrivate
* isVerified
* profilePicUrl
* isBusinessAccount
* businessCategoryName
* businessEmail
* businessPhoneNumber
* businessAddressJson
* averageLikes
* averageComments


**shared data**
* csrfToken
* rhxGis
* locale
* countryCode
* languageCode


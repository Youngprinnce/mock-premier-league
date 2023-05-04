# Mock-Premier-League

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Server side hosted on Heroku
https://mock-premier-league-gom.herokuapp.com/


## POSTMAN API Documentation
https://documenter.getpostman.com/view/17896528/2s93eVYEAV

## Table of Content
 * [Getting Started](#getting-started)

*  [Prerequisites for installation](#prerequisites-for-installation)
 
 * [Installation](#installation)

 * [Test](#test)
 
 * [API End Points Test Using Postman](#api-end-points-test-using-postman)
 
 * [Features](#features)
 
 * [Built With](#built-with)

 * [NB](#nb)


## Getting Started

### Tools/Stacks
1. Node js
2. Express
3. TypeScript
4. MongoDB
5. Docker
6. Redis
7. Postman
8. Mocha


### Setting up
1. Clone this repository into your local machine:
```
e.g git clone https://github.com/Youngprinnce/mock-premier-league
```

2. cd into the folder
```
e.g cd mock-premier-league
```

3. Rename `.env.example` to `.env` file and fill in the DB_DEV, DB_TEST mongo uri and REDISCLOUD_URL.
```
e.g change .env.example to .env & fill details
```

4. Install dependencies
```
e.g npm install
```

5. Start the application by running the start script.
```
e.g npm start
```

6. Install postman to test all endpoints on port 3000.

7. Rate Limiting has been set up to manage requests made to the user access APIs. Default is 100 hits in 5 minutes window

8. Web caching using redis is also been setup

### Test
run test using ```npm test```.
## Features
 ### Admin
 * Admin can signup/login
 * Admin can manage teams (add, remove, edit, view) 
 * Admin can create fixtures (add, remove, edit, view)
 * Admin can Generate unique links for fixture 

 ### Users
 * A user can signup/login
 * A user can view teams
 * A user can view completed fixtures
 * A user can view pending fixtures
 * A user can robustly search fixtures/teams
 
 * Only the search API should be availble to the public.

### How to setup project on your local machine (Step 2) via docker
#### Pre-requisite
- [Docker](https://www.docker.com/)
- env variable for DB_DEV and REDISCLOUD_URL should be from the cloud

#### building
- Download the docker image
- Run `docker build -t premier-league .`

#### Run the app
- Run `docker compose up -d`

 ### NB
 To login to any of the user or admin account, the same password (Password1!) is used to create user and admin account used to seed the database
 To ensure smooth installation of the repository, it is advisable to use CLOUD URLs for the DATABASE AND REDIS CONNECTION

## License
This project is licensed under the MIT license - see the LICENSE.md file for details.
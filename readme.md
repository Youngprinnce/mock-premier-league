# Mock-Premier-League

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Server side hosted on Heroku


## API Documentation


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
e.g git clone https://github.com/youngprinnce/mock-premier-league-gom
```
2. cd into the folder
```
e.g cd mock-premier-league
```

3. Create `.env` file and fill out the required information 
```
e.g change .env.example to .env & fill details
```
4. Install dependencies

```
e.g npm install
```
5. Start the application by running the dev script.

```
e.g npm run dev
```

6. Install postman to test all endpoints on port 5000.

7. Run `docker-compose up`

8. Rate Limiting has been set up to manage requests made to the user access APIs. Default is 100 hits in 5 minutes window

9. Web caching using redis is also been setup

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
 * A user can sview teams
 * A user can view completed fixtures
 * A user can view pending fixtures
 * A user can robustly search fixtures/teams
 
 * Only the search API should be availble to the public.

 ### NB
 To login to any of the account, the same password (Password1!) is used to create user and admin account used to seed the database

## License
This project is licensed under the MIT license - see the LICENSE.md file for details.
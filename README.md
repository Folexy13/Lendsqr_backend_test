# Lendsqr Backend Test

## Introduction

This project is built with Mysql, Knex Orm,NodeJs Language and Typescript. Integrated into it is Paystack payment gateway

## Prerequisites

- Node.Js
- MySQL database server
- Paystack API key
- Knex ORM

## Download and Installations

- To Download Mysql database server go to [Mysql download](https://dev.mysql.com/downloads/)

- To Download Nodejs. go to [Node.js Official Website](https://nodejs.org/en/)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file or just edit the .env.example file. `Note:` That `PAYSTACK_BASE_URL` variable is already declared in the .env.example file for look up and also the `PAYSTACK_SECRET_KEY` is the test key and no real transaction is made.

`TOKEN_SECRET`

`DB_USER`

`DB_PORT`

`DB_PASS`

`DB_NAME`

`PAYSTACK_SECRET_KEY`

`DB_HOST`

## Run Locally

Clone the project

```bash
  git clone https://github.com/Folexy13/Lendsqr_backend_test.git
```

Install dependencies

```bash
  yarn  or npm install
```

Start the server

```bash
  yarn start
```

## Running Tests

To run tests, run the following command

```bash
  yarn test
```

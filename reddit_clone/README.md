# Reddit Clone

## Tech Used

- React
- Typescript
- GraphQL
- URQL/Apollo
- Node.js
- PostgresSQL
- TypeORM
- Redis
- Next.js
- TypeGraphQL

## Steps

### Database Setup

- Create The Scrips for execution and compilation of code

- Install Micro Orm Version 4 and its dependencies

```sh
yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg
```

- created database "redis_clone"

- connecting to postgres sql with mikro orm in src/index.ts

- and doing migrations with mikro-orm cli by setting it up

### Server Setup

- install below packages and also types for it

```sh
yarn add express apollo-server-express graphql type-graphql
```

- integrate express with apollo-server-express and make resolvers and mutations using type-graphql

- mikro-orm basic crud with type-graphql setup

## Registration

- Creating User entity and resolvers and making migrations

- Session to store cookies for authentication and storing it in redis

```sh
yarn add redis connect-redis express-session
```

- Also Install Types if required

## Front End Setup

```sh
yarn create next-app --example with-chakra-ui with-chakra-ui-app
```

- setting up urql and basic form with formik

- creating a register page

- Installing Graphql Code Generator for automatically creating types based on query for typescript

## Server Side Rendering Setup

```sh
yarn add next-urql react-is isomorphic-unfetch
```

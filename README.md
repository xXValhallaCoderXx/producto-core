## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Info

### Controllers

- Handle Requests / Responses
- Closely work with DTO
  - A DTO is an object that defines how the data will be sent over the network.
  - Use classes as TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime

# GitHub scanner

## Preparation
node 20.13.1
yarn 1.22.22

```bash
yarn install
```

## To run server

```bash
yarn start
```

## To test API

1. Run server
2. Go to https://studio.apollographql.com/sandbox/explorer
3. At top left corner put http://localhost:4000 address
4. Pass github token into headers as 'authorization' field
5. Execute queries

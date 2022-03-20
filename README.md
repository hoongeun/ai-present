# AI Present

This is a 2022 birthday gift for friend who live in across the sea.

## Preview & Demo

![preview](/docs/img/preview.gif)

[DEMO](http://hoongeun.com/)

## Dev

```bash
yarn
yarn start
```

## Prod(deploy to infra)

```bash
## build
yarn
yarn start
##

## setup infra
cd ./terraform
# Change s3 bucket name and domain in providers.tf and terraform.tfvars
terraform init
terraform apply # After applying the infra you may recieved from aws to check the domains

## deploy
## Change s3 bucket name of package.json
yarn deploy
```

## Stack

* CRA(create-react-app)
* typescript
* babylon.js

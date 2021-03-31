---
title: Development environment
---

## Prerequisites

You need docker, docker-compose. Additionally, for a better experience working on the front-end, node 12+ can be useful as well.

### 1. Clone the repository
```bash
git clone https://github.com/CitizenLabDotCo/citizenlab
```

### 2. Copy the provided example .env files

```bash
cp .env-front.example .env-front
cp .env-back.example .env-back
```
Make modifications if required.

### 3a. Build and launch

```bash
docker-compose build
docker-compose run web rake db:create
docker-compose run web rake db:reset
docker-compose up
```

### 3b. Alternative: Run the front-end locally
The previous command will run all application components in Docker, including front-end. If you want to actively develop on Mac or Windows, that can be a bit slow. 

If you rather run front locally on your machine instead of in Docker, use these commands instead.

```bash
docker-compose build
docker-compose run web rake db:create
docker-compose run web rake db:reset
docker-compose run --service-ports web
cd front
npm i
npm start
```
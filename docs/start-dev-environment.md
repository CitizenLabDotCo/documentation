---
title: Development environment
---

## Prerequisites

You need docker, docker-compose, and node 12+.

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

### 3. Build and launch

```bash
docker-compose build
docker-compose run web rake db:create
docker-compose run web rake db:reset
docker-compose up
cd front
npm i
npm start
```

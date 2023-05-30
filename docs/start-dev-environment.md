---
title: Development environment
---

Would you like to contribute a change? Or do you want to test out the platform locally, on your machine? We'll help you get started.

First, it's important that there are 2 versions of our product: An open-source and a commercial version. You're likely most interested in making changes to the open-source version, so that's what is covered by this guide.

If you would like to contribute to our commercial version instead, the instructions are roughly the same, using our [main citizenlab repository](https://github.com/CitizenLabDotCo/citizenlab) instead.
# January 2023 setup change

In January 2023, we changed our repository structure. Before, we had one repository (called `citizenlab`) which contained both our open-source code and our proprietary commercial code.

We decided to change the setup: We now have a dedicated open-source repository (`citizenlab-oss`), which is a fork of our main codebase (`citizenlab`), but only containing the 100% open-source code, fully licensed under AGPLv3.

If you worked on CitizenLab before January 2023, it's a good idea to clone the new citizenlab-oss repository and not to continue on your earlier clone.
# Prerequisites

You need docker, docker-compose, and node 14+.

# 1. Clone the repository
```bash
git clone https://github.com/CitizenLabDotCo/citizenlab-oss
```

# 2. Copy the provided example .env files

```bash
cp env_files/back-secret.example.env env_files/back-secret.env
cp env_files/front-secret.example.env env_files/front-secret.env
```
While most of the platform will work without making changes, you might need to add some configuration for 3rd party services in the `*-secret.env` files.

# 3. Build and launch

Go to the root of the repository and start the back-end and services
```bash
docker-compose build
docker-compose run web rake db:create
docker-compose run web rake db:reset
docker-compose up
```
Note: some users may need to prepend `bundle exec` to the web container `rake` commands (e.g. `docker-compose run web bundle exec rake db:create`)

Open a new terminal and start the front-end with :
```bash
cd front
npm i
npm start
```

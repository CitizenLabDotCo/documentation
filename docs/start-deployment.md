---
title: Deployment
---

## Introduction

This guide will help you with all you need to set-up and deploy CitizenLab.

## 1. Set-up a VPS

[Digital Ocean](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

## 2. Install docker

[Official docs](https://docs.docker.com/engine/install/ubuntu/)

[Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)

```
$ sudo apt-get update

$ sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

$ echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

$ sudo apt-get update

$ sudo apt-get install -y docker-ce docker-ce-cli containerd.io

$ docker --version
```

## 3. Install docker-compose

[Official docs](https://docs.docker.com/compose/install/)

[Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)

```
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.28.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose

$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
```

## 4. Clone the repository and set it up

```
$ sudo apt-get install -y git

$ git clone https://github.com/CitizenLabDotCo/citizenlab-docker.git

$ cd citizenlab-docker

$ sh install.sh

# this step may take a while since it will download all images needed to run the project
$ docker-compose run --rm web rake db:create db:schema:load
```

## 5. Run it! :rocket:

```
$ docker-compose up --detach
```

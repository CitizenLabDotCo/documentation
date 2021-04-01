---
title: Deployment
---

## Introduction

This guide will help you with all you need to set-up and deploy CitizenLab. While having some experience with the command line and configuring servers will come in handy, but we'll try to guide you through it.

## 1. Set-up a VPS

This guide was written for Ubuntu 20.04, a Digital Ocean tutorial to set it up can be found [here](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04).

If you decide to run your database on the same server, as this guide assumes, we recommend a server with at least 4GB of RAM memory.

## 2. Install docker

[Official docs](https://docs.docker.com/engine/install/ubuntu/)

[Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)

```bash
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

$ sudo usermod -aG docker ${USER}

$ docker --version
```

:::caution
To apply the new group membership, log out of the server and back in, otherwise docker may not work properly.
:::

## 3. Install docker-compose

[Official docs](https://docs.docker.com/compose/install/)

[Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)

```bash
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.28.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose

$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

$ docker-compose --version
```

## 4. Clone the repository

We've provided a [Github repository](https://github.com/CitizenLabDotCo/citizenlab-docker) with a minimal premade configuration to run the platform on a single server.

```bash
$ sudo apt-get install -y git

$ git clone https://github.com/CitizenLabDotCo/citizenlab-docker.git

$ cd citizenlab-docker
```

## 5. Provide configuration values

Before we can launch the application, we need to provide configuration values. You can choose some of these values yourself, but for some you will need to create external accounts. All configuration values need to be provided in the `.env` file.

:::note
You can edit the `.env` file straight on the server using a command line text editor. Nano is a good, easy to user one. Type `nano .env` to open it.
:::

### Secrets

In order to provide the application with strong internal passwords for the database and user authentication, we have provided a script that generates them for you.

```bash
$ sh install.sh
```
### Admin user

Provide the initial email, password, first and last name of the admin user. You can only set them here initially, once the application has started this no longer has an effect.

```bash
# ***** USER  *****

INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=a_really_strong_password_unlike_this_one
INITIAL_ADMIN_FIRST_NAME=First
INITIAL_ADMIN_LAST_NAME=Last
```

### Domain name and DNS

`CL_SETTINGS_HOST=` controls the domain name of your platform. To start off, you could just set it to the external IP address of your server and access it like that.

To configure the proper domain name, you should change the setting and configure your DNS hosting provider to direct traffic towards the server. The docker-compose setup provides auto-provisioning https, by using Caddy as the webserver, so the connection will always be secure. Adding the A and AAAA DNS records for your domain name, towards your server, is enough to make it work.

```bash
# The address of the platform, without https://
CL_SETTINGS_HOST=mywebsite.com # this could also be your external IP
```

### Timezone

Set the timezone for your application, a list of valid timezones can be found here.

```bash
CL_SETTINGS_CORE_TIMEZONE=Brussels
```

### Email

The platform sends out email notification and has an email engine to send manual campaigns to user groups. For this to work, you need to provide the smtp server information.

Here's an example for gmail, but any provider that supports SMTP works.
```bash
# Delete the `#` in front of the keys to uncomment them, and fill in the appropriate values
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
# SMTP_DOMAIN=
SMTP_USER_NAME=my_gmail_username@gmail.com # this could also be someone@my_gmail_hosted_email.com
SMTP_PASSWORD=my_gmail_password
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
# SMTP_OPENSSL_VERIFY_MODE=
```

:::caution
Your username and password will be in plain-text on the `.env` file, please consider creating a dedicated account solely for the purpose of sending out emails from the platform.
:::

Alternatively, Mailgun is also supported, in which case you'll need to provide the API key and the domain.

```bash
# Delete the `#` in front of the keys to uncomment them, and fill in the appropriate values
MAILGUN_API_KEY=my_mailgun_api_key
MAILGUN_DOMAIN=mydomain.com
# Optional, defaults to api.mailgun.net
# MAILGUN_API_HOST=
```

### Maps

The CitizenLab platform displays maps in various places. The configuration allows you to specify the map center, expressed in latitude and longitude, and the map zoom level.

You can also provide the tile provider, which defaults to open streetmap.

Finally, in case you want to let people position their inputs on a map, you'll also need to provide a google maps API key.

```bash
# Delete the `#` in front of the key to uncomment it, and fill in the appropriate value
GOOGLE_MAPS_API_KEY=my_google_maps_api_key
```

### Other

The `.env` file contains some additional variables to set up social logins, or integrate some extra services. Over time, more values will be added.

## 6. Pull images

This step may take a while since it will download all images needed to run the project.

[Official docs](https://docs.docker.com/compose/reference/pull/)
```bash
$ docker-compose pull
```

## 7. Initialize the database

Almost ready for action. When all configuration is provided, we're ready to setup the database.

```bash
$ docker-compose run --rm web rake db:create db:migrate db:seed
```
If you get errors, it's likely that you didn't provide all configuration values in step 5.

## 8. Run it! :rocket:

[Official docs](https://docs.docker.com/compose/reference/up/)
```bash
$ docker-compose up -d
```
It can take a few minutes before the platform starts to respond.

### Stopping

[Official docs](https://docs.docker.com/compose/reference/stop/)
```bash
$ docker-compose stop
```

### Checking the logs

[Official docs](https://docs.docker.com/compose/reference/logs/)
```bash
$ docker-compose logs
```

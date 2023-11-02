# Remote Falcon

- [What Is Remote Falcon?](#what-is-remote-falcon)
- [What is this repository for?](#what-is-this-repository-for)
- [Cloning the respository](#cloning-the-repository)
- [How do I run it?](#how-do-i-run-it)
- [I Need Help!](#i-need-help)
- [Easiest To Run, Most Difficult To Test](#easiest-to-run-most-difficult-to-test)
- [Most Difficult to Run, Easiest to Test](#most-difficult-to-run-easiest-to-test)

### What Is Remote Falcon?
<a href="https://remotefalcon.com" target="_blank">Remote Falcon</a> is a free web application that integrates with both <a href="ttps://github.com/FalconChristmas/fppFalcon" target="_blank">Falcon Player</a> and xSchedule (from <a href="https://github.com/smeighan/xLights" target="_blank">xLights</a>) to allow viewers to interact with your light show. Via a highly customizable Viewer Page, your visitor can request or vote on songs to be played on your display.

### What is this repository for?
This repository, which was created to act as a monorepo, contains everything needed to run Remote Falcon. For more info on running it locally, check out the [How do I run it?](#how-do-i-run-it) section.

### Cloning the repository
Before you can do anything it's pretty important to get the code. You'll need to use Git to clone <a href="https://github.com/whitesoup12/remote-falcon" target="_blank">this respository</a>. When cloning, I recommend cloning to a path that has no spaces. It's not required, but sometimes spaces in development file paths can cause headaches.

### How do I run it?
Well, there are actually 2 ways to run it locally.

You can choose either the [Easiest To Run, Most Difficult To Test](#easiest-to-run-most-difficult-to-test) or the [Most Difficult to Run, Easiest to Test](#most-difficult-to-run-easiest-to-test).

### I Need Help!
The best way to get quick help is by joining the <a href="https://discord.gg/BGu79unNgk" target="_blank">Remote Falcon Discord Server</a> and posting in the #development channel.

### Easiest To Run, Most Difficult To Test
The easiest to run method makes it super simple to get running, but makes development kind of a pain. Because this methos uses Docker Compose, each change requires you to restart all docker images. Whereas the [Most Difficult to Run, Easiest to Test](#most-difficult-to-run-easiest-to-test) only requires you to restart the API alone if changes are made there (changes made to Web actually hot reload since it's ReactJS). Side note... if your local container gets wiped, you loose all your data. So this option might only be good if you're wanting to spin up RF locally quikcly without doing any development work or testing.

Before using this method, you will need <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Docker Desktop</a>. You can install Docker and Docker Composre standalone, but it's just so much easier to get the app. Once installed and running, you will need to create a file in the root directory of the monorepo (remote-falcon) called `docker-compose.yaml`. Once the file is created, just copy the contents below into it:

```
version : '3'
services:
  mysql:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - "./remote-falcon-sql/remotefalcon.sql:/docker-entrypoint-initdb.d/1.sql"
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
  api:
    build: ./remote-falcon-api
    ports:
      - "8080:8080"
      - "8000:8000"
    environment:
      - BASE_URL=http://localhost:8080
      - BASE_APP_URL=http://localhost:3000
      - MAIL_FROM=fake@email.com
      - SENDGRID_KEY=
      - JWT_SIGN_KEY=1234567890
      - JWT_VIEWER_SIGN_KEY=1234567890
      - GITHUB_PAT=
      - DATABASE_URL=mysql://root:root@host.docker.internal:3306/remotefalcon
    depends_on:
      mysql:
        condition: service_healthy
  web:
    build: ./remote-falcon-web
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_HOST_ENV=local
      - REACT_APP_BASE_API_PATH=http://host.docker.internal:8080
      - REACT_APP_DATADOG_CLIENT_TOKEN=
      - REACT_APP_MIXPANEL_API_KEY=
      - REACT_APP_JWT_VIEWER_SIGN_KEY=1234567890
    depends_on:
      mysql:
        condition: service_healthy
```

Not going to go into details on each piece of this, so just consider it magic if you don't know what docker compose does.

For details on the enviornment variables for the API and Web app, be sure to check out the <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-api#readme" target="_blank">Remote Falcon API</a> and <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-web#readme" target="_blank">Remote Falcon Web</a> READMEs. Note the main different is on the DATABASE_URL and REACT_APP_BASE_API_PATH. They use `host.docker.internal` instead of `localhost` since we're communicating with docker containers.

Once the file is ready, open a Terminal window, navigate to the root directory of the monorepo (remote-falcon), and run `docker compose up`. The command will pull down the images needed for MySQL and run the script, then will build and run the API and Web app. Once you see the API logs complete, you should be able to hit http://localhost:3000.

Be sure to check out the **Verifying your email** section in the <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-api#readme" target="_blank">Remote Falcon API</a> README.

### Most Difficult to Run, Easiest to Test
This method takes a while to get going, but once you're running it makes development a breeze. This is because you can start each piece of Remote Falcon separately. So if you need to make a change to the API, you only have to restart the API. If you make Web changes, then you don't have to restart anything since it utilizes hot reloads. You also don't have to worry about losing your database data.

Inside this monorepo is 3 individual repositories, one for the Web application, one for the API, and one for the database. If you're starting fresh, I recommend reading and executing each README in this order:
1. <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-sql#readme" target="_blank">Remote Falcon SQL</a>
2. <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-api#readme" target="_blank">Remote Falcon API</a>
3. <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-web#readme" target="_blank">Remote Falcon Web</a>
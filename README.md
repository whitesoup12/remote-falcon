# Remote Falcon

- [What Is Remote Falcon?](#what-is-remote-falcon)
- [What is this repository for?](#what-is-this-repository-for)
- [Cloning the respository](#cloning-the-repository)
- [How do I run it?](#how-do-i-run-it)
- [I Need Help!](#i-need-help)

### What Is Remote Falcon?
<a href="https://remotefalcon.com" target="_blank">Remote Falcon</a> is a free web application that integrates with both <a href="ttps://github.com/FalconChristmas/fppFalcon" target="_blank">Falcon Player</a> and xSchedule (from <a href="https://github.com/smeighan/xLights" target="_blank">xLights</a>) to allow viewers to interact with your light show. Via a highly customizable Viewer Page, your visitor can request or vote on songs to be played on your display.

### What is this repository for?
This repository, which was created to act as a monorepo, contains everything needed to run Remote Falcon. For more info on running it locally, check out the [How do I run it?](#how-do-i-run-it) section.

### Cloning the repository
Before you can do anything it's pretty important to get the code. You'll need to use Git to clone <a href="https://github.com/whitesoup12/remote-falcon" target="_blank">this respository</a>. When cloning, I recommend cloning to a path that has no spaces. It's not required, but sometimes spaces in development file paths can cause headaches.

### How do I run it?
Inside this monorepo is 3 individual repositories, one for the Web application, one for the API, and one for the database. If you're starting fresh, I recommend reading and executing each README in this order:
1. <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-sql#readme" target="_blank">Remote Falcon SQL</a>
2. <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-api#readme" target="_blank">Remote Falcon API</a>
3. <a href="https://github.com/whitesoup12/remote-falcon/tree/main/remote-falcon-web#readme" target="_blank">Remote Falcon Web</a>

### I Need Help!
If you need help, have a question, or notice an issue with the local development setup READMEs, please utilize this repositories <a href="https://github.com/whitesoup12/remote-falcon/discussions" target="_blank">GitHub Discussions page</a>.
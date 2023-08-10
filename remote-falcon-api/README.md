# Remote Falcon API

The purpose of this README is to provide the instructions needed to get Remote Falcon API running on your local machine.

- [Prerequisites](#prerequisites)
  - [IntelliJ (Recommended)](#intellij-recommended)
  - [Maven (Required)](#maven-required)
- [Running Remote Falcon SQL script](#running-remote-falcon-sql-script)
- [Third Party Integrations](#third-party-integrations)
- [Verifying your email](#verifying-your-email)

### Prerequisites
There are a few things you need to make sure you have. Some of the following items are required and some are recommended. Like before, if you already have some or all of these things (or equivalent), then feel free to skip this step.

#### IntelliJ (Recommended)
IntelliJ is pretty great and support Java out of the box with minimal setup and configuration. You can also use VSCode or another IDE. I'm not going to cover the IntelliJ set up portion in this README, but I will provide the info needed to get it ready for the API. You can <a href="https://www.jetbrains.com/idea/download" target="_blank">download IntelliJ here</a>. The top will show Ultimate Edition, but if you scroll down you can find the Community Edition, which is free. Further instructions will just assume you're using IntelliJ.

#### Maven (Required)
Maven is needed to download the dependencies used in the Remote Falcon API. If you downloaded IntelliJ, it came with Maven. If you're not using IntelliJ then you'll need to setup and configure Maven on your local machine.

### Running Remote Falcon API
The Remote Falcon API uses Java 17, so you will need to make sure you have that version of Java downloaded. If using IntelliJ, you can download the Java 17 SDK in the IDE. Otherwise you might have to follow some guides on downloading and setting up Java on your machine.

Once you had Java 17 ready to go you can open the remote-falcon-api project. 

For local testing I typically just run the API using Spring Boot. But before you can run the API, you'll need to add a few environment variables (under the Edit Configurations option in IntelliJ). The following variables are needed:

```
BASE_URL=http://localhost:8080
BASE_APP_URL=http://localhost:3000
MAIL_FROM=fake@email.com
SENDGRID_KEY=
JWT_SIGN_KEY=1234567890
JWT_VIEWER_SIGN_KEY=1234567890
ADO_PAT=
DATABASE_URL=mysql://root:root@localhost:3306/remotefalcon
```

Here's what each variable is for:
- `BASE_URL`: This is base URL for the API. When running locally, it uses port 8080 (unless changed).
- `BASE_APP_URL`: This is the base URL for the Web application. When started, the web application runs on port 3000 (unless changed).
- `MAIL_FROM`: This can be anything and isn't really needed unless you are using SendGrid.
- `SENDGRID_KEY`: Used to send emails, but isn't needed unless you're doing development and need to test emails. More on this in the [Third Party Integrations](#third-party-integrations) section and be sure to check out the [Verifying your email](#verifying-your-email) section.
- `JWT_SIGN_KEY`: You can use anything here. It's the secret key that's used to sign the JWT.
- `JWT_VIEWER_SIGN_KEY`: You can use anything for this as well. This is the secret key used to sign the JWT for the viewer page. Make note of this key, because the same key is needed when running Remote Falcon Web.
- `ADO_PAT`: All the work items on the Work Item Tracker live in ADO (Azure Devops). More on this in the [Third Party Integrations](#third-party-integrations) section. You don't need this unless you are working with the Work Item Tracker.
- `DATABASE_URL`: This is the URL, or connection string, for your local MySQL instance. If you used a user/password other than `root`, you'll need to modify that URL.

### Third Party Integrations
These are the third party apps used in Remote Falcon Web and how they are used. All of these have free tiers, so you're welcome to use them if needed during development/testing, but it shouldn't be required.

- SendGrid: <a href="https://sendgrid.com/" target="_blank">SendGrid</a> is used to send out emails. It's handy because you can easy create and edit email templates and see what's been sent and received. If you choose to integrate with SendGrid, make sure you check out the EmailUtils class in the API, specifically the `Show_Name`, `Verify_Link`, etc. properties. This will tell you what dyanmic values are needed in your email template
- ADO (Azure Devops): <a href="https://azure.microsoft.com/en-us/products/devops/" target="_blank">Azure Devops</a> is used for quite a bit for other Remote Falcon processes (like CI/CD), but in terms of the API and Web application, it's only used for the Work Item Tracker.

### Verifying your email
When running the API and Web application for the first time on your machine, you'll need to create a new account (since there will be no account data in the database). However, when creating the account you will not have any way to verify it via email (unless you've integrated with SendGrid). To verify your acount, you can open your MySQL database, find the `remotes` table, and manually set the `emailVerified` value to 'Y'.
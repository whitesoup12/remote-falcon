# Remote Falcon Web

The purpose of this README is to provide the instructions needed to get Remote Falcon Web running on your local machine.

- [Prerequisites](#prerequisites)
  - [Visual Studio Code (Recommended)](#visual-studio-code-recommended)
  - [GitHub Desktop (Recommended)](#github-desktop-recommended)
  - [Node/NPM (Required)](#nodenpm-required)
- [Running Remote Falcon Web](#running-remote-falcon-web)
- [Third Party Integrations](#third-party-integrations)

### Prerequisites
Before you get rolling, there are a few things you need to make sure you have. Some of the following items are required and some are recommended. I'll be sure to differentiate the two. If you already have some or all of these things (or equivalent), then feel free to skip this step.

#### Visual Studio Code (Recommended)
I recommend VS Code for pretty much everything. It's lightweight, free, and has a ton of plugins to make development life easier. You can <a href="https://code.visualstudio.com/download" target="_blank">download VS Code here</a>.

#### GitHub Desktop (Recommended)
GitHub Desktop is a free Git client you can use to clone and manage Git repositories. There are a number of free and paid Git clients, but this is the one I personally use. You can <a href="https://desktop.github.com/" target="_blank">download GitHub Desktop here</a>.

#### Node/NPM (Required)
Remote Falcon Web currently uses Node v16.14.0 and NPM 8.3.1. You can <a href="https://nodejs.org/download/release/v16.14.0/" target="_blank">download Node v16.14.0 here</a> (includes NPM 8.3.1).

#### Terminal/Command Prompt (Required)
There are many flavors of terminals depending on your operating system. Doesn't matter which one is used, just know you'll need one. The default CMD on Windows or Terminal on MacOS is fine. 

### Running Remote Falcon Web
Now that you have the code, it's time to get Remote Falcon Web up and running. Here are the steps to do that:

1. **Install React Scripts** - Remote Falcon Web uses react-scripts for starting and building. This should be the only module that will need to be installed globally. To install, open a terminal and run the following command: `npm install -g react-scripts@3.4.1`. Note, you might have to restart your terminal after this. Maybe, I donm't know. Wouldn't hurt to do so.
2. **Change to remote-falcon-web directory** - In your terminal, change the current directory to `{clone-path}/remote-falcon/remote-falcon-web`.
3. **Install Node Modules** - Once you're in the remote-falcon-web directory, it's time to install the node modules. These are all the libraries needed in order to run Remote Falcon Web. To do this, simply run `npm i` (or `npm install`). This may take a little while depending on your machine specs and internet connection. Once done, you should see a node_modules directory in remote-falcon-web.
4. **Create the local env file** - Before running Remote Falcon Web, you will need to create a new file named `.env.local`. In this file, add the following properties:
```
REACT_APP_HOST_ENV=local
REACT_APP_BASE_API_PATH=http://localhost:8080
#REACT_APP_DATADOG_CLIENT_TOKEN=
REACT_APP_JWT_VIEWER_SIGN_KEY=1234567890
```

Here is what each variable is for:
- `REACT_APP_HOST_ENV`: You're running this locally, so the environment is local.
- `REACT_APP_BASE_API_PATH`: This is going to be the base URL for the API. If using a port other than the default port (8080), then you'll need to update this URL.
- `REACT_APP_DATADOG_CLIENT_TOKEN`: Used for monitoring. More on that in the [Third Party Integrations](#third-party-integrations) section.
- `REACT_APP_JWT_VIEWER_SIGN_KEY`: This can be anything, but needs to be same value used in the API environment variables.

Notice the `REACT_APP_DATADOG_CLIENT_TOKEN` is commented out. If you actually want to test metrics in Datadog then you will need to create an account with those services and get an API key. Setup for these services will not be included in this README.
5. **Start Remote Falcon Web** - The final step is to start Remote Falcon Web. To do this, run `npm run start`. Once the application is ready, it should automatically open the app in your default browser. If your browser and app doesn't automatically open, you can manually navigate to `localhost:3000`.

### Third Party Integrations
These are the third party apps used in Remote Falcon Web and how they are used. All of these have free tiers, so you're welcome to use them if needed during development/testing, but it shouldn't be required.

- Datadog: <a href="https://www.datadoghq.com/" target="_blank">Datadog</a> is used to monitor everything in Remote Falcon, including Kubernetes resources. For the Web portion specifically, it's used to monitor and report on Web application performance and user session experiences.

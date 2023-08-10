# Remote Falcon SQL

The purpose of this README is to provide the instructions needed to get Remote Falcon MySQL Database running on your local machine.

- [Prerequisites](#prerequisites)
  - [My SQL Community Server (Recommended)](#my-sql-community-server-recommended)
  - [DBeaver (Recommended)](#dbeaver-recommended)
- [Running Remote Falcon SQL script](#running-remote-falcon-sql-script)

### Prerequisites
There are a few things you need to make sure you have. Some of the following items are required and some are recommended. I'll be sure to differentiate the two. If you already have some or all of these things (or equivalent), then feel free to skip this step.

#### My SQL Community Server (Recommended)
There are numerous ways to spin up a local MySQL instance locally, but to me MySQL Community Server is the most straight-forward. You can <a href="https://dev.mysql.com/downloads/mysql/" target="_blank">download MySQL Community Server here</a>. When setting up the MySQL server (or other local MySQL instance), set the user and password to `root`. If you choose to use a different user/password, then just remember it for when it's time to run the API.

#### DBeaver (Recommended)
DBeaver is great for connecting to database. Super easy to use and lots of good documentation. You can <a href="https://dbeaver.io/download/" target="_blank">download DBeaver here</a>. Again, there are plenty of tools out there to connect to databases. Pick your poison.

### Running Remote Falcon SQL script
Once you have MySQL Community Server (or some other localy running MySQL instance), it's time to run the SQL script. Just open or copy/paste the script into a SQL Editor in DBeaver (or another database connection tool) and run it.

Some default data gets inserted (default viewer page and some templates), but other than that it's a clean slate.
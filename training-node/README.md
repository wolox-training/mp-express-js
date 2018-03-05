# WoloxLand

## First steps

#### Installing node
Get the latest version of node from the [official website](https://nodejs.org/) or using [nvm](https://github.com/creationix/nvm).
Nvm approach is preferred.

#### Getting dependencies
Run ```npm install``` or ```yarn``` from rootpath of the project.

#### Database configuration
Before running the app, make sure you must have a psql db created. Then, set the `$NODE_API_DB_HOST`, `$NODE_API_DB_NAME`, `$NODE_API_DB_USERNAME`, `$NODE_API_DB_PASSWORD`, `$NODE_API_DB_PORT` environment variables.
For more information feel free to glance at the [`app/orm.js`](https://github.com/Wolox/CampaignsApi/blob/master/app/models/index.js#L6) file.

### Migrations

To create a migration, run `./node_modules/.bin/sequelize migration:create --name="my-migration-name"`.

To run them, execute `npm run migrations`.

#### Starting your app
Now, to start your app run ```npm start``` in the rootpath of the project. Then access your app at **localhost:port**. The port is logged in the console where you ran the start script.

## Development

#### Environments
By default, the environment will be **development**, but you can easily change it using the **NODE_ENV** environmental variable.

#### Environment variables
`Dotenv` is used for managing environment variables. They are stored in the `/config/.env` file. Take into account that the variables defined in the `bashrc` are not overrided.

The environment variables should be added to the `.env` file in the form of `NAME=VALUE`, as the following example:
```
NODE_API_DB_HOST=localhost
NODE_API_DB_USERNAME=root
NODE_API_DB_PASSWORD=superpass
...
```

**Remember not to push nor commit the `.env` file.**

#### Logging
To log useful information of your program to the console you just need to import the logger located at `app/logger`. There are two possible types of logging: `info` and `error`. You should use them depending on the type of message you want to show.

Here is an example snippet:
```
const logger = require('/app/logger');
...
if (error) {
    logger.error('There is an error);
} else {
    logger.info('There is no error);
}
```

#### Debugging
As we know, a NodeJS application is not something easy to debug and because of that we've added the `--inspect` flag to make it simpler. Chrome DevTools will get started when running your app using the start script (`npm start`), making your debugging easier.

#### REPL console
We can use a node console with `npm run console`. There your service objects are exposed as _servicename_ + "Service". Let's suppose that we have a service `users` which has a function `getAll`. In your console you can call `usersService.getAll()` and see the result. Note that this works also with functions that return promises! To exit the console use `.exit`.

#### Documentation
Documentation will be served at `/docs`. Remember using [dictum.js](http://www.github.com/Wolox/dictum.js) package to automatically generate documentation for your endpoints. Check [this link](https://github.com/Wolox/dictum.js#chai) for further details.

## Deploy

#### Heroku
Pushing the desired branch to heroku should be enough.
For more information check: https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-a-procfile.

## About

This project is maintained by [Wolox](https://github.com/Wolox) and it was written by [Wolox](http://www.wolox.com.ar).

![Wolox](https://raw.githubusercontent.com/Wolox/press-kit/master/logos/logo_banner.png)

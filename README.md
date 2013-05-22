# grunt-deploy: deploy your node app easily

> The Grunt plugin to deploy node app into ubuntu

Find more in [here](http://zhefeng.github.io/grunt-deploy/ "grunt-deploy").
Google group in [here](https://groups.google.com/forum/?fromgroups#!forum/grunt-deploy "grunt-deploy group").

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-deploy');
```

## The "deploy" task

### Overview
In your project's Gruntfile, add a section named `deploy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  deploy: {
    liveservers: {
      options:{
        servers: [{
          host: '123.123.123.12',
          port: 22,
          username: 'username',
          password: 'password'
        }],
        cmds_before_deploy: ["some cmds you may want to exec before deploy"],
        cmds_after_deploy: ["forever restart", "some other cmds you want to exec after deploy"],
        deploy_path: 'your deploy path in server'
      }
    }
  },
})
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

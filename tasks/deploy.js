/*
 * grunt-deploy
 * http://zhefeng.github.io/grunt-deploy/
 *
 * Copyright (c) 2013 Zhe Feng
 * Licensed under the MIT license.
 */

 'use strict';

 module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('deploy', 'Your task description goes here.', function() {
    var self = this;
    var done = self.async();
    var Connection = require('ssh2');
    var moment = require('moment');
    var timeStamp = moment().format('YYYYMMDDHHmmssSSS');
    

    var options = self.options();

    var connections = [];


    var execSingleServer = function(server, connection){

      var exec = function(cmd, next){
        console.log(server.username + "@" + server.host + ":~$ " + cmd);
        connection.exec(cmd, function(err, stream) {
          if (err) {throw err;}
          stream.on('data', function(data, extended) {
            console.log(data + '');
            next && next(data, extended);
          });
        });
      };

      var execCmds = function(cmds, index, next){
        exec(cmds[index++], function(){
          if(index < cmds.length){
            execCmds(cmds,index,next);
          }
          else {
            next();
          }
        })
      }

      execCmds(self.data.cmds_before_deploy, 0, function(){
        exec('[ -d ' + self.data.deploy_path + ' ] && echo "exits"',function(data, extended){
          if(data === 'exits'){
            console.log(data);
          }
          else{
            console.warn('The deploy_path is not exist.')
          }
          connection.end();
        })




        //execCmds(self.data.cmds_after_deploy, 0, function(){
          //
        //})
      })
    }



    self.data.servers.forEach(function(server){
      var c = new Connection();
      c.on('connect', function() {
        console.log('Connected to server: ' + server.host);
      });
      c.on('ready', function() {
        execSingleServer(server,c);
      });
      c.on('error', function(err) {
        console.log("Error on server: " + server.host)
        console.error(err);
        if (err) {throw err;}
      });
      c.on('close', function(had_error) {
        console.log("Closed connection for server: " + server.host)
      });
      c.connect(server);
    })




    /*var c = new Connection();
    c.on('connect', function() {
      console.log('Connection :: connect');
    });
    c.on('ready', function() {
      console.log('Connection :: ready');
      c.exec("~/.nvm/v0.10.6/bin/node --version", function(err, stream) {
        if (err) {throw err;}
        stream.on('data', function(data, extended) {
          console.log(data + '');
        });
        stream.on('end', function() {
          console.log('Stream :: EOF');
        });
        stream.on('close', function() {
          console.log('Stream :: close');
        });
        stream.on('exit', function(code, signal) {
          console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
          c.end();
        });
      });
    });
    c.on('error', function(err) {
      console.log('Connection :: error :: ' + err);
      done();
    });
    c.on('end', function() {
      console.log('Connection :: end');
      done();
    });
    c.on('close', function(had_error) {
      console.log('Connection :: close');
      done();
    });
    c.connect({
      host: '10.211.55.11',
      port: 22,
      username: 'zhe',
      password: 'Jldnm0ci9b#ioo*'
    });*/



    //console.log("run cmds by ssh");
    //console.log("create folder in distination");
    //console.log("copy files to distination folder and don't copy the ignore files");
    //console.log("run cmds by ssh");




    /*// Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      console.log(f.src);
      var src = f.src.filter(function(filepath) {
        console.log(filepath);
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });*/
});

};

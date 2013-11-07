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

  grunt.registerMultiTask('deploy', 'Task to deploy folders or files via node-scp2.', function() {
    var self = this;
    var done = self.async();
    var client = require('scp2');
		var Connection = require('ssh2');
    var moment = require('moment');
    var timeStamp = moment().format('YYYYMMDDHHmmssSSS');
    

    var options = self.options();

    var connections = [];


    var execSingleServer = function(server, connection){

      var exec = function(cmd, showLog, next){

        //console.log(server.username + "@" + server.host + ":~$ " + cmd);
        connection.exec(cmd, function(err, stream) {
          if (err) {throw err;}
          stream.on('data', function(data, extended) {
            showLog && console.log(data + '');
          });
          stream.on('end', function() {
            next && next();
          });
        });
      };

      var execCmds = function(cmds, index, showLog, next){
        if(!cmds ||  cmds.length <= index) {
          next && next();
        }
        else{
          exec(cmds[index++], showLog, function(){
            execCmds(cmds,index,next);
          })
        }
      }

      execCmds(options.cmds_before_deploy, 0, true, function(){

        var createFolder = 'cd ' + options.deploy_path + '/releases && mkdir ' + timeStamp;
        var removeCurrent = 'rm -rf ' + options.deploy_path + '/current';
        var setCurrent = 'ln -s ' + options.deploy_path + '/releases/' + timeStamp + ' ' + options.deploy_path + '/current';
        
        exec(createFolder + ' && ' + removeCurrent + ' && ' + setCurrent, false,function(){
          var sys = require('sys')
          var execLocal = require('child_process').exec;
          var child;
					
					
					server.path = options.deploy_path + '/releases/' + timeStamp;
		
					var startTime = ( new Date() ).getTime();;
					client.scp(
						(options.source_path || '.'),
						server,
						function(err) {
							var timeDiff = ( new Date() ).getTime() - startTime;
							grunt.log.ok('Deployment done in '+(timeDiff / 60000).toFixed(2)+' minutes.');
							execCmds(options.cmds_after_deploy, 0, true, function(){
								connection.end();
							});
						}
					);
        })
      })
    }

    var length = options.servers.length;
    var completed = 0;
    var checkCompleted = function(){
      completed++;
      if(completed>=length){
        done();
      }
    }

    options.servers.forEach(function(server){
      var c = new Connection();
      c.on('connect', function() {
        //console.log('Connecting to server: ' + server.host);
      });
      c.on('ready', function() {
        grunt.log.ok('Connected to server: ' + server.host);
        execSingleServer(server,c);
      });
      c.on('error', function(err) {
        grunt.log.error("Error on server: " + server.host)
        console.error(err);
        if (err) {throw err;}
      });
      c.on('close', function(had_error) {
        //console.log("Closed connection for server: " + server.host);
        checkCompleted();
      });
      c.connect(server);
    });

});

};

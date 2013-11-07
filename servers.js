module.exports.servers = function() {
	var fs = require('fs');
	//var keyContent = fs.readFileSync( '/home/user/.ssh/id_rsa' ).toString();
	return  [{
		host: 'host',
		port: 22,
		username: 'username',
		password: 'password'

		// for privateKey/passPhrase login
		//privateKey: keyContent,
		//passphrase: 'passphrase'
	}];
}

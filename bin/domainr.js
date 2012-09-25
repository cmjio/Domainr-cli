// Modules
var program = require('commander'),
	clc = require('cli-color'),
	request = require('request'),
	spawn = require('child_process').spawn;

// Commands
program
	.version('0.0.1')
	.description('The best cli app ever for registering domains')
	.option('-a, --author','Output the author contact information');
	//.option('-d, --domain [domain]','Domain to search for');

program.command('search [domain]')
	.description('Used for searching domains on domai.nr')
	.action(function(name){

	});

program.parse(process.argv);


if (program.author) author();

var author = function(){
	console.log('Developer: Chris Johnson (me@cmj.io) - http://cmj.io');
};

var domain = function(name){
	request('http://domai.nr/api/json/info?q='+name, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var json = JSON.parse(body);
			    
			    console.log(name + ' is ' + json.availability);

			    if(json.availability == 'available'){
			    	var rs = [];
			    
				    for(var i =0; i < json.registrars.length; i++){
				  		rs.push(json.registrars[i].name);
				    }

				    console.log('Choose a registrar:');
				    program.choose(rs, function(i){
				    	console.log('you chose %d "%s"', i+1, json.registrars[i].name);
				    	spawn('open', [json.registrars[i].register_url]);
				    		process.stdin.destroy();
				    });
			    }
		  	}
		});
};

var search = function(domain){
	request('http://domai.nr/api/json/search?q='+domain, function (error, response, body){
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);

			var alts = [];
			for(var i =0; i < json.results.length; i++){
				if(json.results[i].availability == 'available'){
					alts.push(json.results[i].domain);
				}
			}
			console.log('Choose an alternative:');
			program.choose(alts, function(i){
				console.log('you chose %d "%s"', i+1, json.results[i].domain);
				domain(json.results[i].domain);
			});
		}
	});
}
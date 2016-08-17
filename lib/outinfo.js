let colors = require('colors');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'red',
	info: 'green',
	data: 'blue',
	help: 'cyan',
	warn: 'yellow',
	debug: 'magenta',
	error: 'red'
});

let
backConsole = (info, args, method, c=console) => {
	(args = Array.from(args)).unshift(info);
	return c[method].apply(c, args);
},
outinfo = {
	ok(){
		let info = '(O)'.verbose;
		return backConsole(info, arguments, 'log');
	},
	warn(){
		let info = '(X)'.warn;
		return backConsole(info, arguments, 'warn');
	},
	fail(){
		let info = '(X)'.error;
		return backConsole(info, arguments, 'error');
	},
};

global.outinfo = outinfo;

module.exports = outinfo;

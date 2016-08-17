let sql = require('../lib/mysql.js'),
	eventproxy = require('eventproxy'),
	toMongodb = require('../lib/2mongodb');

let sqlinfo = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'pache',
	port: 3306,

	'article-table': 'pache_article',
	'tag-table': 'pache_tag',
};

var connection = sql.create(sqlinfo);

sql.connect(connection);

let queryStr = [
	`SELECT * FROM ${sqlinfo['article-table']} ORDER BY id`,
	`SELECT * FROM ${sqlinfo['tag-table']} ORDER BY articleid`,
];

let ep = new eventproxy;

ep.after('collect', queryStr.length, pache => {
	if ( pache[0].articleid !== undefined ){
		var [tags, articles] = pache;
	}else{
		var [articles, tags] = pache;
	}
	toMongodb.toMongoDB(tags, articles);
});

queryStr.forEach(sqlstr => {
	sql.query(connection, sqlstr, rows => {
		ep.emit('collect', rows);
	}, err => {
		console.error(err);
		process.exit(1);
	});
});

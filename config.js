module.exports = {
	'secretKey': '12345-67890-09876-54321',
	'mongoUrl': () => (!process.env.IP_HOST ? 'mongodb://localhost:27017/conFusion' : `mongodb://${process.env.IP_HOST}:27017/conFusion`)
};
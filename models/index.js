const Bulletin = require('./Bulletin');
const Comment = require('./Comment');

Bulletin.hasMany(Comment, {as: 'Comments', foreignKey: 'bulletinId'});
Comment.belongsTo(Bulletin, {as: 'Bulletin', foreignKey: 'bulletinId'});

module.exports = {
	Bulletin,
	Comment
};
const { Bulletin, Comment } = models;

const createComment = async(data)=>{
    const countBulletin = await Bulletin.count({ where: { id: data.bulletinId } });

    if(countBulletin != 1)
        throw new CustomError(`bulletinId Not found`, 400);

    return Comment.create(data);
}

module.exports = {
    createComment
}
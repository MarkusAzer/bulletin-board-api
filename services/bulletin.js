const stream = require('stream');
const { Bulletin } = models;

const getAllBulletin = () =>Bulletin.findAll({attributes: ['id', 'title', 'content', 'imageName']});

const getBulletin = async(id)=>{
    const bulletin = await Bulletin.findByPk(id, { attributes: ['id', 'title', 'content', 'imageName']});

    if(empty(bulletin))
        throw new CustomError(`Bulletin Not Found`, 400);
    
    return bulletin;
}

const streamImage = async(id, res)=>{
    const bulletin = await Bulletin.findByPk(id);

    if(empty(bulletin))
        throw new CustomError(`Bulletin Image Not Found`, 400);

    //Stream Image to Browser
    const fileContent = Buffer.from(bulletin.imageData, "base64");
    const readStream = new stream.PassThrough();
    readStream.end(fileContent);
    res.set('Content-disposition', 'filename=' + bulletin.imageName);
    res.set('Content-Type', bulletin.imageType);
    readStream.pipe(res);
}

const createBulletin = (data)=>Bulletin.create(data);

module.exports = {
    getAllBulletin,
    getBulletin,
    streamImage,
    createBulletin
}
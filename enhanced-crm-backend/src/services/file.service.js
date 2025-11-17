const File = require('../models/File')
const s3Service = require('./s3.service') // assume exists

exports.upload = async (
  fileBuffer,
  filename,
  mimetype,
  userId,
  relatedTo,
  resourceId
) => {
  // delegate to storage (S3) and record metadata
  const { url } = await s3Service.upload({
    buffer: fileBuffer,
    filename,
    mimetype,
  })
  const record = await File.create({
    filename,
    url,
    mime: mimetype,
    size: fileBuffer.length,
    uploadedBy: userId,
    relatedTo,
    resourceId,
  })
  return record
}

exports.remove = async (id) => {
  const f = await File.findById(id)
  if (!f) throw new Error('File not found')
  await s3Service.remove(f.url)
  await File.findByIdAndDelete(id)
  return true
}

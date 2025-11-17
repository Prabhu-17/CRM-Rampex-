module.exports = (req, res, next) => {
  req.paginate = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
    skip:
      ((parseInt(req.query.page, 10) || 1) - 1) *
      (parseInt(req.query.limit, 10) || 20),
  }
  next()
}

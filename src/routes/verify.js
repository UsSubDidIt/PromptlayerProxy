const manager = require('../lib/manager')
const verify = (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authorization.replace('Bearer ', '')

  if (token === process.env.AUTH_TOKEN) {
    req.account = manager.getAccount()
    // console.log(`身份校验成功，使用账号=> ${JSON.stringify(req.account)}`)
    next()
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = verify

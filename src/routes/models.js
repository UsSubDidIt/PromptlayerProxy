const express = require('express')
const router = express.Router()
const modelMap = require('../lib/model-map')

router.get('/v1/models', (req, res) => {

  const result = Object.keys(modelMap).map((id) => {
    return {
      id,
      object: "model",
      created: 1626777600,
      owned_by: modelMap[id].provider
    }
  })

  res.json({
    object: "list",
    data: result
  })
})

module.exports = router
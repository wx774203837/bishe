module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const jwt = require('jsonwebtoken')
  const Admin = require('../../models/Admin.js')
  const assert = require('http-assert')
  const getTime = require('../../plugins/Utility')
  const Comment = require('../../models/Comment')
  const Article = require('../../models/Article')
  const User = require('../../models/User')

  router.post('/', async (req, res) => {
    if (req.Model.modelName === 'User') {
      const username = await User.findOne({ username: req.body.username })
      const name = await User.findOne({name:req.body.name})

      if(name){
        return res.status(424).send({message:'昵称已存在'})
      }
      if (username) {
        return res.status(423).send({ message: '用户已存在' })
      }
    }
    req.body.date = getTime()
    const model = await req.Model.create(req.body)

    if (req.Model.modelName === 'Comment') {
      const article = req.body.article
      const commentList = await req.Model.find({ article: article })
      const articleModel = await Article.findOne({ _id: article })

      model.floor = commentList.length
      articleModel.commentCount = commentList.length
      articleModel.save()
      model.save()
    }

    res.send(model)
  })

  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  router.put('/:id/statue/:statue', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    model.statue = req.params.statue
    model.save()
    res.send(model)
  })

  router.put('/:id/top/:top', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    model.top = req.params.top
    model.save()
    res.send(model)
  })

  router.get('/', async (req, res) => {
    let items = ''
    if (req.Model.modelName === 'Article') {
      items = await req.Model.find().populate('author')
    } else {
      items = await req.Model.find()
    }
    res.send(items)
  })

  router.get('/:id', async (req, res) => {
    let items = ''
    if (req.Model.modelName === 'Article') {
      items = await req.Model.findById(req.params.id).populate('author')
      items.readcount = items.readcount + 1
      items.save()
    } else {
      items = await req.Model.findById(req.params.id)
    }
    res.send(items)
  })



  app.use('/admin/api/rest/:resource', (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    next()
  }, router)

  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  app.post('/admin/api/login', async (req, res) => {
    const { adminname, password } = req.body
    const user = await Admin.findOne({ adminname }).select('+password')

    // assert(user, 422, '用户不存在')
    if (!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }

    const isValid = require('bcryptjs').compareSync(password, user.password)

    // assert(isValid, 422, '密码错误')
    if (!isValid) {
      return res.status(422).send({
        message: '密码错误'
      })
    }

    const jwt = require('jsonwebtoken')
    const token = jwt.sign({
      id: user._id
    }, app.get('secret'))
    res.send(token)
  })

  // app.use(async (err, req, res, next) => {
  //   res.status(err.statusCode).send({
  //     message: err.message
  //   })
  // })
}

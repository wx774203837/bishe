module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const User = require('../../models/User')
  const Article = require('../../models/Article')
  const Comment = require('../../models/Comment')
  const Reply = require('../../models/Reply')

  router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    // assert(user, 422, '用户不存在')
    if (!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }


    // assert(isValid, 422, '密码错误')
    if (password !== user.password) {
      return res.status(422).send({
        message: '密码错误'
      })
    }
    if (user.status == false) {
      return res.status(425).send({
        message: '用户已被封禁'
      })
    }

    const jwt = require('jsonwebtoken')
    const token = jwt.sign({
      id: user._id
    }, app.get('secret'))
    let data = {}
    data.token = token
    data.user = user
    res.send(data)
  })

  router.put('/article/likes', async (req, res) => {
    const { articleId, userId } = req.body
    const article = await Article.findOne({ _id: articleId })
    var islike = true

    for (i = 0, len = article.likes.length; i < len; i++) {
      if (article.likes[i] == userId) {
        article.likes.splice(i, 1)
        islike = false
      }
    }

    if (islike === true) {
      article.likes.push(userId)
    }

    article.save()
    let item = {}
    item.like = islike
    item.likeCount = article.likes.length
    res.send(item)
  })

  router.get('/article', async (req, res) => {
    let list = await Article.find()
    let topList = []
    list.forEach(item=>{
      if(item.top === true){
        topList.push(item)
      }
    })
    let items = await Article.find({'top':false}).sort({'_id':-1}).populate('author')
    items.unshift(...topList)
    const model = {items}
    res.send(model)
  })

  router.get('/article/list/:id', async (req, res) => {
    const article = await Article.find({ author: req.params.id }).limit(5)
    res.send(article)
  })

  router.put('/comment/likes', async (req, res) => {
    const { userId, commentId } = req.body
    const comment = await Comment.findOne({ _id: commentId })

    let islike = true
    for (i = 0, len = comment.likes.length; i < len; i++) {
      if (comment.likes[i] == userId) {
        comment.likes.splice(i, 1)
        islike = false
      }
    }

    if (islike === true) {
      comment.likes.push(userId)
    }

    comment.save()
    let item = {}
    item.like = islike
    item.likeCount = comment.likes.length
    res.send(item)
  })

  router.get('/commentList/:id', async (req, res) => {
    const commentList = await Comment.find({ article: req.params.id }).populate('user')
    res.send(commentList)
  })
  router.get('/replyList/:id', async (req, res) => {
    const replyList = await Reply.find({ comment: req.params.id }).populate('user')
    res.send(replyList)
  })

  router.get('/user/recommend',async (req,res)=>{
    let sum = await User.count()
    var random = Math.floor(Math.random()*sum)
    let items = await User.find().skip(random).limit(5)
    res.send(items)
  })

  app.use('/admin/api/web', router)
}
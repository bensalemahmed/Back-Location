const routes = require('express').Router();
const user = require('../models/user');
const jwt = require('jsonwebtoken')
var multer  = require('multer')
let upload = require('../../uplouad')



routes.post('/login',  async (req, res) => {
  const userResult = await user.findOne({ email: req.body.email }).exec();
  if (!userResult) { res.send({ msg: 'User not found', data: '' }); }
  if (!userResult.comparePassword(req.body.password, userResult.password)) { res.send({ msg: 'Bad password', data: '' }); }
  userResult.password = '';
  res.send({ msg: 'OK', data: { token: jwt.sign({ data: userResult }, process.env.SECRET) } });
})

routes.post('/register', upload.single('imgUrl'), async (req, res) => {
  console.log (req.file)
  let userObject = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      imgUrl: req.file ? req.file.filename : 'profil.png',
      email: req.body.email,
      password: req.body.password
    }
    console.log(userObject)
    const result = await user.create(userObject).catch(err =>err)
   res.send ({msg: 'ok',data :result})
})

module.exports = routes;

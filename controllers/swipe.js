const express = require('express');
const Redirect = require('../middlewares/redirect');
const models = require('../models');
const Op = models.Sequelize.Op;

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.get('/', Redirect.ifNotLoggedIn(), Redirect.ifNoSetUp(), Redirect.ifNoPetSetUp(), this.index);
    router.get('/next', Redirect.ifNotLoggedIn(), Redirect.ifNoSetUp(), Redirect.ifNoPetSetUp(), this.getPupper);
    router.post('/', this.submit);

    return router;
  },
  index(req, res) {
    req.user.getProfile().then((userProfile) => {
      res.render('swipe', { profile: userProfile, user: req.user,  });
    });
  },

  getPupper(req,res){
    req.user.getProfile().then((user_profile) => {
      models.Connection.findOne({
        where:{
          status: "Pending",
        },
        include: [{
          model: models.User,
          attributes: ['id'],
          where:{
            id: req.user.id,
          },
        },{
          model: models.Pet,
        }],
      }).then((pet) =>{
        console.log(pet);
        res.send(pet);
      });
    });
  },

  submit(req, res) {
    models.Pet.findOne({
      where: {
        id: req.body.pet,
      },
    }).then((pet)=>{
      models.Connection.update({
        status: req.body.status,
      },
      {
        where:{
          userId: req.user.id,
          petId: req.body.pet,
        },
        returning: true,
      }).then((connection)=>{
        res.sendStatus(200);
      });
    });
  },
};

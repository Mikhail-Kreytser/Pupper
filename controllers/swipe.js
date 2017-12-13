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
    models.Pet.findAll({
      where:{
        userId: {
          [Op.ne]: req.user.id
        },
      },
    }).then((pets) => {
      for(var i = 0; i < pets.length; i++){
        models.Connection.findOrCreate({
          where:{
            userId:req.user.id,
            petId: pets[i].id,
          }
        }).then((connection)=>{
        });
      }
    });
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
          where:{
            userId: {
              [Op.ne]: req.user.id
            },
          },
        }],
      }).then((pet) =>{
        res.send(pet);
      });
    });
  },

  submit(req, res) {
    models.Pet.findOne({
      where: {
        id: req.body.petId,
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

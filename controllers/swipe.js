const express = require('express');
const Redirect = require('../middlewares/redirect');
const models = require('../models');
const Op = models.Sequelize.Op;

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.get('/', Redirect.ifNotLoggedIn(), Redirect.ifNoSetUp(), Redirect.ifNoPetSetUp(), this.index);
    router.post('/', this.submit);
    router.get('/matches', Redirect.ifNotLoggedIn(), Redirect.ifNoSetUp(), Redirect.ifNoPetSetUp(), this.getMatches);

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
        }).then((connect)=>{
        });
      }
    });
    req.user.getProfile().then((userProfile) => {
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
      }).then((connection) => {
        res.render('swipe', { profile: userProfile, user: req.user, pet: connection.pet });
      }).catch(() =>{
        res.render('swipe', { profile: userProfile, user: req.user, error : "No more Pets" });
      })

    });
  },

  getMatches(req, res){
    models.Connection.findAll({
      where:{
        userId: req.user.id,
        status: "Matched",
      },
      include: [{
        model: models.Pet,
      }],
    }).then((connections) => {
      res.render('swipe/matches', {connections});
    });
  },

  submit(req, res) {
    models.Pet.findOne({
      where: {
        id: req.body.petId,
      },
    }).then(()=>{
      models.Connection.update({
        status: req.body.status,
      },
      {
        where:{
          userId: req.user.id,
          petId: req.body.petId,
        },
        returning: true,
      }).then((connection) => {
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
            if(pet)
              res.send(pet);
            else 
              res.send("No more Pets");
          });
        });
      });
    });
  },
};

const express = require('express');
const Redirect = require('../middlewares/redirect');
const models = require('../models');

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.get('/', Redirect.ifNotLoggedIn(), Redirect.ifNoSetUp(), Redirect.ifNoPetSetUp(), this.index);
    router.get('/pet/:petId', Redirect.ifNotLoggedIn(), Redirect.ifNoSetUp(), Redirect.ifNoPetSetUp(),Redirect.ifNotMatched(), this.show);

    return router;
  },
  index(req, res) {
    req.user.getProfile()
    .then((profile) => {
      req.user.getPets()
      .then((pets) =>{
        res.render('profile', { user: req.user, profile: profile, pets, success: req.flash('success')});
      });
    });
  },
  show(req, res) {
    models.Pet.findOne({
      where:{
        id: req.params.petId,
      }
    }).then((pet)=>{
      res.render('profile/pet',{pet});
    })
  },
};


const redirect = {};
const models = require('../models');
const Op = models.Sequelize.Op;


redirect.ifLoggedIn = (route) =>
  (req, res, next) => (req.user ? res.redirect(route) : next());

redirect.ifNoSetUp = (route = '/set-up') =>
  (req, res, next) => {
    req.user.getProfile().then((profile) =>{
      if(profile == null)
        res.redirect(route);
      else
        next();
    })
  };

redirect.ifSetUpComplete = (route = '/profile') =>
    (req, res, next) => {
    req.user.getProfile().then((profile) =>{
      if(profile == null)
        next();
      else
        res.redirect(route);
    })
  };

redirect.ifNoPetSetUp = (route = '/pet-set-up') =>
  (req, res, next) => {
    req.user.getPets().then((pets) => {
      if(pets.length >= 1)
        next();
      else
        res.redirect(route);
    })
  };

redirect.ifNotMatched = (route = '/profile') =>
  (req, res, next) => {
    if(req.params.petId == null)
        res.redirect(route);
    else{
      models.Connection.findOne({
        where:{
          petId: req.params.petId,
          userId: req.user.id,
          status: "Matched",
        },
      }).then((connection) => {
        if (connection !== null)
          next();
        else
          res.redirect(route);
      });
    }
  };

redirect.ifNotLoggedIn = (route = '/login') =>
  (req, res, next) => (req.user ? next() : res.redirect(route));

redirect.ifNotAuthorized = (route) =>
  (req, res, next) => (req.user.username !== req.params.username ? res.redirect(route) : next());

redirect.ifNotAdmin = (route = '/profile') =>
  (req, res, next) => (req.user ? (req.user.admin ? next() : res.redirect(route)) : res.redirect(route));

module.exports = redirect;

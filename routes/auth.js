const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const UsersService = require('../services/users');
const validateHandler = require('../utils/middleware/validationHandler');

const { createUserSchema } = require('../utils/schemas/users');

const { config } = require('../config');

// Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeysService = new ApiKeysService();
  const usersService = new UsersService();

  router.post(
    '/sign-in', 
    async function(req, res, next) {
      const { apiKeyToken } = req.body;

      if (!apiKeyToken) {
        next(boom.unauthorized('apiKeyToken is required'));
      }

      passport.authenticate('basic', function(error, user){
        try {
          if (error || !user) {
            next(boom.unauthorized());
          }

          req.login(user, {session: false}, async function(error) {
            if(error) {
              next(error);
            }

            const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

            if (!apiKey) {
              next(boom.unauthorized());
            }

            const { _id: id, name, email } = user;

            const payload = {
              sub: id,
              name,
              email,
              scopes: apiKey.scopes
            };

            const token = jwt.sign(payload, config.authJwtSecret, { expiresIn: '15m' });

            return res.status(200).json({
              token,
              user: {id, name, email}
            });
          })

        } catch (error) {
          next(error);
        }
      })(req, res, next);
  });

  router.post(
    '/sign-up', 
    validateHandler(createUserSchema), 
    async function(req, res, next) {
      const { body: user } = req;

      try {
        const createdUserId = await usersService.createUser({ user });

        res.status(201).json({
          data: createdUserId,
          message: 'user created'
        });
      } catch (error) {
        next(error);
      }
  });
}

module.exports = authApi;
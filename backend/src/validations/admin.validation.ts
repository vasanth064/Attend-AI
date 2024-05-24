import Joi from 'joi';

const createClient = Joi.object().keys({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    userData: Joi.object()
  })
});

export default {
  createClient
};

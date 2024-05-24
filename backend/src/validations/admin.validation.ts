import Joi from 'joi';

const createClient = Joi.object().keys({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    userData: Joi.object()
  })
});

const deleteClient = Joi.object().keys({
  params: Joi.object().keys({
    clientId: Joi.number().integer()
  })
});

const getAllClients = Joi.object().keys({
  params: Joi.object().keys({
    clientId: Joi.number().integer()
  })
});

export default {
  createClient,
  deleteClient,
  getAllClients
};

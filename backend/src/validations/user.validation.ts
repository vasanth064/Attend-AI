import { UserType as Role } from '@prisma/client';
import Joi from 'joi';
import { password } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid(Role.USER, Role.ADMIN)
  })
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer()
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string()
    })
    .min(1)
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer()
  })
};

const enrollUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      name: Joi.string().required(),
      inviteId: Joi.string().required()
    })
    .pattern(/.+/, Joi.any())
};

const getLogs = {
  body: Joi.object().keys({
    startTime: Joi.date().required(),
    endTime: Joi.date().required()
  })
}

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  enrollUser,
  getLogs
};

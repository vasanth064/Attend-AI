import Joi from 'joi';

const createLink = {
  body: Joi.object().keys({
    config: Joi.array().items(
      Joi.object().keys({
        label: Joi.string().required(),
        type: Joi.string()
          .valid('text', 'number', 'checkbox', 'radio', 'date', 'time', 'datetime', 'email')
          .required(),
        options: Joi.array()
          .items(
            Joi.object().keys({
              value: Joi.string().required(),
              label: Joi.string().required()
            })
          )
          .when('type', {
            is: 'radio',
            then: Joi.array().length(2).required(),
            otherwise: Joi.forbidden()
          })
          .when('type', {
            is: 'checkbox',
            then: Joi.array().min(2).required(),
            otherwise: Joi.forbidden()
          })
      })
    )
  })
};

const session = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    startDateTime: Joi.date().required(),
    endDateTime: Joi.date().required()
  })
};

const createMachine = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const deleteMachine = Joi.object().keys({
  params: Joi.object().keys({
    machineID: Joi.number().required()
  })
});

const approveUserCreation = Joi.object().keys({
  body: Joi.object().keys({
    userIDs: Joi.array().items(Joi.number()).required()
  })
});

const enrollUserToSession = Joi.object().keys({
  body: Joi.object().keys({
    sessionID: Joi.number().required(),
    userID: Joi.number().required()
  })
});

export default {
  createLink,
  session,
  createMachine,
  deleteMachine,
  enrollUserToSession,
  approveUserCreation
};

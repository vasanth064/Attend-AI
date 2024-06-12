import Joi from 'joi';

const createLink = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    config: Joi.array().items(
      Joi.object().keys({
        label: Joi.string().required(),
        type: Joi.string()
          .valid(
            'text',
            'email',
            'select',
            'checkbox',
            'color',
            'file',
            'url',
            'month',
            'week',
            'date',
            'datetime-local',
            'time'
          )
          .required(),
        options: Joi.when('type', {
          is: Joi.valid('select', 'checkbox'),
          then: Joi.array().min(2).required(),
          otherwise: Joi.forbidden()
        })
      })
    )
  })
};

const invitedUsers = {
  query: Joi.object().keys({
    inviteId: Joi.number().required(),
    status: Joi.string().valid('ENABLED', 'DISABLED').required()
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

const getLogsOfSession = Joi.object().keys({
  params: Joi.object().keys({
    sessionId: Joi.number().required()
  })
})

export default {
  createLink,
  session,
  createMachine,
  deleteMachine,
  enrollUserToSession,
  invitedUsers,
  approveUserCreation,
  getLogsOfSession,
};

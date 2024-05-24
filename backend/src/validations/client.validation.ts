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

export default {
  createLink,
  session
};

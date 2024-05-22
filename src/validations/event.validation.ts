import Joi from 'joi';

const createEvent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    date: Joi.date().required(),
    location: Joi.string().allow('', null)
  })
};

const getEvents = {
  query: Joi.object().keys({
    name: Joi.string(),
    date: Joi.date(),
    location: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1)
  })
};

const getEvent = {
  params: Joi.object().keys({
    eventId: Joi.number().integer().required()
  })
};

const updateEvent = {
  params: Joi.object().keys({
    eventId: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      date: Joi.date(),
      location: Joi.string()
    })
    .min(1) // Ensure at least one field is provided for update
};

const deleteEvent = {
  params: Joi.object().keys({
    eventId: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      date: Joi.date(),
      location: Joi.string()
    })
    .min(1)
};

const bookEvent = {
  params: Joi.object().keys({
    eventId: Joi.number().integer().required()
  })
};

export default {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  bookEvent
};

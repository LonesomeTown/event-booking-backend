import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import eventService from '../services/event.service';
import { Prisma, TokenType } from '@prisma/client';
import { tokenService } from '../services';

const createEvent = catchAsync(async (req, res) => {
  const eventData: Prisma.EventCreateInput = {
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
    location: req.body.location
  };

  const event = await eventService.createEvent(eventData);
  res.status(httpStatus.CREATED).send(event);
});

const getEvents = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    throw new Error('Authorization header is malformed');
  }

  const token = tokenParts[1];
  const refreshTokenData = await tokenService.verifyToken(token, TokenType.ACCESS);
  const { userId } = refreshTokenData;
  const filter = pick(req.query, ['title', 'date']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const events = await eventService.getEvents(userId, filter, options);
  res.send(events);
});

const getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  res.send(event);
});

const updateEvent = catchAsync(async (req, res) => {
  const eventData = pick(req.body, ['title', 'description', 'date', 'location']);
  const event = await eventService.updateEvent(req.params.eventId, eventData);
  res.send(event);
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventService.deleteEvent(req.params.eventId);
  res.status(httpStatus.NO_CONTENT).send();
});

const bookEvent = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    throw new Error('Authorization header is malformed');
  }

  const token = tokenParts[1];
  const refreshTokenData = await tokenService.verifyToken(token, TokenType.ACCESS);
  const { userId } = refreshTokenData;
  const event = await eventService.bookEvent(userId, req.params.eventId);
  res.send(event);
});

export default {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  bookEvent
};

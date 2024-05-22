import { Event, Prisma, UserEvent } from '@prisma/client';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

/**
 * Create an event
 * @param {Prisma.EventCreateInput} eventData
 * @returns {Promise<Event>}
 */
const createEvent = async (eventData: Prisma.EventCreateInput): Promise<Event> => {
  try {
    return await prisma.event.create({
      data: eventData
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating event');
  }
};

/**
 * Query for events
 * @param {Prisma.EventWhereInput} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<Event[]>}
 */
const getEvents = async (
  userId: number,
  filter: Prisma.EventWhereInput = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<(Event & { isBooked: boolean })[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const events = await prisma.event.findMany({
    where: filter,
    include: {
      Users: {
        where: {
          userId: userId
        },
        select: {
          eventId: true
        }
      }
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return events.map((event) => ({
    ...event,
    isBooked: event.Users.length > 0
  }));
};

/**
 * Get a single event by ID
 * @param {number} id
 * @returns {Promise<Event | null>}
 */
const getEventById = async (id: number): Promise<Event | null> => {
  try {
    const event = await prisma.event.findUnique({
      where: { id }
    });
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    return event;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving event');
  }
};

/**
 * Update an event
 * @param {number} id
 * @param {Prisma.EventUpdateInput} updateData
 * @returns {Promise<Event>}
 */
const updateEvent = async (id: number, updateData: Prisma.EventUpdateInput): Promise<Event> => {
  try {
    return await prisma.event.update({
      where: { id },
      data: updateData
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error updating event');
  }
};

/**
 * Delete an event
 * @param {number} id
 * @returns {Promise<Event>}
 */
const deleteEvent = async (id: number): Promise<Event> => {
  try {
    return await prisma.event.delete({
      where: { id }
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting event');
  }
};

/**
 * Book an event for a user
 * @param {number} userId - ID of the user booking the event
 * @param {number} eventId - ID of the event to be booked
 * @returns {Promise<UserEvent>}
 */
const bookEvent = async (userId: number, eventId: number): Promise<UserEvent> => {
  // Check if the event is available for booking
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  // Additional checks can be added here, like checking if the event is full

  // Create a booking
  const booking = await prisma.userEvent.create({
    data: {
      userId: userId,
      eventId: eventId,
      status: 'BOOKED'
    }
  });

  return booking;
};

export default {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  bookEvent
};

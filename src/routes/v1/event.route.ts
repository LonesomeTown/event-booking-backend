import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import eventController from '../../controllers/event.controller';
import eventValidation from '../../validations/event.validation';

const router = express.Router();

router
  .route('/')
  .post(auth('manageEvents'), validate(eventValidation.createEvent), eventController.createEvent)
  .get(validate(eventValidation.getEvents), eventController.getEvents);

router
  .route('/:eventId')
  .get(auth('getEvents'), validate(eventValidation.getEvent), eventController.getEvent)
  .patch(auth('manageEvents'), validate(eventValidation.updateEvent), eventController.updateEvent)
  .delete(auth('manageEvents'), validate(eventValidation.deleteEvent), eventController.deleteEvent);

router.route('/:eventId/book').post(validate(eventValidation.bookEvent), eventController.bookEvent);

export default router;

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management and retrieval
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create an event
 *     description: Only admins can create events.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - date
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *             example:
 *               name: Sample Event
 *               description: This is a sample event.
 *               date: '2024-05-18T00:00:00.000Z'
 *               location: Sample Location
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all events
 *     description: Only admins can retrieve all events.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 * /events/{id}:
 *   get:
 *     summary: Get an event
 *     description: Logged in users can fetch only their event information. Only admins can fetch other events.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an event
 *     description: Only admins can update events.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *             example:
 *               name: Updated Event
 *               description: Updated description of the event.
 *               date: '2024-05-20T00:00:00.000Z'
 *               location: Updated Location
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an event
 *     description: Only admins can delete events.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

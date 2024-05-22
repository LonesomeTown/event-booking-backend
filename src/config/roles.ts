import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['getEvents'],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'getEvents', 'manageEvents']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));

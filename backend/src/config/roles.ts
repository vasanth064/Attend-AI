import { UserType as Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: [],
  [Role.ADMIN]: ['getClients', 'manageClients', 'getUsers', 'manageUsers'],
  [Role.CLIENT]: ['manageUsers'],
  [Role.MACHINE]: ['markAttendance']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));

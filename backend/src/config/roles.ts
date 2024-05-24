import { UserType as Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['tradUser'],
  [Role.ADMIN]: ['getClients', 'manageClients', 'getUsers', 'manageUsers'],
  [Role.CLIENT]: ['manageUsers', 'manageInviteLinks', 'manageSessions'],
  [Role.MACHINE]: ['markAttendance']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));

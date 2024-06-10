import { describe, test, expect, jest } from '@jest/globals';
import prisma from '../../src/client';
import { clientService } from '../../src/services';
import { Enrollment, Prisma, Session, User } from '@prisma/client';
import ApiError from '../../src/utils/ApiError';
import httpStatus from 'http-status';

describe('Client service module', () => {
  describe('Invite Link Module', () => {
    describe('Create Link', () => {
      test('Should create a new link', async () => {
        const config = [
          {
            label: 'test',
            type: 'text'
          }
        ];
        const mockData = {
          id: 1,
          clientID: 1,
          name: 'test',
          config
        };
        jest.spyOn(prisma.inviteConfig, 'create').mockResolvedValueOnce(mockData);
        const newLink = await clientService.createLink(1, config, 'test');
        expect(newLink.name).toBe('test');
      });
    });
    describe('Get Link', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        config: [
          {
            label: 'test',
            type: 'text'
          }
        ]
      };
      test('Should get a link', async () => {
        jest.spyOn(prisma.inviteConfig, 'findUnique').mockResolvedValueOnce(mockData);
        const newLink = await clientService.getInviteLink(1);
        expect(newLink?.name).toBe('test');
      });
      test('Should throw an error if link does not exist', async () => {
        jest.spyOn(prisma.inviteConfig, 'findUnique').mockResolvedValueOnce(null);
        expect(clientService.getInviteLink(99)).rejects.toThrow('Invite link not found');
      });
    });
    describe('Get Links', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        config: [
          {
            label: 'test',
            type: 'text'
          }
        ]
      };
      test('Should get all links', async () => {
        jest.spyOn(prisma.inviteConfig, 'findMany').mockResolvedValueOnce([mockData]);
        const newLinks = await clientService.getInviteLinks(1);
        expect(newLinks[0].name).toBe('test');
      });
      test('Should throw an error if links does not exist', async () => {
        jest.spyOn(prisma.inviteConfig, 'findMany').mockResolvedValueOnce([]);
        expect(clientService.getInviteLinks(99)).rejects.toThrow('Invite links not found');
      });
    });
    describe('Delete Link', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        config: [
          {
            label: 'test',
            type: 'text'
          }
        ]
      };
      test('Should delete a link', async () => {
        jest.spyOn(prisma.inviteConfig, 'delete').mockResolvedValueOnce(mockData);
        jest.spyOn(prisma.inviteConfig, 'findUnique').mockResolvedValueOnce(mockData);
        await clientService.deleteLink(1);
        expect(prisma.inviteConfig.delete).toHaveBeenCalled();
      });

      test('Should throw an error if link does not exist for delete', async () => {
        jest.spyOn(prisma.inviteConfig, 'findUnique').mockResolvedValueOnce(null);
        expect(clientService.deleteLink(99)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Invite link not found')
        );
      });
    });
  });
  describe('Session Module', () => {
    describe('Create Session', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        startDateTime: new Date(),
        endDateTime: new Date()
      };
      test('should create a new session', async () => {
        jest.spyOn(prisma.session, 'create').mockResolvedValueOnce(mockData);
        const newSession = await clientService.createSession(1, 'test', new Date(), new Date());
        expect(newSession.name).toBe('test');
      });
    });
    describe('Get Session', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        startDateTime: new Date(),
        endDateTime: new Date()
      };
      test('should get all sessions', async () => {
        jest.spyOn(prisma.session, 'findMany').mockResolvedValueOnce([mockData]);
        const newSessions = await clientService.getSessions(1);
        expect(newSessions[0].name).toBe('test');
      });
      test('should throw an error if sessions does not exist', async () => {
        jest.spyOn(prisma.session, 'findMany').mockResolvedValueOnce([]);
        expect(clientService.getSessions(99)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Sessions not found')
        );
      });
    });
    describe('Get Session by ID', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        startDateTime: new Date(),
        endDateTime: new Date()
      };
      test('should get a session', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(mockData);
        const newSession = await clientService.getSession(1);
        expect(newSession?.name).toBe('test');
      });
      test('should throw an error if session does not exist', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(null);
        expect(clientService.getSession(99)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Session not found')
        );
      });
    });
    describe('Delete Session', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        startDateTime: new Date(),
        endDateTime: new Date()
      };
      test('delete a session', async () => {
        jest.spyOn(prisma.session, 'delete').mockResolvedValueOnce(mockData);
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(mockData);
        await clientService.deleteSession(1);
        expect(prisma.session.delete).toHaveBeenCalled();
      });
      test('should throw an error if session does not exist for delete', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(null);
        expect(clientService.deleteSession(99)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Session not found')
        );
      });
    });
    describe('Update Session', () => {
      const mockData = {
        id: 1,
        clientID: 1,
        name: 'test',
        startDateTime: new Date(),
        endDateTime: new Date()
      };
      test('update a session', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(mockData);
        jest.spyOn(prisma.session, 'update').mockResolvedValueOnce({
          id: 1,
          clientID: 1,
          name: 'test1',
          startDateTime: new Date(),
          endDateTime: new Date()
        });
        const newSession = await clientService.updateSession(1, 'test1', new Date(), new Date());
        expect(newSession?.name).toBe('test1');
      });
      test('should throw an error if session does not exist for update', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(null);
        expect(clientService.updateSession(1, 'test', new Date(), new Date())).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Session not found')
        );
      });
    });
  });

  describe('Machine Module', () => {
    describe('Create Machine', () => {
      const mockData: User = {
        id: 1,
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        userType: 'MACHINE',
        clientID: 1,
        userData: {},
        status: 'ENABLED'
      };
      test('create a new machine', async () => {
        jest.spyOn(prisma.user, 'create').mockResolvedValueOnce(mockData);
        const newMachine = await clientService.createMachine('test', 'test@test.com', 'test', 1);
        expect(newMachine.name).toBe('test');
      });
      test('should throw an error if user/machine already exists with same email', async () => {
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockData);
        expect(clientService.createMachine('test', 'test@test.com', 'test', 1)).rejects.toThrow(
          new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
        );
      });
    });
    describe('Get Machines', () => {
      const mockData: User = {
        id: 1,
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        userType: 'MACHINE',
        clientID: 1,
        userData: {},
        status: 'ENABLED'
      };
      test('get all machines', async () => {
        jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([mockData]);
        const newMachines = await clientService.getAllMachines(1);
        expect(newMachines[0].name).toBe('test');
      });
      test('should throw an error if machines does not exist', async () => {
        jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([]);
        expect(clientService.getAllMachines(99)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Machines not found')
        );
      });
    });
    describe('Delete Machine', () => {
      const mockData: User = {
        id: 1,
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        userType: 'MACHINE',
        clientID: 1,
        userData: {},
        status: 'ENABLED'
      };
      test('delete a machine', async () => {
        jest.spyOn(prisma.user, 'delete').mockResolvedValueOnce(mockData);
        await clientService.deleteMachineById(1);
        expect(prisma.user.delete).toHaveBeenCalled();
      });
    });
  });

  describe('Enrollment Module', () => {
    describe('Enroll User to Session', () => {
      const mockSessionData: Session = {
        id: 1,
        clientID: 1,
        name: 'test',
        startDateTime: new Date(),
        endDateTime: new Date()
      };
      const mockUserData: User = {
        id: 1,
        email: 'test@test.com',
        name: 'test',
        password: 'test',
        userType: 'USER',
        clientID: 1,
        userData: {},
        status: 'ENABLED'
      };
      const mockEnrollmentData: Enrollment = {
        id: 1,
        userID: 1,
        SessionID: 1
      };

      test('Should throw an error if session does not exist', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(null);
        expect(clientService.enrollUserToSession(1, 1, 1)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Session not found')
        );
      });
      test('Should throw an error if session does not belong to the client', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(mockSessionData);
        expect(clientService.enrollUserToSession(1, 1, 2)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'Session not found')
        );
      });
      test('Should throw an error if user does not exist', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(mockSessionData);
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
        expect(clientService.enrollUserToSession(1, 1, 1)).rejects.toThrow(
          new ApiError(httpStatus.NOT_FOUND, 'User not found')
        );
      });
      test('Should throw an error if enrollment already exists', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(mockSessionData);
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUserData);
        jest.spyOn(prisma.enrollment, 'findFirst').mockResolvedValueOnce(mockEnrollmentData);
        expect(clientService.enrollUserToSession(1, 1, 1)).rejects.toThrow(
          new ApiError(httpStatus.BAD_REQUEST, 'User already enrolled to this session')
        );
      });
      test('Should create a new enrollment', async () => {
        jest.spyOn(prisma.session, 'findUnique').mockResolvedValueOnce(mockSessionData);
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUserData);
        jest.spyOn(prisma.enrollment, 'findFirst').mockResolvedValueOnce(null);
        jest.spyOn(prisma.enrollment, 'create').mockResolvedValueOnce(mockEnrollmentData);
        const newEnrollment = await clientService.enrollUserToSession(1, 1, 1);
        expect(newEnrollment.userID).toBe(1);
      });
    });
    describe('Get Enrollment', () => {
      const mockData: Enrollment = {
        id: 1,
        userID: 1,
        SessionID: 1
      };
      test('get an enrollment', async () => {
        jest.spyOn(prisma.enrollment, 'findFirst').mockResolvedValueOnce(mockData);
        const newEnrollment = await clientService.getEnrollment(1, 1);
        expect(newEnrollment?.userID).toBe(1);
      });
    });
  });

  describe('Approve User Creations', () => {
    describe('Approve User Creations', () => {
      const mockData: Prisma.BatchPayload = {
        count: 1
      };
      test('approve user creations', async () => {
        jest.spyOn(prisma.user, 'updateMany').mockResolvedValueOnce(mockData);
        const result = await clientService.approveUserCreations([1], 1);
        expect(result).toEqual({ count: 1 });
      });
    });
  });
});

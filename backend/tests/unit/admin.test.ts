import { describe, beforeEach, test, expect, jest } from '@jest/globals';

import { userService } from '../../src/services';
import { adminService } from '../../src/services';

import prisma from '../../src/client';
import { User, Client, Prisma } from '@prisma/client';
jest.mock('../../src/utils/encryption');

jest.mock('../../src/config/config', () => ({
  env: 'test',
  port: 3000,
  jwt: {
    secret: 'your_mocked_jwt_secret',
    accessExpirationMinutes: 30,
    refreshExpirationDays: 30,
    resetPasswordExpirationMinutes: 10,
    verifyEmailExpirationMinutes: 10
  },
  email: {
    smtp: {
      host: 'smtp.example.com',
      port: 25,
      auth: {
        user: 'username',
        pass: 'password'
      }
    },
    from: 'noreply@example.com'
  },
  orion: {
    url: 'https://orion.example.com',
    apiKey: 'your_mocked_orion_api_key'
  }
}));

jest.mock('../../src/client', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    client: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn()
    },
    token: {
      findFirst: jest.fn(),
      delete: jest.fn()
    },
    $transaction: jest.fn()
  }
}));
describe("Admin service", () => {
  const mockUsers: User[] = [
    {
      id: 1,
      name: "User 1",
      email: "test@test.com",
      userType: "ADMIN",
      userData: {},
      clientID: 2
    } as User,
    {
      id: 2,
      name: "User 2",
      email: "test1@test.com",
      userType: "CLIENT",
      userData: {},
      clientID: 1
    } as User,
  ]
  const mockClients: Client[] = [
    {
      id: 1,
      name: 'Client 1',
    },
    {
      id: 2,
      name: 'Client 2',
    },
  ];

  afterEach(() => {
    jest.resetAllMocks();
  })
  describe("Creating a new client", () => {
    const user = {
      email: "test@test.com",
      password: "1234",
      name: "JJ",
      userType: "CLIENT",
      userData: {},

    }

    const client = {
      id: 1,
      name: user.name
    }

    test("should create a new client object", async () => {

      jest.spyOn(prisma.client, "create").mockResolvedValueOnce(client)
      expect(adminService.createClientObject(client.name)).resolves.toEqual({
        id: 1,
        name: user.name
      })

    })

    test("should return an error if user already exists", async () => {
      jest.spyOn(userService, "getUserByEmail").mockResolvedValueOnce(user as User);
      expect(adminService.createClient(user.email, user.password, user.name)).rejects.toEqual(
        new Error('A type of user already exists with this email')
      )
    })
    test("should create a new user", async () => {
      jest.spyOn(userService, "getUserByEmail").mockResolvedValueOnce(null);
      jest.spyOn(adminService, "createClientObject").mockResolvedValueOnce(client);

      jest.spyOn(prisma.user, "create").mockResolvedValueOnce({
        ...user,
        clientID: client.id
      } as User)
      const res = await adminService.createClient(user.email, user.password, user.name);
      expect(res.userType).toEqual("CLIENT");
      expect(res.clientID).toEqual(client.id);
    })
  })

  describe("Get Client User By Id -> clientId", () => {

    beforeEach(() => {
      jest.spyOn(prisma.client, 'findUnique').mockImplementation(({ where }) => {
        const client = mockClients.find((c) => c.id === where.id) || null;
        return { ...client } as Prisma.Prisma__ClientClient<Client, null>;
      });
    })

    test('should return the client with the specified id', async () => {
      const clientId = 1;
      const expectedClient = {
        id: 1,
        name: 'Client 1',
      };
      const result = await adminService.getClientById(clientId);
      expect(result).toEqual(expectedClient);
    });

    test('should return null if the client is not present', async () => {
      const clientId = 11;
      const result = await adminService.getClientById(clientId);
      expect(result).toEqual({});
    })
  })

  describe("Get ClientUser By Client Id", () => {
    test("should return error if there doesn't exist a client", async () => {
      jest.spyOn(adminService, "getClientById").mockResolvedValueOnce(null);
      expect(adminService.getClientUserByClientId(2)).rejects.toEqual(
        new Error('Client not found')
      );
    })

    test("should return an error if the client doesn't have any users", async () => {
      jest.spyOn(adminService, "getClientById").mockResolvedValueOnce(mockClients[0]);
      jest.spyOn(prisma.user, "findMany").mockResolvedValueOnce([]);
      expect(adminService.getClientUserByClientId(1)).rejects.toEqual(
        new Error('Client does not have any users')
      )
    })

    test("should return an error if the user is not a client", async () => {
      jest.spyOn(adminService, "getClientById").mockResolvedValueOnce(mockClients[1]);
      jest.spyOn(prisma.user, "findMany").mockResolvedValueOnce([mockUsers[0] as User]);
      expect(adminService.getClientUserByClientId(2)).rejects.toEqual(
        new Error('Client does not have any users')
      )
    })

    test("should return the Client User of particular client ID", async () => {
      const clientID = 1;
      jest.spyOn(adminService, "getClientById").mockResolvedValueOnce(mockClients[0]);
      jest.spyOn(prisma.user, "findMany").mockResolvedValueOnce([mockUsers[1]]);
      const res = await adminService.getClientUserByClientId(clientID);
      expect(res.clientID).toEqual(clientID);
      expect(res.userType).toEqual("CLIENT");
    })
  })

  describe("Get all clients", () => {
    test("should return all the clients", async () => {
      jest.spyOn(prisma.client, "findMany").mockResolvedValueOnce(mockClients);
      const res = await adminService.getAllClients();
      console.log(res);
      expect(res.length).toEqual(mockClients.length)
    })
  })
  describe("Delete the client by clientId", () => {
    const clientId = 1;
    test("Delete client helper", async () => {
      jest.spyOn(prisma, "$transaction").mockImplementation(async (callback) => callback(prisma));
      await adminService.deleteClientHelper(1);
      expect(prisma.client.delete).toHaveBeenCalled();
    })

    test("should return an error if the client is not found", () => {
      jest.spyOn(adminService, "getClientById").mockResolvedValueOnce(null);
      jest.spyOn(adminService, "getClientUserByClientId").mockResolvedValue({} as any);

      expect(adminService.deleteClient(clientId)).rejects.toEqual(
        new Error('Client not found')
      )
    })

    test("should delete the client based on its client Id", async () => {
      jest.spyOn(adminService, "getClientById").mockResolvedValueOnce(mockClients[0]);
      jest.spyOn(adminService, "getClientUserByClientId").mockResolvedValueOnce(mockUsers[1]);
      jest.spyOn(adminService, "deleteClientHelper").mockResolvedValueOnce(undefined);
      await adminService.deleteClient(clientId);
      expect(adminService.deleteClientHelper).toHaveBeenCalledWith(clientId)
    })

  })

})


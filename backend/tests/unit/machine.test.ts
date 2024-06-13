import { describe, test, expect, jest } from '@jest/globals';
import prisma from '../../src/client';
import { machineService } from '../../src/services';

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

describe('Unit tests for machine service', () => {
  describe('Get Sessions for the particular machine', () => {
    test('should return the sessions that are present above the current date', async () => {
      jest.spyOn(prisma.session, 'findMany').mockResolvedValueOnce([]);
      const res = await machineService.upComingSessions(1);
      expect(prisma.session.findMany).toHaveBeenCalled();
      expect(typeof res).toBe(typeof []);
    });
  });
});

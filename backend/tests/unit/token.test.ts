import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import config from '../../src/config/config';
import prisma from '../../src/client';

import jwt from "jsonwebtoken"
import moment from "moment"
import { Token, TokenType } from '@prisma/client';
import { tokenService } from '../../src/services';
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

describe("Token module unit tests", () => {

  describe("Generate new token", () => {
    test("should return the new token provided the payload", () => {
      const userId = 1;
      const expires = moment();
      const type = TokenType.REFRESH;
      const secret = config.jwt.secret;

      const res = tokenService.generateToken(userId, expires, type, secret);
      expect(res).toBeDefined();
    })
  })

  describe("Save the token", () => {
    test("Create a token in the tokens table which should save the token", async () => {
      const token = "23456789";
      const userId = 1;
      const expires = moment();
      const type = TokenType.REFRESH;

      jest.spyOn(prisma.token, "create").mockResolvedValue({
        userId,
        token,
        expires: expires.toDate(),
        type,
        blacklisted: false
      } as unknown as Token)

      const res = await tokenService.saveToken(token, userId, expires, type);
      expect(res).toBeTruthy();
      expect(res.type).toEqual(TokenType.REFRESH);
    })
  })

  describe("Verify the token", () => {
    const token = "23456789";
    const userId = 1;
    const expires = moment();
    const type = TokenType.REFRESH;
    const mockPayload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type: type
    }

    beforeEach(() => {
      jest.spyOn(jwt, "verify").mockResolvedValueOnce(mockPayload as never);
    })
    test("verifies the token and throws an error if it is not a valid token", async () => {

      jest.spyOn(prisma.token, "findFirst").mockResolvedValueOnce(null);

      expect(tokenService.verifyToken(token, type)).rejects.toEqual(
        new Error('Token not found')
      )
    })
    test("verifies the token and returns the token data", async () => {
      jest.spyOn(prisma.token, "findFirst").mockResolvedValueOnce({
        userId,
        token,
        expires: expires.toDate(),
        type,
        blacklisted: false
      } as unknown as Token)

      const res = await tokenService.verifyToken(token, type);
      expect(res.type).toEqual(TokenType.REFRESH);
      expect(res.userId).toBe(1);
    })
  })

  describe("Generate new auth tokens", () => {
    const token = "23456789";
    const userId_ = 1;
    const expires = moment();
    const type = TokenType.ACCESS;
    const sampleToken = {
      userId: userId_,
      token,
      expires: expires.toDate(),
      type,
      blacklisted: false
    } as unknown as Token;
    test("should return new auth tokens", async () => {

      jest.spyOn(tokenService, "saveToken").mockResolvedValueOnce(sampleToken);
      const res = await tokenService.generateAuthTokens({ id: 1 });
      expect(res.access).toBeTruthy();
      expect(res.refresh).toBeTruthy();
    })
  })
})



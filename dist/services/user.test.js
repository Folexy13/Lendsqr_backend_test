"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const crypto_js_1 = require("crypto-js");
const services_1 = require("../services");
const database_1 = __importDefault(require("../database"));
describe("UserService", () => {
  let db;
  let userService;
  beforeAll(() => {
    userService = new services_1.UserService(database_1.default);
  });
  afterAll(async () => {
    await db.destroy();
  });
  describe("getAll", () => {
    it("should return an array of users", async () => {
      const result = await userService.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
  describe("getById", () => {
    it("should return a user by ID", async () => {
      // Insert a user into the database
      const [id] = await db("users").insert({
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      });
      const user = await userService.getById(id);
      expect(user === null || user === void 0 ? void 0 : user.name).toBe(
        "John Doe"
      );
      expect(user === null || user === void 0 ? void 0 : user.email).toBe(
        "john@example.com"
      );
      expect(
        user === null || user === void 0 ? void 0 : user.password
      ).toBeUndefined();
    });
    it("should return null for non-existent user ID", async () => {
      const user = await userService.getById(99999);
      expect(user).toBeNull();
    });
  });
  describe("create", () => {
    it("should create a new user", async () => {
      const newUser = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password",
      };
      const createdUser = await userService.create(newUser);
      expect(createdUser.name).toBe("Jane Doe");
      expect(createdUser.email).toBe("jane@example.com");
      expect(createdUser.password).toBeUndefined();
      expect(createdUser.wallet).toBe(0);
    });
    it("should throw a ConflictError for an existing email address", async () => {
      const existingUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      };
      await db("users").insert(existingUser);
      const newUser = {
        name: "Jane Doe",
        email: "john@example.com",
        password: "password",
      };
      await expect(userService.create(newUser)).rejects.toThrowError(
        exceptions_1.ConflictError
      );
    });
  });
  describe("login", () => {
    it("should log in a user with correct credentials", async () => {
      const existingUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      };
      await db("users").insert(
        Object.assign(Object.assign({}, existingUser), {
          password: (0, crypto_js_1.SHA256)(existingUser.password).toString(),
        })
      );
      const loggedInUser = await userService.login(
        "john@example.com",
        "password"
      );
      expect(loggedInUser.name).toBe("John Doe");
      expect(loggedInUser.email).toBe("john@example.com");
      expect(loggedInUser.password).toBeUndefined();
    });
    it("should throw a NotFoundError for a non-existent email address", async () => {
      await expect(
        userService.login("nonexistent@example.com", "password")
      ).rejects.toThrowError(exceptions_1.NotFoundError);
    });
    it("should throw an UnauthorizedError for incorrect password", async () => {
      const existingUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      };
      await db("users").insert(
        Object.assign(Object.assign({}, existingUser), {
          password: (0, crypto_js_1.SHA256)(existingUser.password).toString(),
        })
      );
      await expect(
        userService.login("john@example.com", "wrongpassword")
      ).rejects.toThrowError(exceptions_1.UnauthorizedError);
    });
  });
});

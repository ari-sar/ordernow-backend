const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');
const User = require('../models/User');       
const bcrypt = require('bcrypt');            

// 1. Mock the dependencies so we don't need a real DB
jest.mock('../models/User');
jest.mock('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes); // Mount the routes for testing

describe('Auth Routes (Unit Tests)', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  // ==========================================
  // REGISTER TESTS
  // ==========================================
  describe('POST /register', () => {
    
    it('should register a user successfully (201)', async () => {
      // Mock User.create to return a dummy user
      User.create.mockResolvedValue({ id: 1, username: 'newuser' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newuser', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ message: "Success" });
      expect(User.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if database creation fails', async () => {
      // Mock User.create to throw an error (e.g. duplicate user)
      User.create.mockRejectedValue(new Error('Duplicate entry'));

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'existing', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ==========================================
  // LOGIN TESTS
  // ==========================================
  describe('POST /login', () => {

    it('should login successfully with correct credentials (200)', async () => {
      // 1. Mock User Found
      const mockUser = { 
        id: 1, 
        username: 'testuser', 
        password: 'hashed_password_from_db' 
      };
      User.findOne.mockResolvedValue(mockUser);

      // 2. Mock Password Match (bcrypt)
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'realpassword' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Login successful");
      expect(res.body.user).toEqual({ id: 1, username: 'testuser' });
    });

    it('should return 401 if user does not exist', async () => {
      // Mock User Not Found (return null)
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'wronguser', password: 'password123' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toEqual("Invalid Credentials");
    });

    it('should return 401 if password does not match', async () => {
      // 1. Mock User Found
      User.findOne.mockResolvedValue({ 
        id: 1, 
        username: 'testuser', 
        password: 'hashed_password' 
      });

      // 2. Mock Password Mismatch (false)
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toEqual("Invalid Credentials");
    });

    it('should return 500 if server error occurs', async () => {
      // Force an error in FindOne
      User.findOne.mockRejectedValue(new Error('Database offline'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'test', password: 'test' });

      expect(res.statusCode).toEqual(500);
    });
  });

});
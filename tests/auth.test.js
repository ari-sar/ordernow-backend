const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth'); // Adjust path to your auth route file
const { sequelize } = require('../config/db.mysql');
const User = require('../models/User');

// Setup a temporary app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Database Cleanup before/after tests
beforeAll(async () => {
  await sequelize.sync({ force: true }); // WARNING: Clears Test DB
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API Endpoints', () => {
  
  // Test 1: Successful Registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  // Test 2: Prevent Duplicate Users
  it('should not allow duplicate usernames', async () => {
    // Try registering 'testuser' again
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(400); // Expect failure
  });

  // Test 3: Successful Login
  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  // Test 4: Invalid Login
  it('should reject wrong passwords', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});
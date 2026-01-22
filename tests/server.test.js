const request = require('supertest');
const mongoose = require('mongoose');
const { sequelize } = require('../config/db.mysql'); // Adjust path to your MySQL config
const app = require('../index'); // Import your app

describe('Server Integration Tests', () => {

  // Cleanup: Close DB connections after tests to prevent freezing
  afterAll(async () => {
    await mongoose.connection.close();
    await sequelize.close(); // Close MySQL connection
  });

  // Test 1: Health Check / 404 Handling
  // Since you don't have a root '/' route, it should return 404,
  // proving the server is up and Express is handling requests.
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toEqual(404);
  });

  // Test 2: Verify Products Route is Mounted
  // We expect a 200 (Empty list) or 200 (List of products)
  it('should access the GET /api/products route', async () => {
    const res = await request(app).get('/api/products');
    
    // If connected to real DB, it might return data. 
    // If DB is empty, it returns []. 
    // Both imply success (200).
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test 3: Verify Auth Route is Mounted
  // Trying to login with bad data should return 401 or 400 (not 404)
it('should accept requests to /api/auth endpoints', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'fake', password: 'fake' });
    
    // Debugging: Log what the server actually returned
    if (res.statusCode === 404) {
        console.log("404 Error - Route not found. Check routes/auth.js export.");
    }
    
    expect(res.statusCode).not.toEqual(404);
});

});
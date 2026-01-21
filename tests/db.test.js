const { sequelize } = require('../config/db.mysql');

describe('MySQL Connection', () => {
  it('should authenticate the connection successfully', async () => {
    try {
      await sequelize.authenticate();
      expect(true).toBe(true);
    } catch (err) {
      fail('Connection failed: ' + err.message);
    }
  });
});
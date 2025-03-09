const db = require('../cofing/db');
const calculateDistance = require("../utils/calculateDistance")

// Add School API Controller
const addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate Input
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ message: 'Latitude and longitude must be numbers' });
    }

    // Insert Data into Database
    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error('Error adding school:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
};



// List Schools API Controller
const listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate Input
  if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ message: 'Latitude and longitude must be valid numbers' });
  }

  // Fetch all schools from the database
  const sql = 'SELECT * FROM schools';
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
      }

      // Calculate distance for each school and sort by proximity
      const schoolsWithDistance = results.map((school) => {
          const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
          return { ...school, distance: distance.toFixed(2) }; // Add distance property
      });

      // Sort schools by distance (ascending order)
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      res.status(200).json({ schools: schoolsWithDistance });
  });
};
module.exports = { addSchool , listSchools };

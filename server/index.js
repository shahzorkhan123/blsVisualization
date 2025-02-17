import express from 'express';
import { loadOnetData, getAvailableOccupations, getTaskDataForOccupation } from './onetDataService.js'; // Adjust the path as necessary

const app = express();
const port = 3000;

// Load ONET data when the server starts
loadOnetData().catch(err => {
  console.error('Failed to load ONET data:', err);
  process.exit(1);
});

// Define the /api/occupations route
app.get('/api/occupations', (req, res) => {
  try {
    const occupations = getAvailableOccupations();
    res.json(occupations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch occupations' });
  }
});

// Define the /api/task-data/:occupation route
app.get('/api/task-data/:occupation', (req, res) => {
  try {
    const occupation = req.params.occupation;
    const taskData = getTaskDataForOccupation(occupation);
    res.json(taskData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task data for the occupation' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



const issuesRouter = require('./routes/issues');
const analyticsRoutes = require('./routes/analytics');

// Routes
app.use('/api/issues', issuesRouter);
app.use('/api/analytics', analyticsRoutes); 
const getHealth = (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getHealth,
};

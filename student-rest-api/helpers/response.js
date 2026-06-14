module.exports = {
  success: (res, data, message = 'Success', status = 200) =>
    res.status(status).json({ success: true, message, data }),

  error: (res, message, status = 400, errors = null) =>
    res.status(status).json({ success: false, error: message, ...(errors && { errors }) })
};

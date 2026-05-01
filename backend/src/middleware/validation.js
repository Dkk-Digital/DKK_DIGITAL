// Input validation middleware for common fields
export const validateCreateInquiry = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // Check required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, email, subject, message',
    });
  }

  // Sanitize inputs
  req.body.name = String(name).trim().substring(0, 100);
  req.body.email = String(email).trim().toLowerCase();
  req.body.subject = String(subject).trim().substring(0, 200);
  req.body.message = String(message).trim().substring(0, 5000);
  if (req.body.phone) req.body.phone = String(req.body.phone).trim();
  if (req.body.serviceInterest) req.body.serviceInterest = String(req.body.serviceInterest).trim();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  next();
};

export const validateCreateService = (req, res, next) => {
  const { title, description, shortDescription, price, category } = req.body;

  if (!title || !description || !shortDescription || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Sanitize and validate inputs
  req.body.title = String(title).trim().substring(0, 200);
  req.body.description = String(description).trim().substring(0, 5000);
  req.body.shortDescription = String(shortDescription).trim().substring(0, 500);
  req.body.price = Number(price);
  req.body.category = String(category).trim();

  // Validate price
  if (isNaN(req.body.price) || req.body.price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a valid positive number',
    });
  }

  // Validate category
  const validCategories = [
    'SEO',
    'Social Media Marketing',
    'PPC',
    'Content Marketing',
    'Email Marketing',
    'Web Design',
    'Other',
  ];
  if (!validCategories.includes(req.body.category)) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${validCategories.join(', ')}`,
    });
  }

  next();
};

export const validateCreateProject = (req, res, next) => {
  const { title, description, service, budget } = req.body;

  if (!title || !description || !service || !budget) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Sanitize and validate inputs
  req.body.title = String(title).trim().substring(0, 200);
  req.body.description = String(description).trim().substring(0, 5000);
  req.body.service = String(service).trim();
  req.body.budget = Number(budget);

  // Validate budget
  if (isNaN(req.body.budget) || req.body.budget < 0) {
    return res.status(400).json({
      success: false,
      message: 'Budget must be a valid positive number',
    });
  }

  next();
};

export const validateMessage = (req, res, next) => {
  const { recipientId, message } = req.body;

  if (!recipientId || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide recipientId and message',
    });
  }

  // Sanitize inputs
  req.body.message = String(message).trim().substring(0, 10000);

  // Validate message is not empty after trimming
  if (req.body.message.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Message cannot be empty',
    });
  }

  next();
};

// Sanitization helper function
export const sanitizeString = (str, maxLength = 255) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .substring(0, maxLength)
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, ''); // Remove javascript: protocol
};

// XSS prevention middleware
export const preventXSS = (req, res, next) => {
  // Sanitize all string fields in request body
  Object.keys(req.body || {}).forEach((key) => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = sanitizeString(req.body[key]);
    }
  });

  // Sanitize all string fields in request query
  Object.keys(req.query || {}).forEach((key) => {
    if (typeof req.query[key] === 'string') {
      req.query[key] = sanitizeString(req.query[key]);
    }
  });

  next();
};

export default {
  validateCreateInquiry,
  validateCreateService,
  validateCreateProject,
  validateMessage,
  preventXSS,
  sanitizeString,
};

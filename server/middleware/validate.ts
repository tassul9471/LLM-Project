import { Request, Response, NextFunction } from 'express';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ success: false, error: 'Full name is required (at least 2 characters).' });
    return;
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ success: false, error: 'A valid email address is required.' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ success: false, error: 'A valid email address is required.' });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ success: false, error: 'Password is required.' });
    return;
  }

  next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { name, category, description, features, benefits, audience } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ success: false, error: 'Product name is required.' });
    return;
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    res.status(400).json({ success: false, error: 'Product category is required.' });
    return;
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    res.status(400).json({ success: false, error: 'Product description is required.' });
    return;
  }

  if (!features || typeof features !== 'string' || !features.trim()) {
    res.status(400).json({ success: false, error: 'Key features are required.' });
    return;
  }

  if (!benefits || typeof benefits !== 'string' || !benefits.trim()) {
    res.status(400).json({ success: false, error: 'Product benefits are required.' });
    return;
  }

  if (!audience || typeof audience !== 'string' || !audience.trim()) {
    res.status(400).json({ success: false, error: 'Target audience is required.' });
    return;
  }

  next();
};

export const validateAdGenerate = (req: Request, res: Response, next: NextFunction): void => {
  const { name, description, features, benefits, audience, tone, platform, contentLength, adType } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ success: false, error: 'Product name is required for ad generation.' });
    return;
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    res.status(400).json({ success: false, error: 'Product description is required for ad generation.' });
    return;
  }

  if (!features || typeof features !== 'string' || !features.trim()) {
    res.status(400).json({ success: false, error: 'Product features are required for ad generation.' });
    return;
  }

  if (!benefits || typeof benefits !== 'string' || !benefits.trim()) {
    res.status(400).json({ success: false, error: 'Product benefits are required for ad generation.' });
    return;
  }

  if (!audience || typeof audience !== 'string' || !audience.trim()) {
    res.status(400).json({ success: false, error: 'Target audience is required for ad generation.' });
    return;
  }

  const validTones = ['Professional', 'Friendly', 'Modern', 'Creative', 'Persuasive', 'Casual'];
  if (tone && !validTones.includes(tone)) {
    res.status(400).json({ success: false, error: `Invalid tone. Allowed: ${validTones.join(', ')}` });
    return;
  }

  const validPlatforms = ['Social Media', 'Website', 'Email', 'E-commerce', 'General Advertisement'];
  if (platform && !validPlatforms.includes(platform)) {
    res.status(400).json({ success: false, error: `Invalid platform. Allowed: ${validPlatforms.join(', ')}` });
    return;
  }

  next();
};

export const validateIdParam = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || !HEX_ID_REGEX.test(id)) {
    res.status(400).json({ success: false, error: 'Invalid document ID format.' });
    return;
  }
  next();
};

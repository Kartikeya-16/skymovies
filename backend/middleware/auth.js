const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route. Please login.'
      });
    }
    
    try {
      // First, decode the token without verification to check its structure
      let decoded;
      let isClerkToken = false;
      
      try {
        // Decode without verification first
        decoded = jwt.decode(token);
        console.log('🔍 Decoded token:', { 
          sub: decoded?.sub, 
          iss: decoded?.iss,
          email: decoded?.email,
          hasId: !!decoded?.id 
        });
        
        // Check if it's a Clerk token
        if (decoded && decoded.sub && decoded.iss && decoded.iss.includes('clerk')) {
          isClerkToken = true;
          console.log('✅ Detected Clerk token');
        }
      } catch (decodeError) {
        console.error('❌ Error decoding token:', decodeError.message);
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token format'
        });
      }
      
      if (!isClerkToken) {
        // Verify as custom JWT token
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log('✅ Verified custom JWT token');
        } catch (verifyError) {
          console.error('❌ JWT verification failed:', verifyError.message);
          return res.status(401).json({
            status: 'error',
            message: 'Not authorized. Invalid token.'
          });
        }
      }
      
      // Get user ID from token
      const userId = decoded.id || decoded.sub;
      
      if (!userId) {
        console.error('❌ No user ID in token');
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token format'
        });
      }
      
      // For Clerk tokens, we might need to create/find user by Clerk ID
      if (isClerkToken) {
        console.log('🔍 Looking up user with Clerk ID:', userId);
        
        // Try to find user by Clerk ID or email
        let user = await User.findOne({ clerkId: userId }).select('-password');
        
        if (!user && decoded.email) {
          console.log('🔍 User not found by Clerk ID, trying email:', decoded.email);
          // Try to find by email
          user = await User.findOne({ email: decoded.email }).select('-password');
          
          // If found, update with Clerk ID
          if (user) {
            console.log('✅ Found user by email, updating with Clerk ID');
            user.clerkId = userId;
            await user.save();
          } else {
            // Create a new user from Clerk data
            console.log('✅ Creating new user from Clerk data');
            user = await User.create({
              clerkId: userId,
              email: decoded.email,
              name: decoded.name || decoded.email.split('@')[0],
              isActive: true,
              role: 'user'
            });
          }
        }
        
        if (!user) {
          console.error('❌ Could not find or create user');
          return res.status(401).json({
            status: 'error',
            message: 'User not found'
          });
        }
        
        if (!user.isActive) {
          console.error('❌ User is inactive');
          return res.status(401).json({
            status: 'error',
            message: 'User account is inactive'
          });
        }
        
        console.log('✅ User authenticated:', user.email);
        req.user = user;
      } else {
        // Custom JWT - get user from database
        console.log('🔍 Looking up user with custom JWT ID:', userId);
        req.user = await User.findById(userId).select('-password');
        
        if (!req.user || !req.user.isActive) {
          console.error('❌ User not found or inactive');
          return res.status(401).json({
            status: 'error',
            message: 'User no longer exists or is inactive'
          });
        }
        
        console.log('✅ User authenticated:', req.user.email);
      }
      
      next();
    } catch (error) {
      console.error('❌ Token verification error:', error.message);
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized. Invalid token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error in authentication'
    });
  }
};

// Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};


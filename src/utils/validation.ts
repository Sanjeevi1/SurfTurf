// Validation utility functions for form validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters long";
  return null;
};

// Phone number validation
export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required";
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
  return null;
};

// Username validation
export const validateUsername = (username: string): string | null => {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters long";
  if (username.length > 20) return "Username must be less than 20 characters";
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) return "Username can only contain letters, numbers, and underscores";
  return null;
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return null;
};

// Number validation
export const validateNumber = (value: string, fieldName: string, min?: number, max?: number): string | null => {
  if (!value) return `${fieldName} is required`;
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  if (min !== undefined && num < min) return `${fieldName} must be at least ${min}`;
  if (max !== undefined && num > max) return `${fieldName} must be at most ${max}`;
  return null;
};

// Positive number validation
export const validatePositiveNumber = (value: string, fieldName: string): string | null => {
  const error = validateNumber(value, fieldName, 0);
  if (error) return error;
  const num = parseFloat(value);
  if (num <= 0) return `${fieldName} must be greater than 0`;
  return null;
};

// Text length validation
export const validateTextLength = (value: string, fieldName: string, min: number, max: number): string | null => {
  if (!value) return `${fieldName} is required`;
  if (value.length < min) return `${fieldName} must be at least ${min} characters long`;
  if (value.length > max) return `${fieldName} must be less than ${max} characters`;
  return null;
};

// Date validation
export const validateDate = (date: string, fieldName: string): string | null => {
  if (!date) return `${fieldName} is required`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `Please enter a valid ${fieldName.toLowerCase()}`;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj < today) return `${fieldName} cannot be in the past`;
  return null;
};

// Time validation
export const validateTime = (time: string, fieldName: string): string | null => {
  if (!time) return `${fieldName} is required`;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) return `Please enter a valid ${fieldName.toLowerCase()}`;
  return null;
};

// Time range validation
export const validateTimeRange = (startTime: string, endTime: string): string | null => {
  if (!startTime || !endTime) return null;
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  if (start >= end) return "End time must be after start time";
  return null;
};

// Coordinate validation
export const validateLatitude = (lat: string): string | null => {
  if (!lat) return "Latitude is required";
  const num = parseFloat(lat);
  if (isNaN(num)) return "Latitude must be a valid number";
  if (num < -90 || num > 90) return "Latitude must be between -90 and 90";
  return null;
};

export const validateLongitude = (lng: string): string | null => {
  if (!lng) return "Longitude is required";
  const num = parseFloat(lng);
  if (isNaN(num)) return "Longitude must be a valid number";
  if (num < -180 || num > 180) return "Longitude must be between -180 and 180";
  return null;
};

// Image validation
export const validateImages = (images: string[]): string | null => {
  if (!images || images.length === 0) return "At least one image is required";
  return null;
};

// Slot validation
export const validateSlot = (slot: any): string | null => {
  if (!slot.date) return "Date is required";
  if (!slot.startTime) return "Start time is required";
  if (!slot.endTime) return "End time is required";
  if (!slot.maxPlayers || slot.maxPlayers <= 0) return "Max players must be greater than 0";
  
  const timeError = validateTimeRange(slot.startTime, slot.endTime);
  if (timeError) return timeError;
  
  return null;
};

// Generic form validation
export const validateForm = (data: any, rules: { [key: string]: (value: any) => string | null }): ValidationResult => {
  const errors: ValidationError[] = [];
  
  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Display validation errors
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : null;
};

import { useState, useCallback } from 'react';

const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }

    return '';
  }, [validationRules, values]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
};

// Common validation rules
export const validationRules = {
  // Generic required rule
  required: (value) => !value && 'This field is required',
  
  // Field-specific required rules
  requiredName: (value) => !value && 'Name is required',
  requiredEmail: (value) => !value && 'Email is required',
  requiredPassword: (value) => !value && 'Password is required',
  requiredDate: (value) => !value && 'Date is required',
  requiredTime: (value) => !value && 'Time is required',
  requiredLocation: (value) => !value && 'Location is required',
  requiredCharity: (value) => !value && 'Please select a charity',
  requiredAmount: (value) => !value && 'Amount is required',
  
  // Other validation rules
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? 'Invalid email address' : '';
  },
  minLength: (length) => (value) => 
    value && value.length < length ? `Must be at least ${length} characters` : '',
  maxLength: (length) => (value) => 
    value && value.length > length ? `Must be less than ${length} characters` : '',
  numeric: (value) => 
    value && isNaN(value) ? 'Must be a number' : '',
  positive: (value) => 
    value && Number(value) <= 0 ? 'Must be a positive number' : '',
  future: (value) => {
    const date = new Date(value);
    return date <= new Date() ? 'Date must be in the future' : '';
  },
  passwordMatch: (value, values) => 
    value !== values.password ? 'Passwords do not match' : ''
};

export default useFormValidation;

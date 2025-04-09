import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFormValidation, { validationRules } from '../hooks/useFormValidation';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/CreateInvitation.css';

const CreateInvitation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inviteeEmails, setInviteeEmails] = useState(['']);

  const handleEmailChange = (index, value) => {
    const newEmails = [...inviteeEmails];
    newEmails[index] = value;
    setInviteeEmails(newEmails);
  };

  const addEmailField = () => {
    setInviteeEmails([...inviteeEmails, '']);
  };

  const removeEmailField = (index) => {
    const newEmails = inviteeEmails.filter((_, i) => i !== index);
    setInviteeEmails(newEmails);
  };

  const charities = [
    "Save the Children",
    "UNICEF",
    "World Wildlife Fund",
    "Make-A-Wish Foundation",
    "St. Jude Children's Research Hospital"
  ];

  const validations = {
    childName: [
      validationRules.requiredName,
      validationRules.minLength(2),
      validationRules.maxLength(50)
    ],
    eventDate: [
      validationRules.requiredStartTime,
      validationRules.futureStart
    ],
    eventEndTime: [
      validationRules.requiredEndTime,
      validationRules.futureEnd
    ],
    eventLocation: [
      validationRules.requiredLocation,
      validationRules.minLength(5)
    ],
    charityName: [
      validationRules.requiredCharity
    ],
    giftFundTarget: [
      validationRules.requiredAmount,
      validationRules.numeric,
      validationRules.positive
    ]
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm
  } = useFormValidation({
    childName: '',
    eventDate: '',
    eventEndTime: '',
    eventLocation: '',
    charityName: '',
    giftFundTarget: ''
  }, validations);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    // Prepare invitation data
    const formData = {
      childName: values.childName.trim(),
      eventDate: new Date(values.eventDate).toISOString(),
      eventEndTime: new Date(values.eventEndTime).toISOString(),
      eventLocation: values.eventLocation.trim(),
      charityName: values.charityName,
      giftFundTarget: Number(values.giftFundTarget),
      inviteeEmails: inviteeEmails.filter(email => email.trim() !== '')
    };

    console.log('Submitting invitation data:', formData);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        resetForm();
        navigate(`/invitation/${data._id}`);
      } else {
        console.error('Server error:', data);
        throw new Error(data.message || 'Failed to create invitation');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <div className="create-invitation">
      <h1>Create Party Invitation</h1>
      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="childName">Child's Name</label>
            <input
              type="text"
              id="childName"
              name="childName"
              value={values.childName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('childName') ? 'error' : ''}
            />
            {getFieldError('childName') && (
              <div className="field-error">{errors.childName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="eventDate">Party Start Time</label>
            <input
              type="datetime-local"
              id="eventDate"
              name="eventDate"
              value={values.eventDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('eventDate') ? 'error' : ''}
            />
            {getFieldError('eventDate') && (
              <div className="field-error">{errors.eventDate}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="eventEndTime">Party End Time</label>
            <input
              type="datetime-local"
              id="eventEndTime"
              name="eventEndTime"
              value={values.eventEndTime}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('eventEndTime') ? 'error' : ''}
            />
            {getFieldError('eventEndTime') && (
              <div className="field-error">{errors.eventEndTime}</div>
            )}
          </div>

          <div className="form-group">
            <label>Invitee Emails</label>
            {inviteeEmails.map((email, index) => (
              <div key={index} className="email-input-group" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="Enter guest email"
                  className="email-input"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeEmailField(index)}
                    className="remove-email-btn"
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEmailField}
              className="add-email-btn"
              style={{
                padding: '5px 10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Add Another Email
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="eventLocation">Location</label>
            <input
              type="text"
              id="eventLocation"
              name="eventLocation"
              value={values.eventLocation}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('eventLocation') ? 'error' : ''}
            />
            {getFieldError('eventLocation') && (
              <div className="field-error">{errors.eventLocation}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="charityName">Select Charity</label>
            <select
              id="charityName"
              name="charityName"
              value={values.charityName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('charityName') ? 'error' : ''}
            >
              <option value="">Select a charity...</option>
              {charities.map(charity => (
                <option key={charity} value={charity}>{charity}</option>
              ))}
            </select>
            {getFieldError('charityName') && (
              <div className="field-error">{errors.charityName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="giftFundTarget">Gift Fund Target ($)</label>
            <input
              type="number"
              id="giftFundTarget"
              name="giftFundTarget"
              value={values.giftFundTarget}
              onChange={handleChange}
              onBlur={handleBlur}
              min="10"
              className={getFieldError('giftFundTarget') ? 'error' : ''}
            />
            {getFieldError('giftFundTarget') && (
              <div className="field-error">{errors.giftFundTarget}</div>
            )}
            <small>10% of donations will go towards this gift fund</small>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner size="small" /> : 'Create Invitation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInvitation;

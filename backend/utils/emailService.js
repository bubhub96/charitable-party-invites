const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Send invitation email
const sendInvitationEmail = async (to, invitationData) => {
  const { childName, eventDate, eventEndTime, eventLocation, charityName } = invitationData;
  
  const startTime = new Date(eventDate).toLocaleString();
  const endTime = new Date(eventEndTime).toLocaleString();

  const msg = {
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: `You're Invited to ${childName}'s Party!`,
    html: `
      <h1>You're Invited! 🎉</h1>
      <p>You're invited to ${childName}'s party!</p>
      <div style="margin: 20px 0;">
        <p><strong>When:</strong> ${startTime} to ${endTime}</p>
        <p><strong>Where:</strong> ${eventLocation}</p>
        <p><strong>Supporting:</strong> ${charityName}</p>
      </div>
      <p>Instead of bringing gifts, we're collecting donations for ${charityName}.</p>
      <p>Click the link below to RSVP and contribute to the gift fund:</p>
      <a href="${process.env.FRONTEND_URL}/invitation/${invitationData._id}" 
         style="display: inline-block; 
                padding: 10px 20px; 
                background-color: #4CAF50; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0;">
        View Invitation & RSVP
      </a>
    `
  };

  try {
    const response = await resend.emails.send(msg);
    console.log('Invitation email sent successfully:', {
      id: response.id,
      to,
      subject: msg.subject
    });
    return { success: true, messageId: response.id };
  } catch (error) {
    console.error('Error sending invitation email:', {
      error: error.message,
      errorCode: error.statusCode,
      data: { to, childName, eventLocation }
    });
    throw {
      message: 'Failed to send invitation email',
      originalError: error.message,
      statusCode: error.statusCode
    };
  }
};

// Send RSVP confirmation email
const sendRsvpConfirmationEmail = async (to, rsvpData, invitationData) => {
  const { guestName, attending } = rsvpData;
  const { childName, eventDate, eventEndTime, eventLocation } = invitationData;

  const startTime = new Date(eventDate).toLocaleString();
  const endTime = new Date(eventEndTime).toLocaleString();

  const msg = {
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: `RSVP Confirmation - ${childName}'s Party`,
    html: `
      <h1>RSVP Confirmation</h1>
      <p>Dear ${guestName},</p>
      <p>Thank you for your RSVP to ${childName}'s party!</p>
      <p><strong>Your Response:</strong> ${attending === 'yes' ? 'Attending' : 'Not Attending'}</p>
      ${attending === 'yes' ? `
        <div style="margin: 20px 0;">
          <p><strong>Event Details:</strong></p>
          <p>Date & Time: ${startTime} to ${endTime}</p>
          <p>Location: ${eventLocation}</p>
        </div>
      ` : ''}
    `
  };

  try {
    await resend.emails.send(msg);
    console.log('RSVP confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending RSVP confirmation email:', error);
    throw error;
  }
};

// Send donation confirmation email
const sendDonationConfirmationEmail = async (to, donationData, invitationData) => {
  const { amount, donor } = donationData;
  const { childName, charityName } = invitationData;

  const msg = {
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: `Donation Confirmation - ${childName}'s Party`,
    html: `
      <h1>Thank You for Your Donation! 🎁</h1>
      <p>Dear ${donor.name},</p>
      <p>Thank you for your generous donation of $${amount} to ${charityName} in celebration of ${childName}'s party!</p>
      <p>Your contribution will make a real difference.</p>
    `
  };

  try {
    await resend.emails.send(msg);
    console.log('Donation confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending donation confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendInvitationEmail,
  sendRsvpConfirmationEmail,
  sendDonationConfirmationEmail
};

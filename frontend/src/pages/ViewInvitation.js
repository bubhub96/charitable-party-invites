import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ViewInvitation.css';

const ViewInvitation = () => {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [rsvpForm, setRsvpForm] = useState({
    guestName: '',
    email: '',
    attending: 'yes'
  });
  const [donationForm, setDonationForm] = useState({
    amount: '',
    donor: {
      name: '',
      email: ''
    }
  });

  const fetchInvitation = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/invitations/${id}`);
      const data = await response.json();
      setInvitation(data);
    } catch (error) {
      console.error('Error fetching invitation:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchInvitation();
  }, [fetchInvitation]);


  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5002/api/invitations/${id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpForm),
      });
      fetchInvitation(); // Refresh invitation data
      setRsvpForm({ guestName: '', email: '', attending: 'yes' });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    // In a real application, you would:
    // 1. Create a Stripe payment intent
    // 2. Collect card details securely
    // 3. Process the payment
    // 4. Create the donation record
    alert('Donation feature coming soon!');
  };

  if (!invitation) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-invitation">
      <div className="invitation-card">
        <h1>You're Invited! 🎈</h1>
        <div className="party-details">
          <h2>{invitation.childName}'s Birthday Party</h2>
          <p className="date">
            {new Date(invitation.eventDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="location">{invitation.eventLocation}</p>
        </div>

        <div className="charity-section">
          <h3>Supporting {invitation.charityName}</h3>
          <p>Help us make this birthday more meaningful by contributing to our chosen charity.</p>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${(invitation.currentGiftFund / invitation.giftFundTarget) * 100}%`}}
            ></div>
          </div>
          <p className="gift-fund-status">
            Gift Fund: ${invitation.currentGiftFund} of ${invitation.giftFundTarget}
          </p>
        </div>

        <div className="forms-section">
          <div className="rsvp-form">
            <h3>RSVP</h3>
            <form onSubmit={handleRsvpSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={rsvpForm.guestName}
                onChange={(e) => setRsvpForm({...rsvpForm, guestName: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={rsvpForm.email}
                onChange={(e) => setRsvpForm({...rsvpForm, email: e.target.value})}
                required
              />
              <select
                value={rsvpForm.attending}
                onChange={(e) => setRsvpForm({...rsvpForm, attending: e.target.value})}
              >
                <option value="yes">Yes, I'll be there!</option>
                <option value="no">Sorry, I can't make it</option>
              </select>
              <button type="submit">Send RSVP</button>
            </form>
          </div>

          <div className="donation-form">
            <h3>Make a Donation</h3>
            <form onSubmit={handleDonationSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={donationForm.donor.name}
                onChange={(e) => setDonationForm({
                  ...donationForm,
                  donor: {...donationForm.donor, name: e.target.value}
                })}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={donationForm.donor.email}
                onChange={(e) => setDonationForm({
                  ...donationForm,
                  donor: {...donationForm.donor, email: e.target.value}
                })}
                required
              />
              <input
                type="number"
                placeholder="Donation Amount ($)"
                value={donationForm.amount}
                onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                required
                min="1"
              />
              <button type="submit">Donate</button>
            </form>
          </div>
        </div>

        <div className="rsvp-list">
          <h3>Guest List</h3>
          <div className="guests">
            {invitation.rsvps.map((rsvp, index) => (
              <div key={index} className="guest-item">
                <span className="guest-name">{rsvp.guestName}</span>
                <span className={`status ${rsvp.attending ? 'attending' : 'not-attending'}`}>
                  {rsvp.attending ? 'Attending' : 'Not Attending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvitation;

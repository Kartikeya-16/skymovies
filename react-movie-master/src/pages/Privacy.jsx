import React from "react";
import PageHeader from "../components/page-header/PageHeader";
import "./privacy.scss";

const Privacy = () => {
  return (
    <>
      <PageHeader>Privacy Policy</PageHeader>
      <div className="container">
        <div className="privacy-page">
          <div className="privacy-content">
            <div className="privacy-section">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul>
                <li>Account information (name, email, password)</li>
                <li>Booking information (movie selections, seat choices, payment details)</li>
                <li>Watchlist and preferences</li>
                <li>Communication data when you contact us</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process and manage your bookings</li>
                <li>Send booking confirmations and updates</li>
                <li>Personalize your experience</li>
                <li>Improve our services</li>
                <li>Respond to your inquiries</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share information only in the following circumstances:
              </p>
              <ul>
                <li>With payment processors to complete transactions</li>
                <li>With theatres to confirm bookings</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and safety</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div className="privacy-section">
              <h2>5. Cookies and Tracking</h2>
              <p>
                We use cookies to enhance your experience, analyze usage, and assist with 
                marketing efforts. You can control cookies through your browser settings.
              </p>
            </div>

            <div className="privacy-section">
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>7. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13. We do not knowingly 
                collect personal information from children under 13.
              </p>
            </div>

            <div className="privacy-section">
              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you 
                of any changes by posting the new policy on this page.
              </p>
            </div>

            <div className="privacy-section">
              <h2>9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at 
                <a href="/contact"> support@hmovies.com</a>.
              </p>
            </div>

            <div className="privacy-footer">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;


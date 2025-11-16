import React from "react";
import PageHeader from "../components/page-header/PageHeader";
import "./terms.scss";

const Terms = () => {
  return (
    <>
      <PageHeader>Terms of Service</PageHeader>
      <div className="container">
        <div className="terms-page">
          <div className="terms-content">
            <div className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using hMovies, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, please 
                do not use our service.
              </p>
            </div>

            <div className="terms-section">
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily use hMovies for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title, 
                and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>3. Booking and Payments</h2>
              <p>
                When you book tickets through hMovies:
              </p>
              <ul>
                <li>All bookings are subject to availability</li>
                <li>Prices are subject to change without notice</li>
                <li>Refunds are subject to theatre policies</li>
                <li>We use secure payment processing for all transactions</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>4. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and 
                password. You agree to accept responsibility for all activities that occur 
                under your account.
              </p>
            </div>

            <div className="terms-section">
              <h2>5. Content and Intellectual Property</h2>
              <p>
                All content on hMovies, including but not limited to text, graphics, logos, 
                images, and software, is the property of hMovies or its content suppliers 
                and is protected by copyright laws.
              </p>
            </div>

            <div className="terms-section">
              <h2>6. Limitation of Liability</h2>
              <p>
                hMovies shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
            </div>

            <div className="terms-section">
              <h2>7. Changes to Terms</h2>
              <p>
                hMovies reserves the right to revise these terms at any time without notice. 
                By using this service you are agreeing to be bound by the then current version 
                of these terms.
              </p>
            </div>

            <div className="terms-section">
              <h2>8. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at 
                <a href="/contact"> support@hmovies.com</a>.
              </p>
            </div>

            <div className="terms-footer">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;


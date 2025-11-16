import React, { useState } from "react";
import PageHeader from "../components/page-header/PageHeader";
import "./contact.scss";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to backend
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <PageHeader>Contact Us</PageHeader>
      <div className="container">
        <div className="contact-page">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have a question, suggestion, or need help? We'd love to hear from you!
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <i className="bx bx-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <p>support@hmovies.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <i className="bx bx-phone"></i>
                  <div>
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-method">
                  <i className="bx bx-time"></i>
                  <div>
                    <h4>Support Hours</h4>
                    <p>Monday - Friday: 9 AM - 6 PM</p>
                    <p>Saturday - Sunday: 10 AM - 4 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h3>Send us a Message</h3>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  <i className="bx bx-send"></i>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;


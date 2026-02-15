import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/page-header/PageHeader";
import { initiateRazorpayPayment } from "../utils/razorpay";
import backendApi from "../api/backendApi";
import "./payment.scss";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Step 1: Create order on backend (backend will call Razorpay API)
      const orderResponse = await backendApi.payments.createOrder({
        amount: bookingDetails.total,
        currency: 'INR',
        bookingDetails: {
          movieTitle: bookingDetails.movieTitle,
          theatre: bookingDetails.theatre,
          seats: bookingDetails.seats,
          showtime: bookingDetails.showtime,
        },
      });

      // Step 2: Extract order data from backend response
      // Backend returns: { status: 'success', data: { order: {...}, key: '...' } }
      const order = orderResponse.data.data?.order || orderResponse.data.order;
      
      if (!order || !order.id) {
        throw new Error('Invalid order response from backend. Order ID is missing.');
      }

      const orderData = {
        id: order.id, // Real Razorpay order ID from backend
        amount: order.amount,
        currency: order.currency,
      };

      const razorpayBookingDetails = {
        description: `${bookingDetails.movieTitle} - ${bookingDetails.theatre}`,
        name: formData.name || 'Guest User',
        email: formData.email || 'guest@example.com',
        phone: formData.phone || '9999999999',
        movieTitle: bookingDetails.movieTitle,
        theatre: bookingDetails.theatre,
        seats: bookingDetails.seats,
        showtime: bookingDetails.showtime,
      };

      // Step 3: Initiate Razorpay payment with real order ID
      await initiateRazorpayPayment(
        orderData,
        razorpayBookingDetails,
        // Success callback
        async (paymentResponse) => {
          // Step 4: Verify payment on backend
          try {
            await backendApi.payments.verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
            setIsProcessing(false);
            
            // Redirect to confirmation page
            navigate("/booking-confirmation", {
              state: {
                ...bookingDetails,
                ...formData,
                paymentMethod: 'razorpay',
                bookingId: `BK${Date.now()}`,
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
              },
            });
          } catch (verifyError) {
            setIsProcessing(false);
            alert('Payment verification failed. Please contact support with your payment ID: ' + paymentResponse.razorpay_payment_id);
          }
        },
        // Failure callback
        (error) => {
          setIsProcessing(false);
          alert('Payment failed: ' + error);
        }
      );
    } catch (error) {
      setIsProcessing(false);
      
      // Check if backend is not running
      if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
        alert('Cannot connect to server. Please try again later.');
      } else {
        alert('Error initiating payment: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <>
      <PageHeader>Payment</PageHeader>

      <div className="container">
        <div className="payment-page">
          <div className="payment-container">
            <div className="booking-summary-card">
              <h2>Booking Summary</h2>
              <div className="summary-details">
                <div className="detail-row">
                  <span>Seats:</span>
                  <span>{bookingDetails.seats?.join(", ")}</span>
                </div>
                <div className="detail-row">
                  <span>Showtime:</span>
                  <span>{bookingDetails.showtime}</span>
                </div>
                <div className="detail-row">
                  <span>Number of Tickets:</span>
                  <span>{bookingDetails.seats?.length}</span>
                </div>
                <div className="detail-row total">
                  <span>Total Amount:</span>
                  <span>₹{bookingDetails.total}</span>
                </div>
              </div>
            </div>

            <div className="payment-methods">
              <h2>Payment via Razorpay</h2>
              
              <div className="razorpay-info">
                <div className="info-card">
                  <i className="bx bx-shield-quarter"></i>
                  <div>
                    <h4>100% Secure Payments</h4>
                    <p>All payments are processed through Razorpay's secure payment gateway</p>
                  </div>
                </div>
                <div className="payment-methods-supported">
                  <p><strong>Supported Payment Methods:</strong></p>
                  <div className="methods-icons">
                    <span><i className="bx bx-credit-card"></i> Cards</span>
                    <span><i className="bx bx-mobile"></i> UPI</span>
                    <span><i className="bx bx-wallet"></i> Wallets</span>
                    <span><i className="bx bx-bank"></i> Net Banking</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRazorpayPayment} className="payment-form">
                <h3>Enter Your Details</h3>
                
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9999999999"
                    value={formData.phone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="payment-note">
                  <i className="bx bx-info-circle"></i>
                  <p>You will be redirected to Razorpay's secure payment page to complete your payment.</p>
                </div>

                <button type="submit" className="btn-pay" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <i className="bx bx-loader-alt bx-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-lock-alt"></i>
                      Pay ₹{bookingDetails.total} Securely
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;


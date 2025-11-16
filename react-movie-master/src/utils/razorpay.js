// Razorpay Payment Integration Utility

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (orderData, bookingDetails, onSuccess, onFailure) => {
  // Check if Razorpay Key is configured
  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
  
  if (!razorpayKey || razorpayKey === 'rzp_test_YOUR_KEY_ID') {
    const errorMsg = `⚠️ Razorpay Key Not Configured!

To enable payments:

1. Create file: react-movie-master/.env

2. Add this line:
   REACT_APP_RAZORPAY_KEY_ID=your_key_here

3. Get your key from:
   https://dashboard.razorpay.com/app/keys

4. Restart the frontend server

For now, continuing with DEMO mode...`;
    
    console.error(errorMsg);
    alert(errorMsg);
    
    // For demo purposes, simulate successful payment
    setTimeout(() => {
      onSuccess({
        razorpay_payment_id: 'pay_demo_' + Date.now(),
        razorpay_order_id: orderData.id,
        razorpay_signature: 'demo_signature',
      });
    }, 1000);
    return;
  }

  // Load Razorpay script
  const res = await loadRazorpayScript();

  if (!res) {
    const error = 'Razorpay SDK failed to load. Please check your internet connection.';
    alert(error);
    if (onFailure) onFailure(error);
    return;
  }

  // Razorpay options
  const options = {
    key: razorpayKey,
    amount: orderData.amount, // Amount in paise
    currency: orderData.currency || 'INR',
    name: 'Movie Booking',
    description: bookingDetails.description || 'Movie Ticket Booking',
    order_id: orderData.id, // Order ID from backend
    handler: function (response) {
      // Payment successful
      console.log('Payment successful:', response);
      onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    prefill: {
      name: bookingDetails.name || '',
      email: bookingDetails.email || '',
      contact: bookingDetails.phone || '',
    },
    notes: {
      movie: bookingDetails.movieTitle || '',
      theatre: bookingDetails.theatre || '',
      seats: bookingDetails.seats?.join(', ') || '',
      showtime: bookingDetails.showtime || '',
    },
    theme: {
      color: '#ff0000', // Your brand color
    },
    modal: {
      ondismiss: function () {
        console.log('Payment cancelled by user');
        if (onFailure) {
          onFailure('Payment cancelled');
        }
      },
    },
  };

  // Create Razorpay instance
  const paymentObject = new window.Razorpay(options);
  
  paymentObject.on('payment.failed', function (response) {
    console.error('Payment failed:', response.error);
    if (onFailure) {
      onFailure(response.error.description || 'Payment failed');
    }
  });

  // Open Razorpay checkout
  paymentObject.open();
};

// Test payment with dummy values (for testing mode)
export const testPayment = (amount, description) => {
  const testOrderData = {
    id: 'order_test_' + Date.now(),
    amount: amount * 100, // Convert to paise
    currency: 'INR',
  };

  const testBookingDetails = {
    description: description || 'Test Payment',
    name: 'Test User',
    email: 'test@example.com',
    phone: '9999999999',
  };

  return initiateRazorpayPayment(
    testOrderData,
    testBookingDetails,
    (response) => {
      console.log('Test payment success:', response);
      alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
    },
    (error) => {
      console.log('Test payment failed:', error);
      alert('Payment failed: ' + error);
    }
  );
};


import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PageHeader from "../components/page-header/PageHeader";
import "./my-bookings.scss";

const MyBookings = () => {
  // Load bookings from localStorage or use mock data
  const loadBookings = () => {
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      return JSON.parse(savedBookings);
    }
    // Default mock data
    return [
      {
        id: "BK1234567890",
        movieTitle: "Spider-Man: No Way Home",
        theatre: "PVR Cinemas",
        showtime: "07:00 PM",
        date: "2025-11-10",
        seats: ["D5", "D6", "D7"],
        total: 600,
        status: "upcoming",
        qrCode: "QR_CODE_DATA",
      },
      {
        id: "BK9876543210",
        movieTitle: "Dune: Part Two",
        theatre: "INOX",
        showtime: "04:00 PM",
        date: "2025-11-05",
        seats: ["F3", "F4"],
        total: 500,
        status: "completed",
        qrCode: "QR_CODE_DATA",
      },
      {
        id: "BK1122334455",
        movieTitle: "Oppenheimer",
        theatre: "Cinepolis",
        showtime: "09:00 PM",
        date: "2025-10-28",
        seats: ["H5", "H6"],
        total: 500,
        status: "completed",
        qrCode: "QR_CODE_DATA",
      },
    ];
  };

  const [bookings, setBookings] = useState(loadBookings);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);
  const ticketModalRef = useRef(null);

  // Save bookings to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('userBookings', JSON.stringify(bookings));
  }, [bookings]);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") {
      // Show both completed and cancelled in Past tab
      return booking.status === "completed" || booking.status === "cancelled";
    }
    if (activeTab === "cancelled") {
      return booking.status === "cancelled";
    }
    return booking.status === activeTab;
  });

  const handleViewTicket = (booking) => {
    setSelectedTicket(booking);
  };

  const handleCancelBooking = (booking) => {
    setShowCancelModal(booking);
  };

  const confirmCancelBooking = () => {
    if (showCancelModal) {
      // Update booking status to cancelled
      const updatedBookings = bookings.map(b => 
        b.id === showCancelModal.id 
          ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } 
          : b
      );
      setBookings(updatedBookings);
      setShowCancelModal(null);
      
      // Show success message
      alert('Booking cancelled successfully! Refund will be processed in 5-7 business days.');
    }
  };

  const handleDownloadTicket = async () => {
    if (!selectedTicket) return;

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Colors
      const primaryColor = [220, 38, 38]; // Red
      const lightGray = [200, 200, 200];
      const textColor = [50, 50, 50];

      // Header Section
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, 210, 40, "F");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("SKY MOVIES", 105, 20, { align: "center" });
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Movie Ticket", 105, 30, { align: "center" });

      // Ticket Content
      let yPos = 55;

      // Movie Title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...textColor);
      pdf.text(selectedTicket.movieTitle || "Movie", 20, yPos);
      yPos += 10;

      // Booking Details Box
      pdf.setDrawColor(...lightGray);
      pdf.setLineWidth(0.5);
      pdf.rect(15, yPos - 5, 180, 80, "S");

      // Left Column
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      
      pdf.text("Booking ID:", 20, yPos + 5);
      pdf.text("Date:", 20, yPos + 12);
      pdf.text("Showtime:", 20, yPos + 19);
      pdf.text("Theatre:", 20, yPos + 26);
      pdf.text("Seats:", 20, yPos + 33);
      pdf.text("Tickets:", 20, yPos + 40);
      pdf.text("Status:", 20, yPos + 47);
      pdf.text("Amount:", 20, yPos + 54);

      // Right Column - Values
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...textColor);
      pdf.text(selectedTicket.id || "N/A", 70, yPos + 5);
      pdf.text(selectedTicket.date || "N/A", 70, yPos + 12);
      pdf.text(selectedTicket.showtime || "N/A", 70, yPos + 19);
      pdf.text(selectedTicket.theatre || "Theatre", 70, yPos + 26);
      pdf.text(selectedTicket.seats?.join(", ") || "N/A", 70, yPos + 33);
      pdf.text((selectedTicket.seats?.length || 0).toString(), 70, yPos + 40);
      pdf.text((selectedTicket.status || "upcoming").toUpperCase(), 70, yPos + 47);
      pdf.text(`₹${selectedTicket.total || "0"}`, 70, yPos + 54);

      yPos += 90;

      // QR Code Section (if available)
      if (ticketModalRef.current) {
        try {
          const qrElement = ticketModalRef.current.querySelector('.qr-code');
          if (qrElement) {
            const canvas = await html2canvas(qrElement, {
              scale: 2,
              backgroundColor: "#ffffff",
              useCORS: true,
              logging: false,
            });
            
            const qrData = canvas.toDataURL("image/png");
            const qrSize = 50;
            const qrX = (210 - qrSize) / 2;
            
            pdf.addImage(qrData, "PNG", qrX, yPos, qrSize, qrSize);
            
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Scan QR code at cinema", 105, yPos + qrSize + 8, { align: "center" });
            yPos += 70;
          }
        } catch (qrError) {
          console.log("QR code not available for PDF");
        }
      }

      // Total Amount Box
      pdf.setFillColor(245, 245, 245);
      pdf.rect(15, yPos, 180, 20, "F");
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...textColor);
      pdf.text("Total Amount Paid:", 20, yPos + 12);
      
      pdf.setFontSize(18);
      pdf.setTextColor(...primaryColor);
      pdf.text(`₹${selectedTicket.total || "0"}`, 180, yPos + 12, { align: "right" });

      // Footer
      yPos = 270;
      pdf.setDrawColor(...lightGray);
      pdf.line(15, yPos, 195, yPos);
      
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos + 5, { align: "center" });
      pdf.text("This is a computer-generated ticket. No signature required.", 105, yPos + 10, { align: "center" });
      pdf.text("For support, contact: support@skymovies.com", 105, yPos + 15, { align: "center" });

      // Save PDF
      pdf.save(`SkyMovies-Ticket-${selectedTicket.id}-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download ticket. Please try again.");
    }
  };

  const handleShareTicket = () => {
    if (!selectedTicket) return;

    const shareText = `🎬 Movie Ticket\n\nBooking ID: ${selectedTicket.id}\nMovie: ${selectedTicket.movieTitle}\nTheatre: ${selectedTicket.theatre}\nDate: ${selectedTicket.date}\nTime: ${selectedTicket.showtime}\nSeats: ${selectedTicket.seats.join(", ")}\nTotal: ₹${selectedTicket.total}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Movie Ticket",
          text: shareText,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Ticket details copied to clipboard!");
      });
    }
  };

  const handleDownloadInvoice = (booking) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Colors
      const primaryColor = [220, 38, 38]; // Red
      const lightGray = [200, 200, 200];
      const textColor = [50, 50, 50];
      const bgGray = [245, 245, 245];

      // Header Section
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, 210, 50, "F");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text("SKY MOVIES", 105, 25, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("TAX INVOICE", 105, 38, { align: "center" });

      // Invoice Details
      let yPos = 65;

      // Invoice Header Info
      pdf.setTextColor(...textColor);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("Invoice No:", 20, yPos);
      pdf.text(`INV-${booking.id}`, 60, yPos);
      
      pdf.text("Date:", 120, yPos);
      pdf.text(new Date().toLocaleDateString(), 140, yPos);
      yPos += 8;

      pdf.text("Booking ID:", 20, yPos);
      pdf.text(booking.id, 60, yPos);
      yPos += 15;

      // Customer Details Box
      pdf.setFillColor(...bgGray);
      pdf.rect(15, yPos, 85, 40, "F");
      pdf.setDrawColor(...lightGray);
      pdf.rect(15, yPos, 85, 40, "S");
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("BILL TO", 20, yPos + 8);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("Sky Movies Customer", 20, yPos + 15);
      pdf.text("support@skymovies.com", 20, yPos + 21);
      pdf.text("+91-XXXXX-XXXXX", 20, yPos + 27);
      yPos += 45;

      // Movie Details
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("MOVIE DETAILS", 20, yPos);
      yPos += 10;

      pdf.setDrawColor(...lightGray);
      pdf.setLineWidth(0.5);
      pdf.rect(15, yPos - 5, 180, 50, "S");

      // Movie Info
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      
      pdf.text("Movie:", 20, yPos + 5);
      pdf.text("Theatre:", 20, yPos + 12);
      pdf.text("Date & Time:", 20, yPos + 19);
      pdf.text("Seats:", 20, yPos + 26);
      pdf.text("No. of Tickets:", 20, yPos + 33);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...textColor);
      pdf.text(booking.movieTitle || "Movie", 70, yPos + 5);
      pdf.text(booking.theatre || "Theatre", 70, yPos + 12);
      pdf.text(`${booking.date} at ${booking.showtime}`, 70, yPos + 19);
      pdf.text(booking.seats?.join(", ") || "N/A", 70, yPos + 26);
      pdf.text((booking.seats?.length || 0).toString(), 70, yPos + 33);

      yPos += 60;

      // Itemized Bill
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("BILLING SUMMARY", 20, yPos);
      yPos += 10;

      pdf.setFillColor(...bgGray);
      pdf.rect(15, yPos - 5, 180, 8, "F");
      pdf.setDrawColor(...lightGray);
      pdf.rect(15, yPos - 5, 180, 8, "S");

      // Column headers - properly aligned
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Description", 20, yPos + 2);
      pdf.text("Qty", 110, yPos + 2);
      pdf.text("Price", 135, yPos + 2, { align: "right" });
      pdf.text("Amount", 195, yPos + 2, { align: "right" });
      yPos += 10;

      // Ticket Item - properly aligned
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...textColor);
      const ticketPrice = booking.total / (booking.seats?.length || 1);
      pdf.text("Movie Ticket", 20, yPos + 5);
      pdf.text((booking.seats?.length || 0).toString(), 110, yPos + 5);
      pdf.text(`₹${ticketPrice.toFixed(2)}`, 135, yPos + 5, { align: "right" });
      pdf.text(`₹${booking.total.toFixed(2)}`, 195, yPos + 5, { align: "right" });
      yPos += 15;

      // Total Section - properly aligned
      pdf.setDrawColor(...lightGray);
      pdf.line(15, yPos, 195, yPos);
      yPos += 8;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Subtotal:", 135, yPos, { align: "right" });
      pdf.text(`₹${booking.total.toFixed(2)}`, 195, yPos, { align: "right" });
      yPos += 8;

      pdf.text("Tax (GST 18%):", 135, yPos, { align: "right" });
      const tax = booking.total * 0.18;
      pdf.text(`₹${tax.toFixed(2)}`, 195, yPos, { align: "right" });
      yPos += 8;

      pdf.setFillColor(...primaryColor);
      pdf.rect(15, yPos - 3, 180, 12, "F");
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Total Amount:", 135, yPos + 5, { align: "right" });
      const totalWithTax = booking.total + tax;
      pdf.text(`₹${totalWithTax.toFixed(2)}`, 195, yPos + 5, { align: "right" });

      yPos += 20;

      // Payment Info
      pdf.setFillColor(...bgGray);
      pdf.rect(15, yPos, 180, 30, "F");
      pdf.setDrawColor(...lightGray);
      pdf.rect(15, yPos, 180, 30, "S");

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...textColor);
      pdf.text("PAYMENT INFORMATION", 20, yPos + 8);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Payment Method: ${(booking.paymentMethod || "Online Payment").toUpperCase()}`, 20, yPos + 15);
      pdf.text(`Payment Status: PAID`, 20, yPos + 21);
      pdf.text(`Transaction ID: ${booking.id}`, 20, yPos + 27);

      // Footer
      yPos = 270;
      pdf.setDrawColor(...lightGray);
      pdf.line(15, yPos, 195, yPos);
      
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("This is a computer-generated invoice. No signature required.", 105, yPos + 5, { align: "center" });
      pdf.text("For support, contact: support@skymovies.com | Phone: +91-XXXXX-XXXXX", 105, yPos + 10, { align: "center" });
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos + 15, { align: "center" });

      // Save PDF
      pdf.save(`SkyMovies-Invoice-${booking.id}-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  return (
    <>
      <PageHeader>My Bookings</PageHeader>

      <div className="container">
        <div className="my-bookings-page">
          {/* Reset Demo Data Button (for testing) */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
              <button 
                onClick={() => {
                  localStorage.removeItem('userBookings');
                  window.location.reload();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                <i className="bx bx-refresh"></i> Reset Demo Data
              </button>
            </div>
          )}

          <div className="booking-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Bookings
            </button>
            <button
              className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Past
            </button>
            <button
              className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled
            </button>
          </div>

          <div className="bookings-list">
            {filteredBookings.length === 0 ? (
              <div className="no-bookings">
                <i className="bx bx-movie"></i>
                <h3>No bookings found</h3>
                <p>Your {activeTab === "all" ? "" : activeTab} bookings will appear here</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className={`booking-card ${booking.status === 'cancelled' ? 'cancelled-booking' : ''}`}>
                  <div className={`booking-status ${booking.status}`}>
                    {booking.status === "upcoming" && "Upcoming"}
                    {booking.status === "completed" && "Completed"}
                    {booking.status === "cancelled" && "Cancelled"}
                  </div>

                  <div className="booking-info">
                    <h3 className="movie-title">{booking.movieTitle}</h3>
                    
                    <div className="booking-details">
                      <div className="detail-item">
                        <i className="bx bx-building"></i>
                        <span>{booking.theatre}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bx bx-calendar"></i>
                        <span>{booking.date}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bx bx-time"></i>
                        <span>{booking.showtime}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bx bx-chair"></i>
                        <span>Seats: {booking.seats.join(", ")}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bx bx-rupee"></i>
                        <span>₹{booking.total}</span>
                      </div>
                    </div>

                    <div className="booking-id">Booking ID: {booking.id}</div>
                  </div>

                  <div className="booking-actions">
                    {booking.status === "upcoming" && (
                      <>
                        <button className="action-btn" onClick={() => handleViewTicket(booking)}>
                          <i className="bx bx-qr"></i>
                          View Ticket
                        </button>
                        <button className="action-btn secondary" onClick={() => handleCancelBooking(booking)}>
                          <i className="bx bx-x-circle"></i>
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === "completed" && (
                      <button className="action-btn" onClick={() => handleDownloadInvoice(booking)}>
                        <i className="bx bx-download"></i>
                        Download Invoice
                      </button>
                    )}
                    {booking.status === "cancelled" && (
                      <div className="cancelled-info">
                        <i className="bx bx-info-circle"></i>
                        <span>Refund processed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ticket Modal */}
        {selectedTicket && (
          <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
            <div className="modal-content ticket-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedTicket(null)}>
                <i className="bx bx-x"></i>
              </button>
              
              <div ref={ticketModalRef}>
                <div className="ticket-header">
                  <h2>{selectedTicket.movieTitle}</h2>
                  <p className="booking-id-modal">#{selectedTicket.id}</p>
                </div>
                
                <div className="ticket-qr">
                  <QRCodeCanvas
                    value={JSON.stringify({
                      bookingId: selectedTicket.id,
                      movieTitle: selectedTicket.movieTitle,
                      theatre: selectedTicket.theatre,
                      date: selectedTicket.date,
                      showtime: selectedTicket.showtime,
                      seats: selectedTicket.seats,
                      total: selectedTicket.total,
                    })}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                  <p>Scan QR at theatre entrance</p>
                </div>
                
                <div className="ticket-details">
                  <div className="ticket-row">
                    <span className="label">Theatre:</span>
                    <span className="value">{selectedTicket.theatre}</span>
                  </div>
                  <div className="ticket-row">
                    <span className="label">Date:</span>
                    <span className="value">{selectedTicket.date}</span>
                  </div>
                  <div className="ticket-row">
                    <span className="label">Time:</span>
                    <span className="value">{selectedTicket.showtime}</span>
                  </div>
                  <div className="ticket-row">
                    <span className="label">Seats:</span>
                    <span className="value">{selectedTicket.seats.join(", ")}</span>
                  </div>
                  <div className="ticket-row">
                    <span className="label">Total:</span>
                    <span className="value">₹{selectedTicket.total}</span>
                  </div>
                </div>
              </div>
              
              <div className="ticket-actions">
                <button className="btn-primary" onClick={handleDownloadTicket}>
                  <i className="bx bx-download"></i>
                  Download Ticket
                </button>
                <button className="btn-secondary" onClick={handleShareTicket}>
                  <i className="bx bx-share"></i>
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(null)}>
            <div className="modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowCancelModal(null)}>
                <i className="bx bx-x"></i>
              </button>
              
              <div className="cancel-header">
                <i className="bx bx-error-circle" style={{ fontSize: '60px', color: '#ff4757' }}></i>
                <h2>Cancel Booking?</h2>
                <p>Are you sure you want to cancel this booking?</p>
              </div>
              
              <div className="cancel-details">
                <p><strong>{showCancelModal.movieTitle}</strong></p>
                <p>{showCancelModal.theatre}</p>
                <p>{showCancelModal.date} at {showCancelModal.showtime}</p>
                <p>Seats: {showCancelModal.seats.join(", ")}</p>
                <p className="refund-info">
                  <i className="bx bx-info-circle"></i>
                  Refund of ₹{showCancelModal.total} will be processed in 5-7 business days
                </p>
              </div>
              
              <div className="cancel-actions">
                <button className="btn-secondary" onClick={() => setShowCancelModal(null)}>
                  Keep Booking
                </button>
                <button className="btn-danger" onClick={confirmCancelBooking}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;


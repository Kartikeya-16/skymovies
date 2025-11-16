import React, { useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PageHeader from "../components/page-header/PageHeader";
import "./booking-confirmation.scss";
import * as Config from "./../constants/Config";

const BookingConfirmation = () => {
  const location = useLocation();
  const bookingDetails = location.state || {};
  const ticketRef = useRef(null);

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    bookingId: bookingDetails.bookingId,
    paymentId: bookingDetails.paymentId,
    seats: bookingDetails.seats,
    showtime: bookingDetails.showtime,
    total: bookingDetails.total,
  });

  // Download ticket as PDF with professional format
  const handleDownloadTicket = async () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Colors
      const primaryColor = [220, 38, 38]; // Red
      const darkColor = [15, 15, 15];
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
      pdf.text(bookingDetails.movieTitle || "Movie", 20, yPos);
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
      pdf.text("Payment ID:", 20, yPos + 12);
      pdf.text("Date:", 20, yPos + 19);
      pdf.text("Showtime:", 20, yPos + 26);
      pdf.text("Theatre:", 20, yPos + 33);
      pdf.text("Seats:", 20, yPos + 40);
      pdf.text("Tickets:", 20, yPos + 47);
      pdf.text("Payment:", 20, yPos + 54);

      // Right Column - Values
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...textColor);
      pdf.text(bookingDetails.bookingId || "N/A", 70, yPos + 5);
      pdf.text(bookingDetails.paymentId || "N/A", 70, yPos + 12);
      pdf.text(bookingDetails.date || new Date().toLocaleDateString(), 70, yPos + 19);
      pdf.text(bookingDetails.showtime || "N/A", 70, yPos + 26);
      pdf.text(bookingDetails.theatre || "Theatre", 70, yPos + 33);
      pdf.text(bookingDetails.seats?.join(", ") || "N/A", 70, yPos + 40);
      pdf.text((bookingDetails.seats?.length || 0).toString(), 70, yPos + 47);
      pdf.text((bookingDetails.paymentMethod || "Online").toUpperCase(), 70, yPos + 54);

      yPos += 90;

      // QR Code Section
      if (ticketRef.current) {
        try {
          const canvas = await html2canvas(ticketRef.current.querySelector('.qr-code') || ticketRef.current, {
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
        } catch (qrError) {
          console.log("QR code not available for PDF");
        }
      }

      yPos += 70;

      // Total Amount Box
      pdf.setFillColor(245, 245, 245);
      pdf.rect(15, yPos, 180, 20, "F");
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...textColor);
      pdf.text("Total Amount Paid:", 20, yPos + 12);
      
      pdf.setFontSize(18);
      pdf.setTextColor(...primaryColor);
      pdf.text(`₹${bookingDetails.total || "0"}`, 180, yPos + 12, { align: "right" });

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
      pdf.save(`SkyMovies-Ticket-${bookingDetails.bookingId || Date.now()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download ticket. Please try again.");
    }
  };

  // Share ticket details
  const handleShare = async () => {
    const shareText = `🎬 Movie Ticket Booked!\n\nBooking ID: ${bookingDetails.bookingId}\nMovie: ${bookingDetails.movieTitle || 'Movie'}\nTheatre: ${bookingDetails.theatre || 'Theatre'}\nSeats: ${bookingDetails.seats?.join(", ")}\nShowtime: ${bookingDetails.showtime}\nTotal: ₹${bookingDetails.total}`;

    try {
      // Check if Web Share API is available and if we can share
      if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: "🎬 Movie Ticket",
          text: shareText,
        });
        console.log("Ticket shared successfully");
      } else if (navigator.share) {
        // Try to share even if canShare is not available
        await navigator.share({
          title: "🎬 Movie Ticket",
          text: shareText,
        });
        console.log("Ticket shared successfully");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareText);
        alert("📋 Ticket details copied to clipboard!\n\nYou can now paste it anywhere to share.");
      }
    } catch (error) {
      // If share was cancelled or failed
      if (error.name === "AbortError") {
        console.log("Share cancelled by user");
      } else if (error.name === "NotAllowedError") {
        // Permission denied or not in secure context
        console.log("Share not allowed, falling back to copy");
        try {
          await navigator.clipboard.writeText(shareText);
          alert("📋 Ticket details copied to clipboard!\n\nYou can now paste it anywhere to share.");
        } catch (clipboardError) {
          console.error("Clipboard error:", clipboardError);
          // Last resort: show text in prompt for manual copy
          prompt("Copy this ticket information:", shareText);
        }
      } else {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          alert("📋 Ticket details copied to clipboard!");
        } catch (clipboardError) {
          // Last resort
          prompt("Copy this ticket information:", shareText);
        }
      }
    }
  };

  return (
    <>
      <PageHeader>Booking Confirmed!</PageHeader>

      <div className="container">
        <div className="confirmation-page">
          <div className="success-icon">
            <i className="bx bx-check-circle"></i>
          </div>

          <h1 className="success-message">Booking Successful!</h1>
          <p className="success-subtitle">Your tickets have been booked successfully</p>

          <div className="confirmation-card" ref={ticketRef}>
            <div className="qr-section">
              <QRCodeCanvas
                value={qrCodeData}
                size={200}
                level="H"
                includeMargin={true}
                className="qr-code"
              />
              <p className="qr-instruction">Show this QR code at the cinema</p>
            </div>

            <div className="booking-details">
              <h2>Booking Details</h2>
              
              <div className="detail-group">
                <div className="detail-item">
                  <span className="label">Booking ID:</span>
                  <span className="value">{bookingDetails.bookingId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment ID:</span>
                  <span className="value">{bookingDetails.paymentId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Seats:</span>
                  <span className="value">{bookingDetails.seats?.join(", ")}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Showtime:</span>
                  <span className="value">{bookingDetails.showtime}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Number of Tickets:</span>
                  <span className="value">{bookingDetails.seats?.length}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">{bookingDetails.paymentMethod?.toUpperCase()}</span>
                </div>
                <div className="detail-item total">
                  <span className="label">Total Paid:</span>
                  <span className="value">₹{bookingDetails.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-download" onClick={handleDownloadTicket}>
              <i className="bx bx-download"></i>
              Download Ticket
            </button>
            <button className="btn-share" onClick={handleShare}>
              <i className="bx bx-share-alt"></i>
              Share
            </button>
          </div>

          <div className="navigation-links">
            <Link to={`/${Config.HOME_PAGE}`} className="link-btn">
              <i className="bx bx-home"></i>
              Back to Home
            </Link>
            <Link to="/my-bookings" className="link-btn">
              <i className="bx bx-list-ul"></i>
              View All Bookings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmation;


import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./TableReservation.css";

const TIME_SLOTS = [
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];

function TableReservation({
  onClose,
  onReservationSuccess,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [reservationId, setReservationId] = useState("");

  // ---------------------------------------------
  // CLOSE RESERVATION FORM
  // ---------------------------------------------
  const handleClose = () => {
    if (loading) return;

    if (typeof onClose === "function") {
      onClose();
    }
  };

  // ---------------------------------------------
  // ESC KEY TO CLOSE
  // ---------------------------------------------
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [loading, onClose]);

  // ---------------------------------------------
  // TODAY DATE
  // ---------------------------------------------
  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ---------------------------------------------
  // CONVERT TIME
  // "11:00 AM" -> "11:00:00"
  // "7:30 PM" -> "19:30:00"
  // ---------------------------------------------
  const convertToDatabaseTime = (time) => {
    if (!time) return null;

    const [timePart, period] = time.split(" ");

    let [hours, minutes] = timePart
      .split(":")
      .map(Number);

    if (period === "AM") {
      if (hours === 12) {
        hours = 0;
      }
    }

    if (period === "PM") {
      if (hours !== 12) {
        hours += 12;
      }
    }

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:00`;
  };

  // ---------------------------------------------
  // SUBMIT RESERVATION
  // ---------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    const cleanPhone =
      customerPhone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!reservationDate) {
      setError(
        "Please select a reservation date."
      );
      return;
    }

    if (!reservationTime) {
      setError(
        "Please select a reservation time."
      );
      return;
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > 20
    ) {
      setError(
        "Guests must be between 1 and 20."
      );
      return;
    }

    const databaseTime =
      convertToDatabaseTime(
        reservationTime
      );

    setLoading(true);

    try {
      const reservationData = {
        name: customerName.trim(),

        phone: cleanPhone,

        reservation_date:
          reservationDate,

        reservation_time:
          databaseTime,

        guests: guestCount,

        special_request:
          notes.trim() || null,

        status: "pending",
      };

      console.log(
        "Submitting reservation:",
        reservationData
      );

      const { error: reservationError } =
        await supabase
          .from("reservations")
          .insert([reservationData]);

      if (reservationError) {
        console.error(
          "Reservation insert error:",
          reservationError
        );

        throw reservationError;
      }

      setReservationId("Received");

      setSuccess(true);

      if (
        typeof onReservationSuccess ===
        "function"
      ) {
        onReservationSuccess(
          reservationData
        );
      }
    } catch (err) {
      console.error(
        "Reservation error:",
        err
      );

      setError(
        err?.message ||
          "Unable to make reservation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // SUCCESS SCREEN
  // ---------------------------------------------
  if (success) {
    return (
      <div
        className="reservation-overlay"
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget
          ) {
            handleClose();
          }
        }}
      >
        <div className="reservation-success-card">
          <div className="reservation-success-icon">
            ✓
          </div>

          <p className="reservation-label">
            HOTEL RAJWADA
          </p>

          <h2>Table Reserved!</h2>

          <p className="reservation-success-text">
            Thank you,{" "}
            <strong>{customerName}</strong>.
            Your table reservation request
            has been received.
          </p>

          <div className="reservation-number-box">
            <span>Reservation ID</span>

            <strong>
              #{reservationId}
            </strong>
          </div>

          <div className="reservation-success-details">
            <div>
              <span>Date</span>

              <strong>
                {reservationDate}
              </strong>
            </div>

            <div>
              <span>Time</span>

              <strong>
                {reservationTime}
              </strong>
            </div>

            <div>
              <span>Guests</span>

              <strong>{guests}</strong>
            </div>
          </div>

          <p className="reservation-pending-note">
            Our team will confirm your
            reservation shortly.
          </p>

          <button
            type="button"
            className="reservation-done-button"
            onClick={handleClose}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // RESERVATION FORM
  // ---------------------------------------------
  return (
    <div
      className="reservation-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div
        className="reservation-card"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="reservation-header">
          <div>
            <p>HOTEL RAJWADA</p>

            <h2>Reserve Your Table</h2>

            <span>
              Choose your preferred date
              and time.
            </span>
          </div>

          {/* CROSS BUTTON */}
          <button
            type="button"
            className="reservation-close-button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleClose();
            }}
            disabled={loading}
            aria-label="Close reservation form"
          >
            ×
          </button>
        </div>

        <form
          className="reservation-form"
          onSubmit={handleSubmit}
        >
          <div className="reservation-form-grid">
            {/* NAME */}
            <div className="reservation-form-group">
              <label htmlFor="reservation-name">
                Full Name *
              </label>

              <input
                id="reservation-name"
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* PHONE */}
            <div className="reservation-form-group">
              <label htmlFor="reservation-phone">
                Mobile Number *
              </label>

              <input
                id="reservation-phone"
                type="tel"
                inputMode="numeric"
                maxLength="10"
                placeholder="10-digit mobile number"
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(
                    event.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                disabled={loading}
              />
            </div>

            {/* DATE */}
            <div className="reservation-form-group">
              <label htmlFor="reservation-date">
                Reservation Date *
              </label>

              <input
                id="reservation-date"
                type="date"
                min={getTodayDate()}
                value={reservationDate}
                onChange={(event) =>
                  setReservationDate(
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* TIME */}
            <div className="reservation-form-group">
              <label htmlFor="reservation-time">
                Preferred Time *
              </label>

              <select
                id="reservation-time"
                value={reservationTime}
                onChange={(event) =>
                  setReservationTime(
                    event.target.value
                  )
                }
                disabled={loading}
              >
                <option value="">
                  Select time
                </option>

                {TIME_SLOTS.map((time) => (
                  <option
                    key={time}
                    value={time}
                  >
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GUESTS */}
          <div className="reservation-form-group">
            <label htmlFor="reservation-guests">
              Number of Guests *
            </label>

            <select
              id="reservation-guests"
              value={guests}
              onChange={(event) =>
                setGuests(
                  Number(
                    event.target.value
                  )
                )
              }
              disabled={loading}
            >
              {Array.from(
                { length: 20 },
                (_, index) => index + 1
              ).map((number) => (
                <option
                  key={number}
                  value={number}
                >
                  {number}{" "}
                  {number === 1
                    ? "Guest"
                    : "Guests"}
                </option>
              ))}
            </select>
          </div>

          {/* SPECIAL REQUEST */}
          <div className="reservation-form-group">
            <label htmlFor="reservation-notes">
              Special Request
            </label>

            <textarea
              id="reservation-notes"
              rows="4"
              placeholder="Birthday, anniversary, window table, etc. (optional)"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              disabled={loading}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="reservation-error">
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="reservation-submit-button"
            disabled={loading}
          >
            {loading
              ? "Confirming..."
              : "Confirm Reservation"}
          </button>

          <p className="reservation-footer-note">
            Reservation requests are subject
            to confirmation by Hotel Rajwada.
          </p>
        </form>
      </div>
    </div>
  );
}

export default TableReservation;

import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./ReservationForm.css";

function ReservationForm({ onClose }) {
  const getToday = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [reservation, setReservation] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    request: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [reservationId, setReservationId] = useState("");

  const handleChange = (field, value) => {
    setReservation((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const name = reservation.name.trim();
    const phone = reservation.phone.replace(/\D/g, "");
    const date = reservation.date;
    const time = reservation.time;
    const guests = Number(reservation.guests);
    const specialRequest = reservation.request.trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!date) {
      setError("Please select a reservation date.");
      return;
    }

    if (date < getToday()) {
      setError("Please select today or a future date.");
      return;
    }

    if (!time) {
      setError("Please select a reservation time.");
      return;
    }

    if (!guests || guests < 1 || guests > 50) {
      setError("Please select a valid number of guests.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: reservationError } =
        await supabase
          .from("reservations")
          .insert([
            {
              name: name,
              phone: phone,
              reservation_date: date,
              reservation_time: time,
              guests: guests,
              special_request: specialRequest || null,
              status: "Pending",
            },
          ])
          .select("id")
          .single();

      if (reservationError) {
        console.error(
          "Reservation insert error:",
          reservationError
        );

        throw reservationError;
      }

      setReservationId(String(data.id));
      setSuccess(true);
    } catch (err) {
      console.error(
        "Reservation error:",
        err
      );

      setError(
        err?.message ||
          "Unable to submit reservation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reservation-form-card">
        <div className="reservation-success-icon">
          ✓
        </div>

        <span className="reservation-form-label">
          HOTEL RAJWADA
        </span>

        <h2>
          Table <em>Reserved!</em>
        </h2>

        <p className="reservation-success-text">
          Thank you,{" "}
          <strong>{reservation.name}</strong>.
          Your reservation request has been
          received successfully.
        </p>

        <div className="reservation-id-box">
          <span>Reservation ID</span>

          <strong>
            #{reservationId}
          </strong>
        </div>

        <div className="reservation-success-details">
          <div>
            <span>Date</span>
            <strong>{reservation.date}</strong>
          </div>

          <div>
            <span>Time</span>
            <strong>{reservation.time}</strong>
          </div>

          <div>
            <span>Guests</span>
            <strong>{reservation.guests}</strong>
          </div>
        </div>

        <p className="reservation-pending-note">
          Your request is currently{" "}
          <strong>Pending</strong>.
          The hotel will confirm your table.
        </p>

        <button
          type="button"
          className="reservation-done-button"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="reservation-form-card">
      <div className="reservation-form-header">
        <div>
          <span className="reservation-form-label">
            BOOK YOUR TABLE
          </span>

          <h2>
            Reserve at <em>Rajwada.</em>
          </h2>

          <p>
            Choose your date, time and number
            of guests.
          </p>
        </div>

        <button
          type="button"
          className="reservation-form-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close reservation"
        >
          ×
        </button>
      </div>

      <form
        className="reservation-form"
        onSubmit={handleSubmit}
      >
        <div className="reservation-form-grid">
          <div className="reservation-field">
            <label htmlFor="reservation-name">
              Your Name
            </label>

            <input
              id="reservation-name"
              type="text"
              placeholder="Enter your name"
              value={reservation.name}
              onChange={(event) =>
                handleChange(
                  "name",
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="reservation-field">
            <label htmlFor="reservation-phone">
              Mobile Number
            </label>

            <input
              id="reservation-phone"
              type="tel"
              inputMode="numeric"
              maxLength="10"
              placeholder="10-digit mobile"
              value={reservation.phone}
              onChange={(event) =>
                handleChange(
                  "phone",
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              disabled={loading}
              autoComplete="tel"
            />
          </div>

          <div className="reservation-field">
            <label htmlFor="reservation-date">
              Date
            </label>

            <input
              id="reservation-date"
              type="date"
              min={getToday()}
              value={reservation.date}
              onChange={(event) =>
                handleChange(
                  "date",
                  event.target.value
                )
              }
              disabled={loading}
            />
          </div>

          <div className="reservation-field">
            <label htmlFor="reservation-time">
              Time
            </label>

            <input
              id="reservation-time"
              type="time"
              value={reservation.time}
              onChange={(event) =>
                handleChange(
                  "time",
                  event.target.value
                )
              }
              disabled={loading}
            />
          </div>

          <div className="reservation-field">
            <label htmlFor="reservation-guests">
              Guests
            </label>

            <select
              id="reservation-guests"
              value={reservation.guests}
              onChange={(event) =>
                handleChange(
                  "guests",
                  event.target.value
                )
              }
              disabled={loading}
            >
              {Array.from(
                { length: 10 },
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

          <div className="reservation-field">
            <label htmlFor="reservation-request">
              Special Request
            </label>

            <input
              id="reservation-request"
              type="text"
              placeholder="Birthday, family dinner, etc."
              value={reservation.request}
              onChange={(event) =>
                handleChange(
                  "request",
                  event.target.value
                )
              }
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div
            className="reservation-form-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="reservation-submit-button"
          disabled={loading}
        >
          {loading
            ? "Submitting Reservation..."
            : "Confirm Reservation →"}
        </button>

        <p className="reservation-form-note">
          Your reservation request will be
          sent to Hotel Rajwada for
          confirmation.
        </p>
      </form>
    </div>
  );
}

export default ReservationForm;
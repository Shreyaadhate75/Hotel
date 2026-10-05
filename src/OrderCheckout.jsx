import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./OrderCheckout.css";

function OrderCheckout({
  cartItems = [],
  totalAmount = 0,
  onClose,
  onOrderSuccess,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState("Pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Name validation
    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Phone validation
    const cleanPhone = customerPhone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Delivery address validation
    if (
      orderType === "Delivery" &&
      !deliveryAddress.trim()
    ) {
      setError("Please enter your delivery address.");
      return;
    }

    // Cart validation
    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    // Payment validation
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        id: item.id || null,
        name: item.name || "",
        marathi: item.marathi || "",
        price: Number(item.price || 0),
        quantity: Number(
          item.quantity || item.qty || 1
        ),
      }));

      const orderPayload = {
        customer_name: customerName.trim(),

        customer_phone: cleanPhone,

        order_type: orderType,

        delivery_address:
          orderType === "Delivery"
            ? deliveryAddress.trim()
            : null,

        items: orderItems,

        total_amount: Number(totalAmount) || 0,

        status: "Pending",

        payment_method: paymentMethod,

        payment_status:
          paymentMethod === "COD"
            ? "Pending"
            : "Pending",
      };

      console.log("Submitting order:", orderPayload);

      const { error: orderError } = await supabase
        .from("orders")
        .insert([orderPayload]);

      if (orderError) {
        console.error("Order insert error:", orderError);
        throw orderError;
      }

      setOrderId("Received");
      setSuccess(true);

      if (typeof onOrderSuccess === "function") {
        onOrderSuccess(orderPayload);
      }
    } catch (err) {
      console.error("Place order error:", err);

      setError(
        err?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUCCESS SCREEN ----------------

  if (success) {
    return (
      <div className="order-checkout-overlay">
        <div className="order-success-card">
          <div className="order-success-icon">
            ✓
          </div>

          <p className="order-success-label">
            HOTEL RAJWADA
          </p>

          <h2>Order Placed!</h2>

          <p className="order-success-text">
            Thank you{" "}
            <strong>{customerName}</strong>.
            Your order has been received
            successfully.
          </p>

          <div className="order-number-box">
            <span>Order Status</span>
            <strong>Received ✓</strong>
          </div>

          <div className="order-success-details">
            <div>
              <span>Order Type</span>
              <strong>{orderType}</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>
                {paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </strong>
            </div>

            <div>
              <span>Total</span>
              <strong>
                ₹{Number(totalAmount).toFixed(0)}
              </strong>
            </div>
          </div>

          {paymentMethod === "Online" && (
            <p
              style={{
                marginTop: "14px",
                fontSize: "13px",
                opacity: 0.75,
                textAlign: "center",
              }}
            >
              Online payment is currently pending.
              Payment/QR verification will be added
              in the next step.
            </p>
          )}

          {paymentMethod === "COD" && (
            <p
              style={{
                marginTop: "14px",
                fontSize: "13px",
                opacity: 0.7,
                textAlign: "center",
              }}
            >
              Please pay the amount when your order
              is delivered.
            </p>
          )}

          <button
            type="button"
            className="order-done-button"
            onClick={() => {
              if (typeof onClose === "function") {
                onClose();
              }
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ---------------- CHECKOUT FORM ----------------

  return (
    <div className="order-checkout-overlay">
      <div className="order-checkout-card">
        <div className="order-checkout-header">
          <div>
            <p>HOTEL RAJWADA</p>

            <h2>Complete Your Order</h2>

            <span>
              Enter your details to place
              your order.
            </span>
          </div>

          <button
            type="button"
            className="order-close-button"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* ---------------- ORDER SUMMARY ---------------- */}

        <div className="order-summary">
          <div className="order-summary-title">
            <span>Your Order</span>

            <strong>
              {cartItems.length}{" "}
              {cartItems.length === 1
                ? "item"
                : "items"}
            </strong>
          </div>

          <div className="order-items-list">
            {cartItems.map((item, index) => {
              const quantity = Number(
                item.quantity ||
                  item.qty ||
                  1
              );

              const price = Number(
                item.price || 0
              );

              return (
                <div
                  className="order-item-row"
                  key={
                    item.id ||
                    `${item.name}-${index}`
                  }
                >
                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      × {quantity}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {(
                      price * quantity
                    ).toFixed(0)}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="order-total-row">
            <span>Total Amount</span>

            <strong>
              ₹
              {Number(
                totalAmount
              ).toFixed(0)}
            </strong>
          </div>
        </div>

        <form
          className="order-checkout-form"
          onSubmit={handleSubmit}
        >
          {/* ---------------- NAME ---------------- */}

          <div className="order-form-group">
            <label htmlFor="customer-name">
              Full Name
            </label>

            <input
              id="customer-name"
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

          {/* ---------------- PHONE ---------------- */}

          <div className="order-form-group">
            <label htmlFor="customer-phone">
              Mobile Number
            </label>

            <input
              id="customer-phone"
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

          {/* ---------------- ORDER TYPE ---------------- */}

          <div className="order-form-group">
            <label>Order Type</label>

            <div className="order-type-options">
              <button
                type="button"
                className={
                  orderType === "Pickup"
                    ? "order-type-button active"
                    : "order-type-button"
                }
                onClick={() =>
                  setOrderType("Pickup")
                }
                disabled={loading}
              >
                <span>🏪</span>

                <div>
                  <strong>Pickup</strong>

                  <small>
                    Collect from hotel
                  </small>
                </div>
              </button>

              <button
                type="button"
                className={
                  orderType === "Delivery"
                    ? "order-type-button active"
                    : "order-type-button"
                }
                onClick={() =>
                  setOrderType("Delivery")
                }
                disabled={loading}
              >
                <span>🛵</span>

                <div>
                  <strong>Delivery</strong>

                  <small>
                    Deliver to address
                  </small>
                </div>
              </button>
            </div>
          </div>

          {/* ---------------- DELIVERY ADDRESS ---------------- */}

          {orderType === "Delivery" && (
            <div className="order-form-group">
              <label htmlFor="delivery-address">
                Delivery Address
              </label>

              <textarea
                id="delivery-address"
                rows="4"
                placeholder="Enter complete delivery address"
                value={deliveryAddress}
                onChange={(event) =>
                  setDeliveryAddress(
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>
          )}

          {/* ---------------- PAYMENT METHOD ---------------- */}

          <div className="order-form-group">
            <label>Payment Method</label>

            <div className="order-type-options">
              {/* COD */}

              <button
                type="button"
                className={
                  paymentMethod === "COD"
                    ? "order-type-button active"
                    : "order-type-button"
                }
                onClick={() =>
                  setPaymentMethod("COD")
                }
                disabled={loading}
              >
                <span>💵</span>

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when you receive
                  </small>
                </div>
              </button>

              {/* ONLINE */}

              <button
                type="button"
                className={
                  paymentMethod === "Online"
                    ? "order-type-button active"
                    : "order-type-button"
                }
                onClick={() =>
                  setPaymentMethod("Online")
                }
                disabled={loading}
              >
                <span>💳</span>

                <div>
                  <strong>
                    Online Payment
                  </strong>

                  <small>
                    Pay online
                  </small>
                </div>
              </button>
            </div>
          </div>

          {/* ONLINE PAYMENT INFORMATION */}

          {paymentMethod === "Online" && (
            <div
              style={{
                padding: "14px 16px",
                marginTop: "-4px",
                marginBottom: "16px",
                borderRadius: "12px",
                background: "rgba(212, 175, 55, 0.08)",
                border:
                  "1px solid rgba(212, 175, 55, 0.25)",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              <strong>
                💳 Online Payment
              </strong>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  opacity: 0.75,
                }}
              >
                Your order will be created with
                payment status as Pending.
                Online payment and QR verification
                will be connected next.
              </p>
            </div>
          )}

          {/* ---------------- ERROR ---------------- */}

          {error && (
            <div className="order-error">
              {error}
            </div>
          )}

          {/* ---------------- PLACE ORDER ---------------- */}

          <button
            type="submit"
            className="place-order-button"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : `Place Order • ₹${Number(
                  totalAmount
                ).toFixed(0)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderCheckout;


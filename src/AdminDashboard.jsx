import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./AdminDashboard.css";

const EMPTY_FORM = {
  name: "",
  marathi: "",
  category: "Main Course",
  type: "Veg",
  price: "",
  description: "",
  image: "",
  is_available: true,
  is_special: false,
};

const CATEGORIES = [
  "Biryani",
  "Starters",
  "Thali",
  "Main Course",
  "Desserts",
];

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

function AdminDashboard({ user, onLogout }) {
  /* ================================
     MENU STATE
  ================================= */

  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  /* ================================
     ORDERS STATE
  ================================= */

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  /* ================================
     RESERVATIONS STATE
  ================================= */

  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] =
    useState(true);
  const [reservationsError, setReservationsError] =
    useState("");
  const [updatingReservationId, setUpdatingReservationId] =
    useState(null);
  const [deletingReservationId, setDeletingReservationId] =
    useState(null);

  /* ================================
     LOAD MENU
  ================================= */

  const loadMenu = async () => {
    setMenuLoading(true);
    setMenuError("");

    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select(
          "id,name,marathi,category,type,price,description,image,is_available,is_special"
        )
        .order("id", { ascending: true });

      if (error) {
        console.error("Menu loading error:", error);
        setMenuError(error.message);
        setMenuItems([]);
        return;
      }

      setMenuItems(data || []);
    } catch (error) {
      console.error("Menu loading exception:", error);

      setMenuError(
        error?.message || "Could not load menu."
      );
    } finally {
      setMenuLoading(false);
    }
  };

  /* ================================
     LOAD ORDERS
  ================================= */

  const loadOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id,customer_name,customer_phone,order_type,status,total_amount,notes,created_at,delivery_address,items"
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Orders loading error:", error);
        setOrdersError(error.message);
        setOrders([]);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error(
        "Orders loading exception:",
        error
      );

      setOrdersError(
        error?.message || "Could not load orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  /* ================================
     LOAD RESERVATIONS
  ================================= */

  const loadReservations = async () => {
    setReservationsLoading(true);
    setReservationsError("");

    try {
      const { data, error } = await supabase
        .from("reservations")
        .select(
          "id,name,phone,reservation_date,reservation_time,guests,special_request,status"
        )
        .order("reservation_date", {
          ascending: true,
        })
        .order("reservation_time", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Reservations loading error:",
          error
        );

        setReservationsError(
          error.message
        );

        setReservations([]);
        return;
      }

      setReservations(data || []);
    } catch (error) {
      console.error(
        "Reservations loading exception:",
        error
      );

      setReservationsError(
        error?.message ||
          "Could not load reservations."
      );
    } finally {
      setReservationsLoading(false);
    }
  };

  /* ================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {
    loadMenu();
    loadOrders();
    loadReservations();
  }, []);

  /* ================================
     LOGOUT
  ================================= */

  const handleLogout = async () => {
    await supabase.auth.signOut();

    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  /* ================================
     MENU FORM
  ================================= */

  const openAddForm = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM });
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);

    setForm({
      name: item.name || "",
      marathi: item.marathi || "",
      category: item.category || "Main Course",
      type: item.type || "Veg",
      price: item.price ?? "",
      description: item.description || "",
      image: item.image || "",
      is_available: item.is_available ?? true,
      is_special: item.is_special ?? false,
    });

    setMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingItem(null);
    setForm({ ...EMPTY_FORM });
    setMessage("");
  };

  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ================================
     SAVE MENU ITEM
  ================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!form.name.trim()) {
      setMessage(
        "Please enter the dish name."
      );
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setMessage(
        "Please enter a valid price."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        marathi: form.marathi.trim(),
        category: form.category,
        type: form.type,
        price: Number(form.price),
        description:
          form.description.trim(),
        image: form.image.trim(),
        is_available: Boolean(
          form.is_available
        ),
        is_special: Boolean(
          form.is_special
        ),
      };

      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(payload)
          .eq("id", editingItem.id);

        if (error) {
          throw error;
        }

        setMessage(
          "Dish updated successfully."
        );
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert([payload]);

        if (error) {
          throw error;
        }

        setMessage(
          "New dish added successfully."
        );
      }

      await loadMenu();

      setShowForm(false);
      setEditingItem(null);
      setForm({ ...EMPTY_FORM });
    } catch (error) {
      console.error(
        "Menu save error:",
        error
      );

      setMessage(
        error?.message ||
          "Could not save the dish."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================
     DELETE MENU ITEM
  ================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dish?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setMenuItems((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      setMessage(
        "Dish deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      setMessage(
        error?.message ||
          "Could not delete the dish."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ================================
     TOGGLE AVAILABILITY
  ================================= */

  const toggleAvailability = async (item) => {
    setUpdatingId(item.id);
    setMessage("");

    try {
      const newValue =
        !item.is_available;

      const { error } = await supabase
        .from("menu_items")
        .update({
          is_available: newValue,
        })
        .eq("id", item.id);

      if (error) {
        throw error;
      }

      setMenuItems((previous) =>
        previous.map((menuItem) =>
          menuItem.id === item.id
            ? {
                ...menuItem,
                is_available:
                  newValue,
              }
            : menuItem
        )
      );
    } catch (error) {
      console.error(
        "Availability error:",
        error
      );

      setMessage(
        error?.message ||
          "Could not update availability."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================================
     TOGGLE SPECIAL
  ================================= */

  const toggleSpecial = async (item) => {
    setUpdatingId(item.id);
    setMessage("");

    try {
      if (!item.is_special) {
        const {
          error: resetError,
        } = await supabase
          .from("menu_items")
          .update({
            is_special: false,
          })
          .neq("id", item.id);

        if (resetError) {
          throw resetError;
        }
      }

      const newValue =
        !item.is_special;

      const { error } = await supabase
        .from("menu_items")
        .update({
          is_special: newValue,
        })
        .eq("id", item.id);

      if (error) {
        throw error;
      }

      await loadMenu();
    } catch (error) {
      console.error(
        "Special update error:",
        error
      );

      setMessage(
        error?.message ||
          "Could not update special."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================================
     UPDATE ORDER STATUS
  ================================= */

  const updateOrderStatus = async (
    order,
    newStatus
  ) => {
    if (!newStatus) {
      return;
    }

    if (newStatus === order.status) {
      return;
    }

    setUpdatingOrderId(order.id);
    setOrdersError("");

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
        })
        .eq("id", order.id);

      if (error) {
        throw error;
      }

      setOrders((previous) =>
        previous.map((item) =>
          item.id === order.id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Order status update error:",
        error
      );

      setOrdersError(
        error?.message ||
          "Could not update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  /* ================================
     DELETE ORDER
  ================================= */

  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingOrderId(orderId);
    setOrdersError("");

    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      setOrders((previous) =>
        previous.filter(
          (order) => order.id !== orderId
        )
      );
    } catch (error) {
      console.error(
        "Order delete error:",
        error
      );

      setOrdersError(
        error?.message ||
          "Could not delete order."
      );
    } finally {
      setDeletingOrderId(null);
    }
  };

  /* ================================
     UPDATE RESERVATION STATUS
  ================================= */

  const updateReservationStatus = async (
    reservation,
    newStatus
  ) => {
    if (!newStatus) {
      return;
    }

    if (
      newStatus === reservation.status
    ) {
      return;
    }

    setUpdatingReservationId(
      reservation.id
    );

    setReservationsError("");

    try {
      const { error } = await supabase
        .from("reservations")
        .update({
          status: newStatus,
        })
        .eq("id", reservation.id);

      if (error) {
        throw error;
      }

      setReservations((previous) =>
        previous.map((item) =>
          item.id === reservation.id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Reservation status update error:",
        error
      );

      setReservationsError(
        error?.message ||
          "Could not update reservation status."
      );
    } finally {
      setUpdatingReservationId(
        null
      );
    }
  };

  /* ================================
     DELETE RESERVATION
  ================================= */

  const deleteReservation = async (
    reservationId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingReservationId(
      reservationId
    );

    setReservationsError("");

    try {
      const { error } = await supabase
        .from("reservations")
        .delete()
        .eq("id", reservationId);

      if (error) {
        throw error;
      }

      setReservations((previous) =>
        previous.filter(
          (reservation) =>
            reservation.id !==
            reservationId
        )
      );
    } catch (error) {
      console.error(
        "Reservation delete error:",
        error
      );

      setReservationsError(
        error?.message ||
          "Could not delete reservation."
      );
    } finally {
      setDeletingReservationId(
        null
      );
    }
  };

  /* ================================
     RESERVATION HELPERS
  ================================= */

  const formatReservationDate = (
    date
  ) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatReservationTime = (
    time
  ) => {
    if (!time) {
      return "Time unavailable";
    }

    const parts = String(time).split(":");

    if (parts.length < 2) {
      return time;
    }

    let hours = Number(parts[0]);
    const minutes = parts[1];

    if (
      Number.isNaN(hours)
    ) {
      return time;
    }

    const period =
      hours >= 12 ? "PM" : "AM";

    hours =
      hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
  };

  const getReservationStatusClass = (
    status
  ) => {
    const cleanStatus = String(
      status || "pending"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `admin-reservation-status admin-reservation-status-${cleanStatus}`;
  };

  /* ================================
     ORDER HELPERS
  ================================= */

  const getOrderItems = (order) => {
    if (Array.isArray(order?.items)) {
      return order.items;
    }

    if (
      typeof order?.items === "string"
    ) {
      try {
        const parsed = JSON.parse(
          order.items
        );

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const formatOrderDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    const cleanStatus = String(
      status || "Pending"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `admin-order-status admin-order-status-${cleanStatus}`;
  };

  /* ================================
     STATS
  ================================= */

  const availableCount =
    menuItems.filter(
      (item) => item.is_available
    ).length;

  const specialCount =
    menuItems.filter(
      (item) => item.is_special
    ).length;

  const pendingOrders =
    orders.filter(
      (order) =>
        String(order.status)
          .toLowerCase() ===
        "pending"
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        String(order.status)
          .toLowerCase() ===
        "completed"
    ).length;

  const totalSales = orders
    .filter(
      (order) =>
        String(order.status)
          .toLowerCase() !==
        "cancelled"
    )
    .reduce(
      (total, order) =>
        total +
        Number(
          order.total_amount || 0
        ),
      0
    );

  const pendingReservations =
    reservations.filter(
      (reservation) =>
        String(
          reservation.status
        ).toLowerCase() ===
        "pending"
    ).length;

  return (
    <div className="admin-dashboard">
      {/* ================================
          HEADER
      ================================= */}

      <header className="admin-dashboard-header">
        <div>
          <p>HOTEL RAJWADA</p>

          <h1>
            Admin Dashboard
          </h1>
        </div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="admin-dashboard-content">
        {/* ================================
            WELCOME
        ================================= */}

        <div className="admin-welcome-card">
          <div>
            <span>
              Welcome back
            </span>

            <h2>
              Hotel Rajwada Admin
            </h2>

            <p>
              {user?.email ||
                "Admin Account"}
            </p>
          </div>

          <div className="admin-status">
            <span></span>
            Admin Active
          </div>
        </div>

        {/* ================================
            STATS
        ================================= */}

        <section className="admin-stat-grid">
          <div className="admin-stat-card">
            <span>🍽️</span>

            <p>
              Total Menu Items
            </p>

            <strong>
              {menuItems.length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>🟢</span>

            <p>
              Available Items
            </p>

            <strong>
              {availableCount}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>📦</span>

            <p>
              Pending Orders
            </p>

            <strong>
              {pendingOrders}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>💰</span>

            <p>
              Total Sales
            </p>

            <strong>
              ₹
              {totalSales.toFixed(0)}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>🪑</span>

            <p>
              Pending Reservations
            </p>

            <strong>
              {pendingReservations}
            </strong>
          </div>
        </section>

        {/* ================================
            RESERVATIONS MANAGEMENT
        ================================= */}

        <section className="admin-orders-section">
          <div className="admin-section-heading">
            <div>
              <p>
                TABLE RESERVATIONS
              </p>

              <h2>
                Customer Reservations
              </h2>

              <span>
                View reservation requests
                and update their status.
              </span>
            </div>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={
                loadReservations
              }
              disabled={
                reservationsLoading
              }
            >
              {reservationsLoading
                ? "Refreshing..."
                : "↻ Refresh Reservations"}
            </button>
          </div>

          {reservationsError && (
            <div className="admin-orders-error">
              {reservationsError}
            </div>
          )}

          {reservationsLoading ? (
            <div className="admin-orders-loading">
              <span>🪑</span>

              <p>
                Loading reservations...
              </p>
            </div>
          ) : reservations.length ===
            0 ? (
            <div className="admin-empty-orders">
              <span>🪑</span>

              <h3>
                No reservations yet
              </h3>

              <p>
                New customer table
                reservations will
                appear here.
              </p>
            </div>
          ) : (
            <div className="admin-orders-list">
              {reservations.map(
                (reservation) => (
                  <div
                    className="admin-order-card"
                    key={
                      reservation.id
                    }
                  >
                    {/* RESERVATION TOP */}

                    <div className="admin-order-top">
                      <div>
                        <div className="admin-order-id">
                          RESERVATION #
                          {
                            reservation.id
                          }
                        </div>

                        <h3>
                          {reservation.name ||
                            "Customer"}
                        </h3>

                        {reservation.phone && (
                          <a
                            className="admin-order-phone"
                            href={`tel:${reservation.phone}`}
                          >
                            📞{" "}
                            {
                              reservation.phone
                            }
                          </a>
                        )}
                      </div>

                      <div className="admin-order-top-right">
                        <span
                          className={getReservationStatusClass(
                            reservation.status
                          )}
                        >
                          {String(
                            reservation.status ||
                              "pending"
                          )
                            .charAt(0)
                            .toUpperCase() +
                            String(
                              reservation.status ||
                                "pending"
                            ).slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="admin-order-divider"></div>

                    {/* RESERVATION BODY */}

                    <div className="admin-order-body">
                      <div className="admin-order-items-box">
                        <div className="admin-order-box-title">
                          <span>
                            🪑 Reservation
                            Details
                          </span>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Date
                          </span>

                          <strong>
                            {formatReservationDate(
                              reservation.reservation_date
                            )}
                          </strong>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Time
                          </span>

                          <strong>
                            {formatReservationTime(
                              reservation.reservation_time
                            )}
                          </strong>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Guests
                          </span>

                          <strong>
                            {
                              reservation.guests
                            }{" "}
                            {Number(
                              reservation.guests
                            ) === 1
                              ? "Guest"
                              : "Guests"}
                          </strong>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Phone
                          </span>

                          <strong>
                            {reservation.phone ||
                              "—"}
                          </strong>
                        </div>
                      </div>

                      <div className="admin-order-details-box">
                        <div className="admin-order-box-title">
                          <span>
                            📋 Customer
                            Request
                          </span>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Customer
                          </span>

                          <strong>
                            {reservation.name ||
                              "—"}
                          </strong>
                        </div>

                        {reservation.special_request && (
                          <div className="admin-order-address">
                            <span>
                              Special Request
                            </span>

                            <p>
                              {
                                reservation.special_request
                              }
                            </p>
                          </div>
                        )}

                        <div className="admin-order-actions-box">
                          <label>
                            Update Status
                          </label>

                          <select
                            value={
                              reservation.status ||
                              "pending"
                            }
                            onChange={(
                              event
                            ) =>
                              updateReservationStatus(
                                reservation,
                                event.target
                                  .value
                              )
                            }
                            disabled={
                              updatingReservationId ===
                              reservation.id
                            }
                          >
                            {RESERVATION_STATUSES.map(
                              (
                                status
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {status
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase() +
                                    status.slice(
                                      1
                                    )}
                                </option>
                              )
                            )}
                          </select>

                          {updatingReservationId ===
                            reservation.id && (
                            <span className="admin-order-updating">
                              Updating...
                            </span>
                          )}

                          <button
                            type="button"
                            className="admin-order-delete-button"
                            onClick={() =>
                              deleteReservation(
                                reservation.id
                              )
                            }
                            disabled={
                              deletingReservationId ===
                              reservation.id
                            }
                          >
                            {deletingReservationId ===
                            reservation.id
                              ? "Deleting..."
                              : "🗑 Delete Reservation"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ================================
            ORDERS MANAGEMENT
        ================================= */}

        <section className="admin-orders-section">
          <div className="admin-section-heading">
            <div>
              <p>
                ORDER MANAGEMENT
              </p>

              <h2>
                Customer Orders
              </h2>

              <span>
                View orders and update
                their status.
              </span>
            </div>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={loadOrders}
              disabled={
                ordersLoading
              }
            >
              {ordersLoading
                ? "Refreshing..."
                : "↻ Refresh Orders"}
            </button>
          </div>

          {ordersError && (
            <div className="admin-orders-error">
              {ordersError}
            </div>
          )}

          {ordersLoading ? (
            <div className="admin-orders-loading">
              <span>📦</span>

              <p>
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="admin-empty-orders">
              <span>📭</span>

              <h3>
                No orders yet
              </h3>

              <p>
                New customer orders
                will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => {
                const orderItems =
                  getOrderItems(
                    order
                  );

                return (
                  <div
                    className="admin-order-card"
                    key={order.id}
                  >
                    {/* ORDER TOP */}

                    <div className="admin-order-top">
                      <div>
                        <div className="admin-order-id">
                          ORDER #
                          {order.id}
                        </div>

                        <h3>
                          {order.customer_name ||
                            "Customer"}
                        </h3>

                        {order.customer_phone && (
                          <a
                            className="admin-order-phone"
                            href={`tel:${order.customer_phone}`}
                          >
                            📞{" "}
                            {
                              order.customer_phone
                            }
                          </a>
                        )}
                      </div>

                      <div className="admin-order-top-right">
                        <span
                          className={getStatusClass(
                            order.status
                          )}
                        >
                          {order.status ||
                            "Pending"}
                        </span>

                        <span className="admin-order-date">
                          {formatOrderDate(
                            order.created_at
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="admin-order-divider"></div>

                    {/* ORDER BODY */}

                    <div className="admin-order-body">
                      {/* ITEMS */}

                      <div className="admin-order-items-box">
                        <div className="admin-order-box-title">
                          <span>
                            🍽️ Ordered Items
                          </span>

                          <strong>
                            {orderItems.length}{" "}
                            {orderItems.length ===
                            1
                              ? "item"
                              : "items"}
                          </strong>
                        </div>

                        {orderItems.length ===
                        0 ? (
                          <p className="admin-no-order-items">
                            No item details
                            available.
                          </p>
                        ) : (
                          <div className="admin-order-item-list">
                            {orderItems.map(
                              (
                                item,
                                index
                              ) => {
                                const quantity =
                                  Number(
                                    item?.quantity ||
                                      item?.qty ||
                                      1
                                  );

                                const price =
                                  Number(
                                    item?.price ||
                                      0
                                  );

                                return (
                                  <div
                                    className="admin-order-item"
                                    key={
                                      item?.id ||
                                      `${item?.name}-${index}`
                                    }
                                  >
                                    <div>
                                      <strong>
                                        {item?.name ||
                                          "Item"}
                                      </strong>

                                      <span>
                                        ×{" "}
                                        {
                                          quantity
                                        }
                                      </span>

                                      {item?.marathi && (
                                        <small>
                                          {
                                            item.marathi
                                          }
                                        </small>
                                      )}
                                    </div>

                                    <strong>
                                      ₹
                                      {(
                                        price *
                                        quantity
                                      ).toFixed(
                                        0
                                      )}
                                    </strong>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}

                        <div className="admin-order-total">
                          <span>
                            Total Amount
                          </span>

                          <strong>
                            ₹
                            {Number(
                              order.total_amount ||
                                0
                            ).toFixed(0)}
                          </strong>
                        </div>
                      </div>

                      {/* DETAILS */}

                      <div className="admin-order-details-box">
                        <div className="admin-order-box-title">
                          <span>
                            📋 Order Details
                          </span>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Order Type
                          </span>

                          <strong>
                            {order.order_type ||
                              "—"}
                          </strong>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Customer
                          </span>

                          <strong>
                            {order.customer_name ||
                              "—"}
                          </strong>
                        </div>

                        <div className="admin-order-detail-row">
                          <span>
                            Phone
                          </span>

                          <strong>
                            {order.customer_phone ||
                              "—"}
                          </strong>
                        </div>

                        {order.delivery_address && (
                          <div className="admin-order-address">
                            <span>
                              Delivery Address
                            </span>

                            <p>
                              {
                                order.delivery_address
                              }
                            </p>
                          </div>
                        )}

                        {order.notes && (
                          <div className="admin-order-address">
                            <span>
                              Notes
                            </span>

                            <p>
                              {
                                order.notes
                              }
                            </p>
                          </div>
                        )}

                        {/* ACTIONS */}

                        <div className="admin-order-actions-box">
                          <label>
                            Update Status
                          </label>

                          <select
                            value={
                              order.status ||
                              "Pending"
                            }
                            onChange={(
                              event
                            ) =>
                              updateOrderStatus(
                                order,
                                event.target
                                  .value
                              )
                            }
                            disabled={
                              updatingOrderId ===
                              order.id
                            }
                          >
                            {ORDER_STATUSES.map(
                              (
                                status
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {
                                    status
                                  }
                                </option>
                              )
                            )}
                          </select>

                          {updatingOrderId ===
                            order.id && (
                            <span className="admin-order-updating">
                              Updating...
                            </span>
                          )}

                          <button
                            type="button"
                            className="admin-order-delete-button"
                            onClick={() =>
                              deleteOrder(
                                order.id
                              )
                            }
                            disabled={
                              deletingOrderId ===
                              order.id
                            }
                          >
                            {deletingOrderId ===
                            order.id
                              ? "Deleting..."
                              : "🗑 Delete Order"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================
            MENU MANAGEMENT
        ================================= */}

        <section className="admin-menu-section">
          <div className="admin-section-heading">
            <div>
              <p>
                MANAGEMENT
              </p>

              <h2>
                Menu Management
              </h2>

              <span>
                Add, edit, delete and
                control your live menu.
              </span>
            </div>

            <button
              type="button"
              className="admin-add-button"
              onClick={openAddForm}
            >
              + Add New Dish
            </button>
          </div>

          {message && (
            <div className="admin-message">
              {message}
            </div>
          )}

          {menuError && (
            <div className="admin-login-error">
              {menuError}
            </div>
          )}

          {menuLoading ? (
            <div className="admin-menu-loading">
              Loading menu...
            </div>
          ) : menuItems.length ===
            0 ? (
            <div className="admin-empty-menu">
              <span>🍽️</span>

              <h3>
                No menu items found
              </h3>

              <p>
                Add your first dish
                using the button above.
              </p>
            </div>
          ) : (
            <div className="admin-menu-list">
              {menuItems.map(
                (item) => (
                  <div
                    className="admin-menu-item"
                    key={item.id}
                  >
                    <div className="admin-menu-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <span>
                          🍽️
                        </span>
                      )}
                    </div>

                    <div className="admin-menu-info">
                      <div className="admin-menu-title-row">
                        <div>
                          <h3>
                            {item.name}
                          </h3>

                          {item.marathi && (
                            <p className="admin-marathi">
                              {
                                item.marathi
                              }
                            </p>
                          )}
                        </div>

                        {item.is_special && (
                          <span className="admin-special-badge">
                            ⭐ Special
                          </span>
                        )}
                      </div>

                      <div className="admin-menu-meta">
                        <span>
                          {
                            item.category
                          }
                        </span>

                        <span
                          className={
                            item.type ===
                            "Veg"
                              ? "admin-veg"
                              : "admin-nonveg"
                          }
                        >
                          {item.type}
                        </span>
                      </div>

                      <p className="admin-menu-description">
                        {item.description ||
                          "No description added."}
                      </p>

                      <strong className="admin-menu-price">
                        ₹
                        {Number(
                          item.price ||
                            0
                        )}
                      </strong>

                      <div className="admin-menu-actions">
                        <button
                          type="button"
                          className={
                            item.is_available
                              ? "admin-availability-on"
                              : "admin-availability-off"
                          }
                          onClick={() =>
                            toggleAvailability(
                              item
                            )
                          }
                          disabled={
                            updatingId ===
                            item.id
                          }
                        >
                          {item.is_available
                            ? "🟢 Available"
                            : "🔴 Unavailable"}
                        </button>

                        <button
                          type="button"
                          className={
                            item.is_special
                              ? "admin-special-on"
                              : "admin-special-off"
                          }
                          onClick={() =>
                            toggleSpecial(
                              item
                            )
                          }
                          disabled={
                            updatingId ===
                            item.id
                          }
                        >
                          {item.is_special
                            ? "⭐ Special ON"
                            : "☆ Make Special"}
                        </button>

                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() =>
                            openEditForm(
                              item
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          disabled={
                            deletingId ===
                            item.id
                          }
                        >
                          {deletingId ===
                          item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ================================
            ADD / EDIT MODAL
        ================================= */}

        {showForm && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="admin-modal-header">
                <div>
                  <p>
                    HOTEL RAJWADA
                  </p>

                  <h2>
                    {editingItem
                      ? "Edit Dish"
                      : "Add New Dish"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={closeForm}
                  disabled={saving}
                >
                  ×
                </button>
              </div>

              <form
                className="admin-menu-form"
                onSubmit={
                  handleSave
                }
              >
                <div className="admin-form-grid">
                  <div className="admin-input-group">
                    <label>
                      Dish Name *
                    </label>

                    <input
                      name="name"
                      value={
                        form.name
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="e.g. Chicken Biryani"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>
                      Marathi Name
                    </label>

                    <input
                      name="marathi"
                      value={
                        form.marathi
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="उदा. चिकन बिर्याणी"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>
                      Category *
                    </label>

                    <select
                      name="category"
                      value={
                        form.category
                      }
                      onChange={
                        handleInputChange
                      }
                    >
                      {CATEGORIES.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category
                            }
                            value={
                              category
                            }
                          >
                            {
                              category
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="admin-input-group">
                    <label>
                      Food Type *
                    </label>

                    <select
                      name="type"
                      value={
                        form.type
                      }
                      onChange={
                        handleInputChange
                      }
                    >
                      <option value="Veg">
                        Veg
                      </option>

                      <option value="Non-Veg">
                        Non-Veg
                      </option>
                    </select>
                  </div>

                  <div className="admin-input-group">
                    <label>
                      Price (₹) *
                    </label>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      value={
                        form.price
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="250"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>
                      Image URL
                    </label>

                    <input
                      name="image"
                      type="url"
                      value={
                        form.image
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="admin-input-group">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Short description of the dish"
                    rows="4"
                  />
                </div>

                <div className="admin-form-options">
                  <label className="admin-check-option">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={
                        form.is_available
                      }
                      onChange={
                        handleInputChange
                      }
                    />

                    <span>
                      Available on
                      customer menu
                    </span>
                  </label>

                  <label className="admin-check-option">
                    <input
                      type="checkbox"
                      name="is_special"
                      checked={
                        form.is_special
                      }
                      onChange={
                        handleInputChange
                      }
                    />

                    <span>
                      Today's Special
                    </span>
                  </label>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="admin-cancel-button"
                    onClick={
                      closeForm
                    }
                    disabled={
                      saving
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-save-button"
                    disabled={
                      saving
                    }
                  >
                    {saving
                      ? "Saving..."
                      : editingItem
                      ? "Update Dish"
                      : "Add Dish"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;


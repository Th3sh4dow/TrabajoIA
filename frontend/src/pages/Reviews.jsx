import { useState, useEffect } from "react";
import "../css/Reviews.css";
import Bar from "../components/Navbar.jsx";
import { useUser } from "../context/UserContext";

function Reviews() {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Traer reseñas
  useEffect(() => {
    fetch("http://localhost:3001/reviews")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch(err => {
        console.error(err);
        setReviews([]);
        showNotification("Error al cargar las reseñas", "error");
      });
  }, []);

  // Enviar reseña
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      showNotification("Debes iniciar sesión para dejar una reseña", "error");
      return;
    }

    if (!form.comment) {
      showNotification("Por favor escribe un comentario", "error");
      return;
    }

    const reviewData = {
      user_name: user.name,
      rating: form.rating,
      comment: form.comment
    };

    fetch("http://localhost:3001/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData)
    })
      .then(res => res.json())
      .then(newReview => {
        if (newReview.error) {
          showNotification(newReview.error, "error");
        } else {
          setReviews(prev => [newReview, ...prev]);
          showNotification("¡Reseña publicada con éxito!", "success");
          setForm({ rating: 5, comment: "" });
        }
      })
      .catch(err => {
        console.error(err);
        showNotification("Error al publicar la reseña", "error");
      });
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <>
      <Bar />
      <div className="reviews-container">
        <div className="reviews-header">
          <h2>NEURAL FEEDBACK SYSTEM</h2>
          <p className="reviews-subtitle">Share your experience with the network</p>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-grid">
            <div className="form-group">
              <label>NEURAL ID</label>
              <input
                type="text"
                value={user ? user.name : "Inicia sesión para comentar"}
                disabled
              />
            </div>
            <div className="form-group">
              <label>RATING LEVEL</label>
              <select
                value={form.rating}
                onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>FEEDBACK MESSAGE</label>
            <textarea
              placeholder="Share your thoughts..."
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              required
              rows="4"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={!user}>
            <span>{user ? "TRANSMIT FEEDBACK" : "LOGIN TO COMMENT"}</span>
            <span className="btn-icon">→</span>
          </button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No feedback signals detected</p>
              <p className="no-reviews-sub">Be the first to share your experience</p>
            </div>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="user-avatar">
                      {r.user_name ? r.user_name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <h4>{r.user_name || "Anonymous"}</h4>
                      <small>{r.created_at ? new Date(r.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "Recent"}</small>
                    </div>
                  </div>
                  <div className="review-rating">{renderStars(r.rating || 5)}</div>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))
          )}
        </div>

        {notification && (
          <div className={`notification ${notification.type}`}>
            <span className="notificationIcon">{notification.type === "success" ? "✓" : "⚠"}</span>
            <span>{notification.message}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Reviews;

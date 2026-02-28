import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";

function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login o signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/menu'
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      showNotification("Error al conectar con Google: " + err.message, "error");
    }
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!email || !password || (mode === "signup" && !name)) {
      showNotification("Por favor, completa todos los campos", "error");
      return;
    }

    const url =
      mode === "login"
        ? "http://localhost:3001/users/login"
        : "http://localhost:3001/users/signup";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(data.message, "success");
        // Opcional: redirigir al menú si login correcto
        if (mode === "login") {
          login(data.user); // Save to context
          setTimeout(() => navigate("/menu"), 1000);
        } else {
          // después de signup, cambiar a login
          setTimeout(() => {
            setMode("login");
            setName("");
            setPassword("");
          }, 1500);
        }
      } else {
        showNotification(data.error, "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error en la conexión con el servidor", "error");
    }
  };

  return (
    <div className="loginPage">
      <div className="gridBackground"></div>

      <div className="loginCard">
        <h2 className="title">SYSTEM ACCESS</h2>
        <p className="subtitle">Secure Neural Link Required</p>

        <div className="modeSwitch">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            LOGIN
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            SIGN UP
          </button>
        </div>

        <div className="form">
          {mode === "signup" && (
            <>
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          <label>NEURAL ID (EMAIL)</label>
          <input
            type="email"
            placeholder="name@network.node"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>PASSCODE</label>
          <div className="passwordField">
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye">👁</span>
          </div>

          <a className="recovery">ENCRYPTION RECOVERY?</a>

          <button className="mainBtn" onClick={handleSubmit}>
            {mode === "login" ? "INITIALIZE ACCESS" : "CREATE IDENTITY"}
          </button>

          <div className="divider">OR LINKED IDENTITY</div>

          <div className="social">
            <button className="socialBtn" onClick={handleGoogleLogin}>G-ID</button>
            <button className="socialBtn">A-LINK</button>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notificationIcon">{notification.type === "success" ? "✓" : "⚠"}</span>
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}

export default Login;

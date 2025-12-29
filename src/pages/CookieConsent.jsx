import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <p style={styles.text}>
          We use cookies to enhance your browsing experience, analyze site traffic,
          and improve our services. By clicking <strong>“Accept”</strong>, you agree
          to our use of cookies. You can manage your preferences at any time.
        </p>

        <div style={styles.actions}>
          <button style={styles.accept} onClick={acceptCookies}>
            Accept
          </button>
          <button style={styles.decline} onClick={declineCookies}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 20,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 9999,
    padding: "0 16px",
  },
  box: {
    background: "#111",
    color: "#fff",
    maxWidth: "520px",
    width: "100%",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    fontSize: "14px",
  },
  text: {
    marginBottom: "16px",
    lineHeight: "1.5",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  accept: {
    background: "#22c55e",
    color: "#000",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  },
  decline: {
    background: "transparent",
    color: "#ccc",
    border: "1px solid #555",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

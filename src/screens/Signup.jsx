import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    country: "",
    city: "",
    zip_code: "",
    phone: "",
    occupation: "",
    dob: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSignup = async (e) => {
  e.preventDefault();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  });

  if (authError) {
    alert(authError.message);
    return;
  }

  alert("Signup successful! Please check your email to confirm.");
  navigate("/login");
};


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
          padding: "2.5rem 2rem",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h2
          style={{
            color:"darkgrey",
            marginBottom: "1.5rem",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
           

          }}
        >
          Create Your Account
        </h2>
        <form
          onSubmit={handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              name="country"
              placeholder="Country"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              name="zip_code"
              placeholder="Zip Code"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <input
            name="occupation"
            placeholder="Occupation"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="date"
            name="dob"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              padding: "0.75rem 1rem",
              background: "linear-gradient(to right, #56ccf2, #2f80ed)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.03)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.75rem 1rem",
  border: "1px solid #ccc",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  outline: "none",
  width: "100%",
  transition: "border 0.3s",
};

export default Signup;

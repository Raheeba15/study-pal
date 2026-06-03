import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // ⬅️ Import this
import Signup from "../src/screens/Signup";
import { supabase } from "../src/screens/supabaseClient";

jest.mock("../src/screens/supabaseClient");

beforeAll(() => {
  window.alert = jest.fn(); // Mock alert so it doesn't throw
});

describe("Signup", () => {
  test("renders all inputs and submits form", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: "test-user-id" } },
      error: null,
    });
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter> {/* ⬅️ Wrap in BrowserRouter */}
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText("Email"), { target: { value: "test@email.com" } });
    fireEvent.change(getByPlaceholderText("Password"), { target: { value: "test1234" } });
    fireEvent.change(getByPlaceholderText("First Name"), { target: { value: "Test" } });
    fireEvent.change(getByPlaceholderText("Last Name"), { target: { value: "User" } });
    fireEvent.change(getByPlaceholderText("Country"), { target: { value: "Pakistan" } });
    fireEvent.change(getByPlaceholderText("City"), { target: { value: "Lahore" } });
    fireEvent.change(getByPlaceholderText("Zip Code"), { target: { value: "54000" } });
    fireEvent.change(getByPlaceholderText("Phone Number"), { target: { value: "1234567890" } });
    fireEvent.change(getByPlaceholderText("Occupation"), { target: { value: "Student" } });
    fireEvent.change(getByPlaceholderText("Date of Birth"), { target: { value: "2000-01-01" } });

    fireEvent.click(getByText("Sign Up"));

    await waitFor(() =>
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "test1234",
      })
    );
  });
});

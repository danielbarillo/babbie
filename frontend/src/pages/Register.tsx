import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import type { StoreState } from "../types/store";

export function Register() {
  const navigate = useNavigate();
  const { register, error } = useStore((state: StoreState) => ({
    register: state.auth.register,
    error: state.auth.error
  }));

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { username, email, password } = formData;
      await register(email, password, username);
      navigate("/chat");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
      <Card className="w-full max-w-md p-8 space-y-6 bg-[#1a2733] border-[#1f1f1f]">
        <h1 className="text-2xl font-bold text-center text-gray-200">
          Register for Chappy
        </h1>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-gray-400">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-[#0C0C0C] border-[#1f1f1f] text-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-400">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-[#0C0C0C] border-[#1f1f1f] text-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-400">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-[#0C0C0C] border-[#1f1f1f] text-gray-200"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Register
          </Button>
        </form>
      </Card>
    </div>
  );
}

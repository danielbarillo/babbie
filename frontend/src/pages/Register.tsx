import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";

export function Register() {
  const navigate = useNavigate();
  const { register, error } = useStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
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
          Registrera dig på Chappy
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-gray-400">
              Användarnamn
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
              E-post
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
              Lösenord
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

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-200"
          >
            Registrera
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Har du redan ett konto?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline"
          >
            Logga in
          </button>
        </div>
      </Card>
    </div>
  );
}

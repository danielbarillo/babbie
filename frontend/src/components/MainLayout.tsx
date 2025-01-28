import { useEffect } from "react";
import { useAuth } from "../store/useStore";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

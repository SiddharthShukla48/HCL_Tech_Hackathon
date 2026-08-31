import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Outlet />
    </div>
  );
}
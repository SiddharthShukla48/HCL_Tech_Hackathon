import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex">
      <Outlet />
    </div>
  );
}
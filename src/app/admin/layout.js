import AdminClientWrapper from "@/components/layout/AdminClientWrapper";

export const metadata = {
  title: "Admin Dashboard | Cafe Panel",
  description: "Manage orders, menu, and settings for the Cafe.",
};

export default function AdminLayout({ children }) {
  return <AdminClientWrapper>{children}</AdminClientWrapper>;
};
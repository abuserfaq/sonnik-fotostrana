import { AdminOutboundBar } from '@/components/admin/AdminOutboundBar';

import '@/app/admin/admin.css';

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-root">
      <AdminOutboundBar />
      {children}
    </div>
  );
}

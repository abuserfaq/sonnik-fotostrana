import { LoginForm } from '@/components/admin/LoginForm';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const q = await searchParams;
  const next = q.next?.startsWith('/') ? q.next : '/admin';
  return <LoginForm nextPath={next} />;
}

import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function EloRedirect() {
  redirect(ROUTES.elo.management);
  return null;
}

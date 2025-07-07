import { redirect } from 'next/navigation';

export default function EloRedirect() {
  redirect('/elo/management');
  return null;
}

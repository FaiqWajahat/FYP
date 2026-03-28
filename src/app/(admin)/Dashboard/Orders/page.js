import { redirect } from 'next/navigation';

export default function OrdersIndexPage() {
  redirect('/Dashboard/Orders/All');
}

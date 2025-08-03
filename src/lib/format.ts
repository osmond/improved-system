import { format } from 'date-fns';

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy') {
  return format(new Date(date), fmt);
}

export function formatMiles(miles: number) {
  return `${miles}mi`;
}

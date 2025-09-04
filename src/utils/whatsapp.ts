import { CartItem } from '../store/cart'
import { STORE } from '../config'

export function buildWhatsAppOrderText(params: {
  customer: { name: string; phone: string; address: string }
  items: CartItem[]
  note?: string
}) {
  const { customer, items, note } = params
  const lines = [
    `New order from ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    '',
    'Items:',
    ...items.map((i) => `• ${i.qty} x ${i.name} — ₦${(i.price * i.qty).toLocaleString('en-NG')}`),
    '',
    `Total: ₦${items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('en-NG')}`,
    '',
    'Payment: Bank Transfer',
    `${STORE.bank.accountName} — ${STORE.bank.name}`,
    `Acct No: ${STORE.bank.accountNumber}`,
  ]
  if (note) lines.push('', `Note: ${note}`)
  return lines.join('\n')
}

export function whatsappCheckoutURL(text: string) {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(text)}`
}

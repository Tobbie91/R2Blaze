import { STORE } from '../config'

export default function BankPanel() {
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); alert('Copied'); } catch {}
  }
  const { accountName, accountNumber, name } = STORE.bank
  return (
    <div className="border rounded-xl p-4 bg-green-50">
      <div className="font-semibold mb-1">Bank Transfer Details</div>
      <div className="text-sm">Bank: <b>{name}</b></div>
      <div className="text-sm">Account Name: <b>{accountName}</b></div>
      <div className="text-sm">Account Number: <b>{accountNumber}</b></div>
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 text-sm rounded bg-green-600 text-white" onClick={() => copy(accountNumber)}>Copy Acct No</button>
        <button className="px-3 py-1 text-sm rounded border" onClick={() => copy(`${accountName} - ${name} - ${accountNumber}`)}>Copy All</button>
      </div>
      <p className="text-xs text-gray-600 mt-2">After transfer, click the WhatsApp button to send your order + proof of payment.</p>
    </div>
  )
}

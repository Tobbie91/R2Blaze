import { Shield, Truck, RotateCcw } from 'lucide-react'

export default function Highlights() {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <div className="border rounded-xl p-4 flex items-center gap-3">
        <Shield className="text-emerald-700" />
        <div>
          <div className="font-semibold">100% Authentic</div>
          <div className="text-sm text-gray-600">Direct from global brands</div>
        </div>
      </div>
      <div className="border rounded-xl p-4 flex items-center gap-3">
        <Truck className="text-emerald-700" />
        <div>
          <div className="font-semibold">Fast Delivery</div>
          <div className="text-sm text-gray-600">Lagos pickup & nationwide shipping</div>
        </div>
      </div>
      <div className="border rounded-xl p-4 flex items-center gap-3">
        <RotateCcw className="text-emerald-700" />
        <div>
          <div className="font-semibold">7-Day Returns</div>
          <div className="text-sm text-gray-600">Unworn, full packaging</div>
        </div>
      </div>
    </div>
  )
}

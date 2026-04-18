"use client"

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function BreakevenPage() {
  const [rent,      setRent]      = useState(15000)
  const [salaries,  setSalaries]  = useState(20000)
  const [utilities, setUtilities] = useState(3000)
  const [other,     setOther]     = useState(2000)
  const [avgPrice,  setAvgPrice]  = useState(85)
  const [avgCost,   setAvgCost]   = useState(25)
  const [daysOpen,  setDaysOpen]  = useState(26)

  const fixedTotal  = rent + salaries + utilities + other
  const unitMargin  = avgPrice - avgCost
  const beUnits     = unitMargin > 0 ? Math.ceil(fixedTotal / unitMargin) : 0
  const bePerDay    = daysOpen > 0 ? Math.ceil(beUnits / daysOpen) : 0
  const beRevenue   = beUnits * avgPrice
  const fcPct       = avgPrice > 0 ? (avgCost / avgPrice) * 100 : 0

  const FIXED_COSTS = [
    { label: '🏠 ค่าเช่า',              val: rent,      set: setRent },
    { label: '👤 เงินเดือนพนักงาน',    val: salaries,  set: setSalaries },
    { label: '⚡ ค่าน้ำไฟ',            val: utilities, set: setUtilities },
    { label: '📦 ค่าใช้จ่ายอื่นๆ',     val: other,     set: setOther },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="bg-white border-b border-cream-border px-6 py-4 flex items-center gap-4">
        <div className="text-2xl flex gap-1">
          {Array.from('☕🍪🥐🎂🫖🧁🍫').map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-coffee leading-tight">
            Break-Even Calculator
          </h1>
          <p className="text-xs text-green-600 font-light mt-0.5">
            คำนวณว่าต้องขายกี่แก้ว/ชิ้นถึงจะคุ้มทุน
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* FIXED COSTS */}
        <div className="bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-border">
            <span className="text-lg">🏗️</span>
            <span className="text-sm font-medium">ต้นทุนคงที่ต่อเดือน</span>
          </div>
          <div className="p-4 space-y-3">
            {FIXED_COSTS.map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-muted">{row.label}</span>
                <div className="flex items-center gap-1">
                  <input type="number" min={0} value={row.val}
                    onChange={e => row.set(+e.target.value)}
                    className="w-24 px-2 py-1 text-xs rounded-lg border border-cream-border
                               bg-cream text-right focus:outline-none focus:border-caramel" />
                  <span className="text-[10px] text-muted w-6">฿</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-cream-border flex justify-between">
              <span className="text-xs font-medium text-gray-900">รวมต้นทุนคงที่</span>
              <span className="text-sm font-display font-semibold text-coffee">
                ฿{fixedTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* VARIABLE + CONFIG */}
        <div className="bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-border">
            <span className="text-lg">⚙️</span>
            <span className="text-sm font-medium">ข้อมูลการขาย</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: '💰 ราคาขายเฉลี่ย/แก้ว', val: avgPrice,  set: setAvgPrice,  unit: '฿' },
              { label: '🫘 ต้นทุนเฉลี่ย/แก้ว',  val: avgCost,   set: setAvgCost,   unit: '฿' },
              { label: '📅 วันที่เปิดร้าน/เดือน', val: daysOpen, set: setDaysOpen,  unit: 'วัน' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-muted">{row.label}</span>
                <div className="flex items-center gap-1">
                  <input type="number" min={0} value={row.val}
                    onChange={e => row.set(+e.target.value)}
                    className="w-20 px-2 py-1 text-xs rounded-lg border border-cream-border
                               bg-cream text-right focus:outline-none focus:border-caramel" />
                  <span className="text-[10px] text-muted w-8">{row.unit}</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-cream-border flex justify-between">
              <span className="text-xs text-muted">กำไรต่อแก้ว</span>
              <span className={`text-sm font-display font-semibold ${
                unitMargin > 0 ? 'text-green-600' : 'text-red-500'
              }`}>฿{unitMargin.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* RESULTS — full width */}
        <div className="md:col-span-2 bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border-b border-emerald-100">
            <span>✨</span>
            <span className="text-sm font-medium text-coffee">จุด Break-Even</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-cream-border">
            {[
              { emoji: '☕', label: 'ต้องขาย (แก้ว/เดือน)', value: beUnits.toLocaleString(),   sub: 'ทั้งเดือน' },
              { emoji: '📅', label: 'ต้องขาย (แก้ว/วัน)',   value: bePerDay.toLocaleString(),  sub: `เปิด ${daysOpen} วัน/เดือน` },
              { emoji: '💵', label: 'Revenue ที่ต้องถึง',   value: `฿${(beRevenue/1000).toFixed(1)}K`, sub: 'ต่อเดือน', green: true },
              { emoji: '📊', label: 'Food cost %',           value: `${fcPct.toFixed(0)}%`,     sub: 'เป้า <35%',
                colorClass: fcPct <= 35 ? 'text-green-600' : fcPct <= 45 ? 'text-coffee' : 'text-red-500' },
            ].map((cell, i) => (
              <div key={i} className="p-4 text-center">
                <div className="text-2xl mb-1">{cell.emoji}</div>
                <div className="text-[10px] text-muted mb-0.5">{cell.label}</div>
                <div className={`font-display text-2xl font-semibold ${
                  cell.colorClass ?? (cell.green ? 'text-green-700' : 'text-coffee')
                }`}>{cell.value}</div>
                <div className="text-[10px] text-muted mt-0.5">{cell.sub}</div>
              </div>
            ))}
          </div>

          {/* Scenario bar */}
          <div className="px-5 py-3 border-t border-cream-border bg-cream">
            <p className="text-xs font-medium text-gray-900 mb-2">Scenario: ถ้าขายได้...</p>
            <div className="flex gap-2 flex-wrap">
              {[0.7, 1.0, 1.3, 1.5].map(mult => {
                const units  = Math.round(beUnits * mult)
                const profit = units * unitMargin - fixedTotal
                return (
                  <div key={mult}
                    className={`flex-1 min-w-25 text-center p-2.5 rounded-xl border ${
                      profit >= 0
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                    <p className="text-[10px] text-muted">{units.toLocaleString()} แก้ว</p>
                    <p className={`text-sm font-display font-semibold ${
                      profit >= 0 ? 'text-green-700' : 'text-red-600'
                    }`}>
                      {profit >= 0 ? '+' : ''}฿{profit.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted">{mult === 1 ? 'break-even' : `×${mult}`}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

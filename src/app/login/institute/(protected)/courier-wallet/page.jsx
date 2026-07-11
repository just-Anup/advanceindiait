'use client'

import { useEffect, useState } from "react"
import { databases, account } from "@/lib/appwrite"
import { Query } from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

export default function CourierWalletPage() {
  const [wallet, setWallet] = useState(0)
  const [lastRecharge, setLastRecharge] = useState("")
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchWallet()
  }, [])

  const fetchWallet = async () => {
    const user = await account.get()

    // 🔥 GET FRANCHISE DATA
    const res = await databases.listDocuments(
      DATABASE_ID,
      "franchise_approved",
      [Query.equal("email", user.email)]
    )

    const franchise = res.documents[0]

    setWallet(franchise.courierWallet || 0)
    setLastRecharge(franchise.lastCourierRecharge || "-")

    // 🔥 GET COURIER TRANSACTIONS
    const txn = await databases.listDocuments(
      DATABASE_ID,
      "courier_transactions",
      [Query.equal("franchiseId", franchise.$id)]
    )

    setTransactions(txn.documents)
  }

  return (
    <div className="min-h-screen bg-[#0A1229] text-[#FBF9F4] relative overflow-hidden">
      {/* Ambient glow + subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(700px 320px at 18% 10%, rgba(201,162,75,0.18), transparent 60%), radial-gradient(620px 280px at 78% 18%, rgba(201,162,75,0.12), transparent 55%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 48px 48px, 48px 48px",
          backgroundPosition: "center, center, center, center",
        }}
      />

      <div className="relative px-8 py-28">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8">
          <h1 className="font-[Playfair_Display,serif] text-4xl sm:text-5xl font-semibold tracking-wide">
            Courier Wallet
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Premium view of your available balance and courier transactions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Wallet Card */}
          <section
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(201,162,75,0.10)] p-7 transition-all duration-300 hover:border-[#C9A24B]/70 hover:bg-white/7"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm tracking-widest uppercase text-white/60">
                  Available Balance
                </div>

                <div className="mt-3">
                  <div className="text-6xl md:text-7xl font-bold tracking-tight">
                    <span className="text-[#C9A24B] drop-shadow-[0_0_22px_rgba(201,162,75,0.22)]">
                      ₹{wallet}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-white/55">
                    Last Recharge: {lastRecharge}
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end">
                <div className="rounded-xl border border-white/10 bg-[#0A1229]/40 px-4 py-3">
                  <div className="text-xs text-white/60">Status</div>
                  <div className="mt-1 text-sm font-medium text-[#FBF9F4]">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 shadow-[0_0_60px_rgba(201,162,75,0.06)]">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="font-[Playfair_Display,serif] text-2xl font-semibold">
                Courier Transactions
              </h2>

              <div className="text-xs text-white/55 border border-white/10 rounded-full px-3 py-1">
                {transactions.length} record{transactions.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/60">
                  No transactions found
                </div>
              )}

              {transactions.map((item) => (
                <div
                  key={item.$id}
                  className="group flex justify-between items-center gap-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all duration-300 hover:border-[#C9A24B]/70 hover:bg-white/7"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate text-white/90">
                      {item.reason || "Transaction"}
                    </p>
                    <p className="text-sm text-white/55">
                      {new Date(item.date).toLocaleString()}
                    </p>
                  </div>

                  <p
                    className={
                      "font-bold whitespace-nowrap transition-colors duration-300 " +
                      (item.type === "add"
                        ? "text-emerald-400 group-hover:text-emerald-300"
                        : "text-rose-400 group-hover:text-rose-300")
                    }
                  >
                    {item.type === "add" ? "+" : "-"} ₹{item.amount}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}


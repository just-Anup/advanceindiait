'use client'

import { useEffect, useState } from "react"
import { databases, account } from "@/lib/appwrite"
import { Query } from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

export default function FranchiseWalletPage() {

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

    setWallet(franchise.wallet || 0)
    setLastRecharge(franchise.lastRecharge || "-")

    // 🔥 GET TRANSACTIONS
    const txn = await databases.listDocuments(
      DATABASE_ID,
      "wallet_transactions",
      [Query.equal("franchiseId", franchise.$id)]
    )

    setTransactions(txn.documents)
  }

  return (
    <div className="relative min-h-screen bg-[#0A1229] px-8 py-28 text-[#FBF9F4] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#C9A24B]/10 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-[420px] w-[420px] rounded-full bg-[#C9A24B]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[520px] rounded-full bg-[#C9A24B]/10 blur-3xl" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(251,249,244,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,249,244,0.35)_1px,transparent_1px)] [background-size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A24B] shadow-[0_0_24px_rgba(201,162,75,0.35)]" />
            <p className="text-sm text-white/80 font-[Inter]">Institute Wallet</p>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-wide font-[Playfair_Display]">
            My Wallet
          </h2>
          <p className="mt-2 max-w-2xl text-white/70 font-[Inter]">
            Premium overview of balance and transaction history with a subtle glassmorphic interface.
          </p>
        </header>

        {/* Wallet Card */}
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm text-white/60 font-[Inter]">Available Balance</p>
              <div className="mt-4">
                <p className="text-5xl font-bold tracking-tight font-[Inter]">
                  <span className="text-[#C9A24B] drop-shadow-[0_0_26px_rgba(201,162,75,0.22)]">
                    ₹{wallet}
                  </span>
                </p>
              </div>
              <p className="mt-3 text-sm text-white/70 font-[Inter]">
                Last Recharge: <span className="text-white/90">{lastRecharge}</span>
              </p>
            </div>

            <div className="hidden sm:block">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[#0A1229]/30 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C9A24B]/15 to-transparent opacity-90" />
                <div className="relative text-center">
                  <p className="text-[11px] text-white/60 font-[Inter]">TOTAL</p>
                  <p className="text-sm font-semibold text-[#FBF9F4] font-[Inter]">FUNDS</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="px-8 py-6 border-b border-white/10">
            <h3 className="text-lg font-semibold font-[Inter] text-white/90">Transaction History</h3>
            <p className="mt-1 text-sm text-white/60 font-[Inter]">
              {transactions.length} record{transactions.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="px-8 py-6">
            {transactions.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
                <p className="text-white/70 font-[Inter]">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((item) => (
                  <div
                    key={item.$id}
                    className="group flex justify-between items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 transition-all duration-300 hover:border-[#C9A24B]/70 hover:bg-white/[0.04]"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white/90 font-[Inter] truncate">
                        {item.reason || "Transaction"}
                      </p>
                      <p className="text-sm text-white/60 font-[Inter]">
                        {item.date ? new Date(item.date).toLocaleString() : "-"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center rounded-full border px-3 py-1 text-xs font-semibold font-[Inter] transition-all duration-300 border-white/10 bg-white/5`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full mr-2 shadow-[0_0_20px_rgba(201,162,75,0.35)] ${
                            item.type === "add" ? "bg-[#C9A24B]" : "bg-white/30"
                          }`}
                        />
                        {item.type === "add" ? "Credit" : "Debit"}
                      </div>

                      <p
                        className={`font-bold font-[Inter] transition-all duration-300 ${
                          item.type === "add" ? "text-[#C9A24B]" : "text-white/80"
                        }`}
                      >
                        {item.type === "add" ? "+" : "-"} ₹{item.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
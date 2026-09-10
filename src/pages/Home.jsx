import React, { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, Clock, AlertTriangle, Store, Moon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/valorant/CountdownTimer";
import StoreCard from "@/components/valorant/StoreCard";
import NightMarketCard from "@/components/valorant/NightMarketCard";

function nextMidnightUTC() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return next.toISOString();
}

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/5 bg-[#1a2323]">
      <div className="aspect-square w-full animate-pulse bg-white/5" />
      <div className="border-t-2 border-white/10 p-4">
        <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-white/5" />
        <div className="mb-3 h-5 w-2/3 animate-pulse rounded bg-white/5" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStore = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("getValorantStore", {});
      setData(res.data ?? res);
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      setError(e?.message || "Failed to load store data.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const shopReset = useMemo(() => {
    if (data?.shopReset) return data.shopReset;
    return nextMidnightUTC();
  }, [data]);

  const unavailable = data?.status === "unavailable";
  const dailyItems = data?.dailyStore?.items ?? [];
  const nightMarket = data?.nightMarket;
  const nmActive = nightMarket?.active === true;
  const nmOffers = nightMarket?.offers ?? [];

  return (
    <div className="min-h-screen bg-[#0f1923] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{ background: "radial-gradient(ellipse at top, rgba(255,70,85,0.12), transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 bg-[#ff4655]" />
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-[0.2em] sm:text-3xl">Valorant Shop Viewer</h1>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
                  Remote view of your current store
                </p>
              </div>
            </div>
            <Button
              onClick={fetchStore}
              disabled={refreshing}
              className="bg-[#ff4655] text-white hover:bg-[#e03e4d]"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Shop
            </Button>
          </div>

          {/* Reset countdown */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#1a2323] p-5 sm:flex-row">
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-white/50">
              <Clock className="h-4 w-4 text-[#ff4655]" />
              Shop Resets In
            </div>
            <CountdownTimer targetIso={shopReset} />
            <div className="text-xs uppercase tracking-widest text-white/40">
              {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : "Not updated yet"}
            </div>
          </div>
        </header>

        {/* Unavailable banner */}
        {unavailable && !loading && (
          <div className="mb-8 rounded-lg border border-[#ff4655]/40 bg-[#ff4655]/10 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#ff4655]" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#ff4655]">
                  Store data unavailable
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{data?.message}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-lg border border-red-500/40 bg-red-500/10 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-red-400">Error</h2>
                <p className="mt-2 text-sm text-white/70">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Daily Store */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-5 w-5 text-[#ff4655]" />
            <h2 className="text-lg font-bold uppercase tracking-[0.15em]">Daily Store</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : dailyItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dailyItems.map((item, i) => (
                <StoreCard key={item.id ?? i} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-[#1a2323] p-8 text-center text-sm text-white/40">
              {unavailable
                ? "Connect a Valorant data source to populate your daily store."
                : "No daily store offers available right now."}
            </div>
          )}
        </section>

        {/* Night Market */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Moon className="h-5 w-5 text-[#ff4655]" />
            <h2 className="text-lg font-bold uppercase tracking-[0.15em]">Night Market</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : nmActive && nmOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nmOffers.map((offer, i) => (
                <NightMarketCard key={offer.id ?? i} offer={offer} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-[#1a2323] p-8 text-center text-sm text-white/40">
              Night Market is currently unavailable.
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          Read-only viewer. This app does not open, control, or modify Valorant, and never stores your Riot password.
        </footer>
      </div>
    </div>
  );
}
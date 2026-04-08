import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Star, Film, Award, BarChart3 } from "lucide-react";
import type { Entry } from "../../types";
import { motion } from "framer-motion";

interface StatsDashboardProps {
  entries: Entry[];
}

export function StatsDashboard({ entries }: StatsDashboardProps) {
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    const totalMovies = entries.length;
    const avgRating =
      entries.reduce((acc, curr) => acc + curr.rating, 0) / totalMovies;

    const genreCounts: Record<string, number> = {};
    const genreRatings: Record<string, { total: number; count: number }> = {};
    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    entries.forEach((entry) => {
      // Genre counts and ratings
      entry.genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        if (!genreRatings[genre]) genreRatings[genre] = { total: 0, count: 0 };
        genreRatings[genre].total += entry.rating;
        genreRatings[genre].count += 1;
      });

      // Rating distribution
      const floorRating = Math.floor(entry.rating);
      if (ratingDistribution[floorRating] !== undefined) {
        ratingDistribution[floorRating]++;
      } else if (entry.rating === 0) {
        ratingDistribution[1]++;
      }
    });

    const mostWatchedGenre = Object.entries(genreCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

    const topGenreByRating = Object.entries(genreRatings)
      .map(([name, data]) => ({
        name,
        avg: data.total / data.count,
        count: data.count,
      }))
      .filter(g => g.count >= 2) // Only consider genres with at least 2 movies for "top genre"
      .sort((a, b) => b.avg - a.avg)[0]?.name || mostWatchedGenre;

    const chartData = Object.entries(ratingDistribution).map(([rating, count]) => ({
      rating: `${rating} ★`,
      count,
    }));

    const genreData = Object.entries(genreCounts)
      .map(([name, count]) => ({
        name,
        count,
        avgRating: (genreRatings[name].total / genreRatings[name].count).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalMovies,
      avgRating: avgRating.toFixed(1),
      mostWatchedGenre,
      topGenreByRating,
      chartData,
      genreData,
    };
  }, [entries]);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        {/* Quick Stats */}
        <div className="space-y-4 justify-between flex flex-col md:col-span-1">
          <StatCard
            icon={<Film className="h-5 w-5 text-blue-400" />}
            label="Films vus"
            value={stats.totalMovies}
          />
          <StatCard
            icon={<Star className="h-5 w-5 text-yellow-400" />}
            label="Note moyenne"
            value={`${stats.avgRating}/5`}
          />
          <StatCard
            icon={<Award className="h-5 w-5 text-purple-400" />}
            label="Genre favori"
            value={stats.mostWatchedGenre}
          />
          <StatCard
            icon={<BarChart3 className="h-5 w-5 text-green-400" />}
            label="Mieux noté"
            value={stats.topGenreByRating}
          />
        </div>

        {/* Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm md:col-span-3"
        >
          <div className="mb-4 flex items-center gap-2 text-[var(--muted)]">
            <BarChart3 className="h-5 w-5" />
            <h3 className="font-medium">Analyse des notes</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="rating" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--muted)", fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--muted)", fontSize: 12 }} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  itemStyle={{
                    color: "var(--fg)",
                  }}
                  cursor={{ fill: "var(--bg)", opacity: 0.4 }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`var(--accent)`} 
                      fillOpacity={0.6 + (index * 0.1)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Genres Table/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
      >
        <h3 className="mb-4 font-medium text-[var(--muted)] flex items-center gap-2">
          <Film className="h-5 w-5" />
          Top Genres par volume
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.genreData.map((genre) => (
            <div key={genre.name} className="flex flex-col gap-1 rounded-xl bg-[var(--bg)] p-3 border border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{genre.name}</span>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-[var(--fg)]">{genre.count} <small className="text-[10px] font-normal text-[var(--muted)]">films</small></span>
                <span className="text-sm text-[var(--muted)]">{genre.avgRating} ★</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg)] shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-[var(--fg)]">{value}</p>
      </div>
    </motion.div>
  );
}

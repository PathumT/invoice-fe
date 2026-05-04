import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "../api/client.js";
import UserCard from "../components/UserCard.jsx";

const accents = ["#7c5cff", "#22d3ee", "#f472b6"];

export default function HomePage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api("/api/templates");
        if (!cancelled) setTemplates(data);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Failed to load templates";
        toast.error(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="layout">
      <h1 className="page-title">Ethyx invoice workspace</h1>
      <p className="page-sub">
        Choose your profile to open your fixed invoice template, save your details, and generate a
        professional PDF.
      </p>

      {loading ? (
        <div className="grid-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel" style={{ minHeight: 160 }}>
              <div className="skeleton" style={{ height: 24, width: "40%" }} />
              <div className="skeleton" style={{ height: 16, width: "60%", marginTop: 12 }} />
              <div className="skeleton" style={{ height: 14, width: "90%", marginTop: 16 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-cards">
          {templates.map((t, i) => (
            <UserCard
              key={t.slug}
              slug={t.slug}
              name={t.name}
              role={t.role}
              descriptionTitle={t.descriptionTitle}
              accent={accents[i % accents.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

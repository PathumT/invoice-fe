import { Link } from "react-router-dom";

export default function UserCard({ name, role, descriptionTitle, slug, accent }) {
  const initial = name?.slice(0, 1)?.toUpperCase() || "?";
  return (
    <article
      className="panel"
      style={{
        borderTop: `3px solid ${accent}`,
        cursor: "pointer",
        transition: "transform 0.15s ease, border-color 0.15s",
      }}
    >
      <Link to={`/invoice/${slug}`} style={{ color: "inherit", textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            aria-hidden
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#fff",
              background: `linear-gradient(135deg, ${accent}, #1e1b4b)`,
            }}
          >
            {initial}
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "Outfit, sans-serif",
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              {name}
            </h2>
            <p style={{ margin: "0.15rem 0 0", color: "var(--accent-2)", fontWeight: 600 }}>
              {role}
            </p>
          </div>
        </div>
        <p style={{ margin: "1rem 0 0", color: "var(--muted)", fontSize: "0.92rem" }}>
          {descriptionTitle}
        </p>
      </Link>
    </article>
  );
}

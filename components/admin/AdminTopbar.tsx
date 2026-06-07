import { IS_DEMO } from "@/lib/firebase";

interface Props {
  title: string;
}

export default function AdminTopbar({ title }: Props) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <span className="admin-topbar-kicker">SWH · Admin</span>
        <h1 className="admin-topbar-title">{title}</h1>
      </div>
      <div className="admin-topbar-actions">
        {IS_DEMO && (
          <span className="navbar-demo-badge" aria-label="Modo demostración">
            DEMO
          </span>
        )}
      </div>
    </header>
  );
}

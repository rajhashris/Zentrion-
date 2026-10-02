import { useNavigate } from "react-router-dom";
import { signOut } from "./hooks.js";

export default function LogoutButton({ className = "btn ghost" }) {
  const nav = useNavigate();
  return <button className={className} onClick={() => { signOut(); nav("/"); }}>🚪 Log out</button>;
}

import { cn } from "../../lib/utils";
import { SignOutButton } from "../../SignOutButton";
import BitGoldLogo from "../brand/BitGoldLogo";
import NavLink from "./NavLink";
import Container from "./Container";
import { useLocation } from "../../context/LocationContext";
import { ShieldCheck } from "lucide-react"; // Import ShieldCheck

export function Navbar() {
  const { currentLocation } = useLocation();

  return (
    <nav className="pt-8">
      <Container className="flex justify-between items-start"> {/* Changed items-center to items-start for alignment */}
        <div>
          <p className="text-darkGray text-sm">Good morning 👋</p>
          <h1 className="text-white text-2xl font-bold">Your Gold Portfolio</h1>
        </div>
        <div className="flex flex-col items-end gap-2"> {/* Added flex-col and items-end for right alignment */}
          <div className="w-10 h-10 rounded-full bg-[#FFC107] flex items-center justify-center text-black font-bold text-lg">
            JD
          </div>
          <div className="flex items-center gap-1 text-success text-xs"> {/* Using text-success for #4ADE80 */}
            <ShieldCheck size={14} />
            <span>Vault Secured</span>
          </div>
        </div>
      </Container>
    </nav>
  );
}

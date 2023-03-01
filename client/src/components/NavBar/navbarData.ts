import BuildIcon from "@mui/icons-material/Build";
import DescriptionIcon from "@mui/icons-material/Description";
import UserIcon from "@mui/icons-material/Person";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type MuiIcon = OverridableComponent<SvgIconTypeMap<unknown, "svg">> & {
  muiName: string;
};

export type UserRole = "admin" | "membro" | "trainee";

interface NavbarData {
  title: string;
  Icon: MuiIcon;
  path: string;
  roles: UserRole[];
}

export const navbarData: NavbarData[] = [
  {
    title: "Projetos",
    Icon: BuildIcon,
    path: "/project",
    roles: ["admin", "membro", "trainee"],
  },
  {
    title: "Contratos",
    Icon: DescriptionIcon,
    path: "/contract",
    roles: ["admin", "membro"],
  },
  {
    title: "Usuários",
    Icon: UserIcon,
    path: "/user",
    roles: ["admin"],
  },
];

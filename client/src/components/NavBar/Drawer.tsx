import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import Image from "mui-image";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/projetointerno.svg";
import { navbarData, UserRole } from "./navbarData";

export function Drawer() {
  const navigate = useNavigate();

  const currentUser: {
    role: UserRole;
  } = {
    role: "admin",
  };

  return (
    <Container
      style={{
        height: "100%",
      }}
    >
      <Box
        style={{
          marginTop: 50,
          marginBottom: 30,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src={Logo}
          alt="Projeto Logo"
          style={{
            width: 140,
            height: 66,
            marginBottom: 16,
          }}
        />
      </Box>
      <List>
        {navbarData.filter(({ roles })=>roles.includes(currentUser.role)).map(({ title, Icon, path }, index) => (
          <ListItem key={index} onClick={() => navigate(path)}>
            <ListItemButton>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

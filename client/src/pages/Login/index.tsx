import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Link,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { Image } from "mui-image";

import Logo from "../../assets/projetointerno.svg";

export default function Login() {
  return (
    <Container
      component={"main"}
      maxWidth={"xs"}
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          paddingX: 10,
          paddingY: 5,
          borderRadius: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
          <Typography
            component={"h1"}
            variant={"h5"}
            color={"secondary"}
            fontWeight={"bold"}
          >
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              mt: 1,
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Grid container justifyContent={"center"}>
              <Link href="#" variant="body2">
                Esqueceu sua senha?
              </Link>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

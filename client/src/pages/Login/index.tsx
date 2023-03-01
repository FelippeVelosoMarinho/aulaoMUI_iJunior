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
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";

import { Image } from "mui-image";

import Logo from "../../assets/projetointerno.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/Auth/login";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const body = {
        email: String(data.get("email")),
        senha: String(data.get("password")),
      };

      await login(body);
      //Manda dados para o backend
      console.log("Logado com sucesso!");
      navigate("../");
    } catch (error) {
      console.log("Deu erro");
      setMessage(error);
      setOpen(true);
    }
  }

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
            onSubmit={handleSubmit}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              variant="standard"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPasswordClick} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
      <Snackbar open={open} message={message} autoHideDuration={100000}>
        <Alert
          elevation={5}
          variant="filled"
          severity="error"
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

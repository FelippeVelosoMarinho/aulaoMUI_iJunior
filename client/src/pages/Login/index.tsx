



export default function Login() {
  return (
    <div
    style={{
        display: "flex",
        flexDirection: "column",
        gap: 10
    }}
    >
      <h1>Login</h1>
      <label htmlFor="email" id="email">
        Email
      </label>
      <input type="email" name="email" id="email" />
      <label htmlFor="pass" id="pass">
        Password
      </label>
      <input type="pass" name="pass" id="pass" />
      <button type="submit">Entrar</button>
    </div>
  );
}

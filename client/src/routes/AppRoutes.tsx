import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar";
import Login from "../pages/Login";
import { ProjectList } from "../pages/Project";
import { ContractList } from "../pages/Contract";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/" element={<NavBar />}>
            <Route index element={<ProjectList />} />
            <Route path="/contract" element={<ContractList />} />
        </Route>	
      </Routes>
    </BrowserRouter>
  );
}

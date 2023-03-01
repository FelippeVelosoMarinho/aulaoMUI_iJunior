import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar";
import Login from "../pages/Login";
import { ProjectList } from "../pages/Project";
import { ContractList } from "../pages/Contract";
import UserList from "../pages/User";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/" element={<NavBar />}>
            <Route path="/project" element={<ProjectList />} />
            <Route path="/contract" element={<ContractList />} />
            <Route path="/user" element={<UserList />} />
        </Route>	
      </Routes>
    </BrowserRouter>
  );
}

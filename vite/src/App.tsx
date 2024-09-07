import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Permissions from "./pages/Permissions";
import Multi from "./pages/Multi";
import MyPage from "./pages/MyPage";
import TokenDetail from "./pages/TokenDetail";
import CreateToken from "./pages/CreateToken";
import Launchpad from "./pages/Launchpad";
import LaunchpadDetail from "./pages/LaunchpadDetail";
import TokenManagement from "./pages/TokenManagement";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/createToken" element={<CreateToken />} />
          <Route path="/tokenManagement" element={<TokenManagement />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/multi" element={<Multi />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/token/:contractAddress" element={<TokenDetail />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route
            path="/launchpad-detail/:tokenAddress"
            element={<LaunchpadDetail />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

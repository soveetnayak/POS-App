import Layout from "./components/Layout";
import theme from '../src/common/theme';
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Inventory from "./components/Inventory/Inventory";
import AddProduct from "./components/AddProduct/AddProduct";
import Billing from "./components/Billing/Billing";
import AllBills from "./components/Billing/AllBills";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Layout />
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/bill" element={<Billing />} />
            <Route path="/allbills" element={<AllBills />} />
          </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;

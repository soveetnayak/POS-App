import Layout from "./components/Layout";
import theme from '../src/common/theme';
import { ThemeProvider } from "@mui/material";
import AddProduct from "./components/AddProduct/AddProduct";
import Inventory from "./components/Inventory/Inventory";
function App() {
  return (
    <div className="App">

      <Layout />
      <ThemeProvider theme={theme}>
        {/* <AddProduct /> */}
        <Inventory />
      </ThemeProvider>
    </div>
  );
}

export default App;

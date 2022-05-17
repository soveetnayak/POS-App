import Layout from "./components/Layout";
import theme from '../src/common/theme';
import { ThemeProvider } from "@mui/material";
import AddProduct from "./components/AddProduct/AddProduct";
function App() {
  return (
    <div className="App">

      <Layout />
      <ThemeProvider theme={theme}>
        <AddProduct />
      </ThemeProvider>
    </div>
  );
}

export default App;

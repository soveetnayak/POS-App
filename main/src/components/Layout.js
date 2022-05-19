import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// Make background color #a7cbf2

function Layout() {

    let navigate = useNavigate();
    
    return (
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#265a91" }}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            POS App
          </Typography>
            <Button color="inherit" onClick={() => navigate("/")}>
                Inventory
            </Button>
            <Button color="inherit" onClick={() => navigate("/add")}>
                Add Product
            </Button>
            <Button color="inherit" onClick={() => navigate("/bill")}>
                Billing
            </Button>
        </Toolbar>
      </AppBar>
    </Box>
    );
}

export default Layout;

import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";

// Make background color #a7cbf2

function Layout() {
    return (
        <div>
        <AppBar position="static" sx={{ bgcolor: "#265a91" }}>
            <Toolbar>
            <h3>POS App</h3>
            </Toolbar>
        </AppBar>
        </div>
    );
}

export default Layout;

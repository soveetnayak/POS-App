import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, TextField, Button } from "@mui/material";
import { Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Fuse from "fuse.js";
import EditDialog from "./EditProduct";

function Inventory() {

    const [searchText, setSearchText] = useState('');
    const [inventory, setInventory] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [curItem, setCurItem] = useState({});
    const collectionRef = collection(db, "Inventory");

    useEffect(() => {
        const getItems = async () => {
            const data = await getDocs(collectionRef);
            setInventory(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setSearchResult(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }

        getItems();
    }, []);

    const handleSearchTextChange = (event) => {

        setSearchText(event.target.value);
        const fuse = new Fuse(inventory, {
            keys: ["name", "description", "category", "tag"]
        })
        if(event.target.value != '')
        {
            const filteredData = fuse.search(event.target.value);
            const temp = [];
            filteredData.map(res => {
                temp.push(res.item);
            })
            setSearchResult([...temp]);
        }
        else
        {
            setSearchResult(inventory);
        }

    }

    const handleEdit = (item) => {
        setCurItem(item);
        setEditModal(true);
    }

    //return a table with the inventory
    return (
        <div>
            <Container maxWidth="xl">
                <Box
                    display="flex"
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        label="Search Inventory"
                        value={searchText}
                        onChange={handleSearchTextChange}
                    >
                    </TextField>
                    <SearchIcon />
                </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell >Price</TableCell>
                                <TableCell >Quantity</TableCell>
                                <TableCell >Description</TableCell>
                                <TableCell >Category</TableCell>
                                <TableCell >Tags</TableCell>
                                <TableCell >Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {searchResult.map((item) => (
                                <TableRow key={item.id} >
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.category.join(', ')}</TableCell>
                                    <TableCell>{item.tag.join(', ')}</TableCell>
                                    <TableCell>
                                        <img src={item.image} alt="product" width="100" height="100" />
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained"
                                            onClick={() => {handleEdit(item)}}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <EditDialog key={curItem.id} open={editModal} item={curItem} />
            </Container>
        </div>
    );

}

export default Inventory;
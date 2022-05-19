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

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const collectionRef = collection(db, "Inventory");

    useEffect(() => {
        const getItems = async () => {
            const data = await getDocs(collectionRef);
            setInventory(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }
        
        getItems();
    }, []);

    //return a table with the inventory
    return (
        <div>
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
                    {inventory.map((item) => (
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    );

}

export default Inventory;
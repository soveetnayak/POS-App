import './Billing.css';
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
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

function Billing () {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
    const collectionRef = collection(db, "Inventory");

    useEffect(() => {
      const getItems = async () => {
          const data = await getDocs(collectionRef);
          setInventory(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }

      getItems();
  }, []);

  const handleSelect = (row) => {
    const temp = [...cart];
    temp.push(row.id);
    setCart(temp);
  }

  return (
    <div className="row">
      <div className="column left">
        <DataGrid
          checkboxSelection={true}
          on
          rows={inventory}
          columns={[
            {
              field: 'id',
              headerName: 'ID',
              width: 100,
            },
            {
              field: 'name',
              headerName: 'Name',
              sortable: true,
              width: 100
            },
            {
              field: 'description',
              headerName: 'Description',
              width: 100
            },
            {
              field: 'price',
              headerName: 'Price',
              sortable: true,
              width: 100
            },
            {
              field: 'quantity',
              headerName: 'Quantity',
              sortable: true,
              width: 100
            }
          ]}
          pageSize={10}

        />
      </div>
      <div className="column right">
        <div className="row up">
      <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell >Description</TableCell>
                                <TableCell >Price</TableCell>
                                <TableCell >Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.id} >
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
        <div className="row down">
        <div>Information
                              </div>
        <Button variant="contained" color="primary">
          Checkout
        </Button>
        </div> 
      </div>
    </div>
  );
}

export default Billing;
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
import { Button, Container, Dialog, DialogContent, DialogActions, TextField } from "@mui/material";


function AllBills () {
    const [billid, setBillid] = useState('');
    const [customername, setCustomername] = useState('');
    const [customerno, setCustomerno] = useState(0);
    const [date, setDate] = useState('');
    const [total, setTotal] = useState(0);
    const [productid, setProductid] = useState([]);
    const [productname, setProductname] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [rate, setRate] = useState([]);

    const [bills, setBills] = useState([]);
    const collectionRef = collection(db, "Bills");
    const [viewbool, setViewbool] = useState(false);

    useEffect(() => {
        const getBills = async () => {
            const data = await getDocs(collectionRef);
            setBills(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }

        getBills();
    }, []);

    const handleView = (id) => {
        setBillid(id);
        const bill = bills.filter(bill => bill.id === id);
        setCustomername(bill[0].customername);
        setCustomerno(bill[0].customerno);
        setDate(bill[0].date);
        setTotal(bill[0].total);
        setProductid(bill[0].productid);
        setProductname(bill[0].productname);
        setQuantity(bill[0].quantity);
        setRate(bill[0].rate);

        setViewbool(true);
    }

    const handleToClose = () => {
        setViewbool(false);
        setBillid('');
      };

  return (
    <div>
        <Container maxWidth="xl">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Bill ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bills.map((bill) => (
                            <TableRow key={bill.id}>
                                <TableCell component="th" scope="row">
                                    {bill.id}
                                </TableCell>
                                <TableCell>{bill.customername}</TableCell>
                                <TableCell>{bill.total}</TableCell>
                                <TableCell>{bill.date.toDate().toDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary"
                                    onClick={() => handleView(bill.id)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
        {
            billid !== '' &&
            <Dialog open={viewbool}>
                <DialogContent>
                    <p>
                        <b>Bill ID: </b>
                        {billid}
                    </p>
                    <p>
                        <b>Customer Name: </b>
                        {customername}
                    </p>
                    <p>
                        <b>Customer No: </b>
                        {customerno}
                    </p>
                    <p>
                        <b>Date: </b>
                        {date.toDate().toDateString()}
                    </p>
                    <p>
                        <b>Total: </b>
                        {total}
                    </p>
        
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Rate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productid.map((id, index) => (
                                    <TableRow key={id}>
                                        <TableCell component="th" scope="row">
                                            {id}
                                        </TableCell>
                                        <TableCell>{productname[index]}</TableCell>
                                        <TableCell>{quantity[index]}</TableCell>
                                        <TableCell>{rate[index]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </div>
  );
}

export default AllBills;
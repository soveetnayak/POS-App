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
import { Button, Container, Dialog, DialogContent, DialogActions, TextField, Typography, Box } from "@mui/material";

function AllBills() {
    const [billid, setBillid] = useState('');
    const [customername, setCustomername] = useState('');
    const [customerno, setCustomerno] = useState(0);
    const [date, setDate] = useState('');
    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dateRangeIsValid, setDateRangeIsValid] = useState(true);
    const [dateErrorMessage, setDateErrorMessage] = useState(''); 

    const [bills, setBills] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const collectionRef = collection(db, "Bills");
    const [viewbool, setViewbool] = useState(false);

    useEffect(() => {
        const getBills = async () => {
            const data = await getDocs(collectionRef);
            const temp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            temp.sort((a, b) => {
                return b.date - a.date;
            })
            setBills([...temp]);
            setSearchResult([...temp]);
        }

        getBills();
    }, []);

    const handleView = (id) => {
        setBillid(id);
        const bill = bills.filter(bill => bill.id === id);
        setCustomername(bill[0].customername);
        setDate(bill[0].date);
        setTotal(bill[0].total);
        setProducts(bill[0].products);
        setViewbool(true);
    }

    const handleToClose = () => {
        setViewbool(false);
        setBillid('');
    };

    const onChangeFromDate = (event) => {
        setFromDate(event.target.value);
    }

    const onChangeToDate = (event) => {
        setToDate(event.target.value);
    }

    const DateRangeIsValid = () => {

       
        if(fromDate == '')
        {
            setDateErrorMessage('From Date cannot be empty');
            setDateRangeIsValid(false);
            return false;
        }
            
        if(toDate == '')
        {
            setDateErrorMessage('To Date cannot be empty');
            setDateRangeIsValid(false);
            return false;
        }
            
        const from = new Date(fromDate);
        from.setHours(0, 0, 0);

        const to = new Date(toDate);
        to.setHours(23, 59, 59);

        if(from.getTime() > to.getTime())
        {
            setDateErrorMessage('From Date must be earlier or the same as To Date');
            setDateRangeIsValid(false);
            return false;
        }

        if(!dateRangeIsValid)
            setDateRangeIsValid(true);
        
        return true;
    }

    const handleSearch = () => {

        if(!DateRangeIsValid())
            return;

        const from = new Date(fromDate);
        from.setHours(0, 0, 0);

        const to = new Date(toDate);
        to.setHours(23, 59, 59);

        console.log(to.getTime());
        const temp = bills.filter(item => {
            return item.date.toDate().getTime() >= from.getTime() &&
                    item.date.toDate().getTime() <= to.getTime();
        })
        setSearchResult([...temp]);
    }

    const handleClearSearch = () => {
        setFromDate('');
        setToDate('');
        setDateRangeIsValid(true);
        setSearchResult([...bills]);
    }

    return (
        <div>
            <Container maxWidth="xl">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            sx={{marginRight: "5%"}}
                        >
                            FROM:
                        </Typography>
                        <TextField
                            type="date"
                            value={fromDate}
                            onChange={onChangeFromDate}
                        ></TextField>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            sx={{marginRight: "5%"}}
                        >
                            TO:
                        </Typography>
                        <TextField
                            type="date"
                            value={toDate}
                            onChange={onChangeToDate}
                        ></TextField>
                    </Box>
                    <Box>
                        {!dateRangeIsValid && <Typography
                            color="red"
                        >   
                            {dateErrorMessage}
                        </Typography> }
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleClearSearch} 
                    >
                        Clear Search 
                    </Button>
                </div>
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
                            {searchResult.map((bill) => (
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
                                    {products.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell component="th" scope="row">
                                                {product.id}
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.quantity}</TableCell>
                                            <TableCell>{product.price}</TableCell>
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
        </div >
    );
}

export default AllBills;
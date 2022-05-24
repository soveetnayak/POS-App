import './Billing.css';
import { useState, useEffect } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";

import { Grid, Typography, Container, TextField, Autocomplete, Dialog, IconButton, RadioGroup, Radio } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const emptyProduct = {
  id: "",
  name: "",
  description: "",
  category: [],
  tag: [],
  image: "",
}

function Billing() {


  const [custName, setCustName] = useState('');
  const [custNameIsValid, setCustNameIsValid] = useState(false);
  const [custNameIsTouched, setCustNameIsTouched] = useState(false);


  const [curProduct, setCurProduct] = useState(emptyProduct);
  const [curProductInputValue, setCurProductInputValue] = useState('');

  const [curQuantity, setCurQuantity] = useState('');
  const [curQuantityIsValid, setCurQuantityIsValid] = useState(false);
  const [curQuantityErrMessage, setCurQuantityErrMessage] = useState("");
  const [curQuantityIsTouched, setCurQuantityIsTouched] = useState(false);

  const [totalamount, setTotalAmount] = useState('');
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [billDialog, setBillDialog] = useState(false);
  const collectionRefInventory = collection(db, "Inventory");
  const collectionRefBills = collection(db, "Bills");

  const date = new Date();
  const [curTime, setCurTime] = useState(date.toLocaleTimeString().slice(0, -3));

  useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(collectionRefInventory);
      setInventory(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getItems();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      var temp = new Date();
      setCurTime(temp.toLocaleTimeString().slice(0, -3));
    }, 60000);
    return () => {
      clearInterval(timer);
    }
  }, [])

  const onChangeCustName = (event) => {
    setCustName(event.target.value);
  }

  const handleCurProductChange = (event, newValue) => {
    console.log(newValue);
    if (newValue != null)
      setCurProduct(newValue);
    else
      setCurProduct(emptyProduct)
  }

  const handleCurProductInputValueChange = (event, newInputValue) => {
    if (newInputValue != '')
      setCurProductInputValue(newInputValue);
  }

  const checkCurQuantityIsValid = (qty) => {

    if (isNaN(Number(qty))) {
      setCurQuantityIsValid(false);
      setCurQuantityErrMessage("Quantity must be a valid number");
      return;
    }

    if (Number(qty) <= 0 || !Number.isInteger(Number(qty))) {
      setCurQuantityIsValid(false);
      setCurQuantityErrMessage("Quantity must be a positive whole number");
      return;
    }

    if (Number(qty) > +curProduct.quantity) {
      setCurQuantityIsValid(false);
      setCurQuantityErrMessage("Quantity must be less than available quantity");
      return;
    }

    if (!curQuantityIsValid)
      setCurQuantityIsValid(true);

    return;
  }

  const onChangeCurQuantity = (event) => {
    if (!curQuantityIsTouched)
      setCurQuantityIsTouched(true);
    setCurQuantity(event.target.value);
    checkCurQuantityIsValid(event.target.value);
  }

  const onAddToCart = () => {
    if (!curQuantityIsValid) {
      alert(curQuantityErrMessage);
      return;
    }
    const temp = cart;
    temp.push({
      id: curProduct.id,
      image: curProduct.image,
      name: curProduct.name,
      description: curProduct.description,
      price: curProduct.price,
      quantity: curQuantity,
    });
    const newTotal = +totalamount + +curProduct.price * +curQuantity;
    setTotalAmount(newTotal);
    setCart([...temp]);
    setCurProduct(emptyProduct);
    setCurQuantity('');
  }

  const onDeleteItem = (id) => {
    console.log(id);
    const temp = cart;
    const deleteidx = temp.findIndex(item => item.id === id);
    console.log(deleteidx);
    const newTotal = +totalamount - (temp[deleteidx].price * temp[deleteidx].quantity);
    setTotalAmount(newTotal);
    temp.splice(deleteidx, 1);
    setCart([...temp]);
  }

  const onCheckout = () => {

    if (custName.trim().length == 0) {
      alert("Customer Name cannot be empty");
      return;
    }

    if (cart.length == 0) {
      alert("Cart Cannot be empty");
      return;
    }

    addDoc(collectionRefBills, {
      customername: custName,
      date: new Date(),
      products: cart,
      total: totalamount,
    }).then(() => {
      setBillDialog(true);
    })

  }

  const onDownload = () => {

    const input = document.getElementById("bill");
    html2canvas(input)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save(custName + date.toLocaleDateString() + ".pdf");
      })

  }

  const onCloseBill = () => {

    window.location.reload();

  }

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
      >
        Billing
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
          <Typography

          >
            <b>Date:</b> {date.toLocaleDateString()}
          </Typography>
          <Typography

          >
            <b>Current Time:</b> {curTime}
          </Typography>
        </Grid>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography
            margin="1%"
          >
            Customer Name:
          </Typography>
          <TextField
            margin="normal"
            sx={{
              width: "40%"
            }}
            value={custName}
            onChange={onChangeCustName}
            onBlur={() => { setCustNameIsTouched(true) }}
          >
          </TextField>
          {custNameIsTouched && custName.trim().length == 0 &&
            <Typography
              color="red"
            >
              Customer Name Cannot be empty
            </Typography>
          }
        </Grid>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography
            margin="1%"
          >
            Product:
          </Typography>
          <Autocomplete
            disablePortal
            options={inventory}
            value={curProduct}
            onChange={handleCurProductChange}
            inputValue={curProductInputValue}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onInputChange={handleCurProductInputValueChange}
            getOptionLabel={(option) => option.name + " " + option.description + " "}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={12}>
          {curProduct.name != "" &&
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell >Price</TableCell>
                    <TableCell >Quantity Available</TableCell>
                    <TableCell >Description</TableCell>
                    <TableCell >Category</TableCell>
                    <TableCell >Tags</TableCell>
                    <TableCell >Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={curProduct.id} >
                    <TableCell>{curProduct.name}</TableCell>
                    <TableCell>{curProduct.price}</TableCell>
                    <TableCell>{curProduct.quantity}</TableCell>
                    <TableCell>{curProduct.description}</TableCell>
                    <TableCell>{curProduct.category.join(', ')}</TableCell>
                    <TableCell>{curProduct.tag.join(', ')}</TableCell>
                    <TableCell>
                      <img src={curProduct.image} alt="product" width="100" height="100" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Grid>
        <Grid item xs={12}>
          {curProduct.name != "" &&
            <div display="flex" alignitems="center">
              <Typography
                margin="1%"
              >
                Enter Quantity:
              </Typography>
              <TextField
                error={curQuantityIsTouched && !curQuantityIsValid}
                value={curQuantity}
                onChange={onChangeCurQuantity}
              >
              </TextField>
              {curQuantityIsTouched && !curQuantityIsValid && (
                <div>
                  <Typography color="red" variant="body1">
                    {curQuantityErrMessage}
                  </Typography>
                  <Typography>
                    Current Available Quantity: {curProduct.quantity}
                  </Typography>
                </div>
              )}
              <Button
                variant="contained"
                onClick={onAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          }
        </Grid>
        <Grid item xs={12}>
          <div>
            <Typography
              variant="h5"
            >
              Cart
              <ShoppingCartIcon />
            </Typography>

            {cart.length == 0 ?
              <Typography
                variant="h5"
                align="center"
              >
                Cart is Empty
              </Typography>
              : <>
                <TableContainer component={Paper} sx={{ marginBottom: "2%" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell >Description</TableCell>
                        <TableCell >Price</TableCell>
                        <TableCell >Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id} >
                          <TableCell>
                            <img src={item.image} alt={item.name} width="100" height="100" />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => { onDeleteItem(item.id) }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>}
            <div>
              <Typography
                gutterBottom
              >
                {totalamount != '' && <><b>Total amount:</b> Rs.{totalamount}/-</>}
              </Typography>
            </div>
            <div className="row down">
              <Button variant="contained" color="primary" onClick={onCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
      <Dialog
        open={billDialog}
        maxWidth="lg"
      >
        <Box
          margin="2%"
        >
          <Box
            id="bill"
          >
            <Typography
              variant="h4"
              align="center"
            >
              BILL
            </Typography>
            <Typography>
              Date: {date.toLocaleDateString() + " " + curTime}
            </Typography>
            <Typography
              align="left"
            >
              Customer Name: {custName}
            </Typography>
            <Typography
            >
              Products:
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: "2%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell >Description</TableCell>
                    <TableCell >Price</TableCell>
                    <TableCell >Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id} >
                      <TableCell>
                        <img src={item.image} alt={item.name} width="100" height="100" />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              variant="h5"
            >
              Total Amount: Rs.{totalamount}/-
            </Typography>
            <Typography
              variant="h5"
              align="center"
            >
              Thank you for Shopping!
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              onClick={onDownload}
            >
              Download Bill
            </Button>
            <Button
              variant="contained"
              onClick={onCloseBill}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}

export default Billing;
import "./AddProduct.css";

import {
  Checkbox,
  Chip,
  Container,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  Button,
  Grid,
  Dialog,
  TableContainer,
  Table,
  TableCell,
  Paper,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/system";
import WordStrength from "./WordStrength";
import AddIcon from "@mui/icons-material/Add";
import Fuse from "fuse.js";

import { db, storage } from "../../FirebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import PublishIcon from "@mui/icons-material/Publish";

import { useState } from "react";

import CropEasy from "./CropEasy";

const AddProduct = () => {
  const collectionRef = collection(db, "Inventory");

  const [productName, setProductName] = useState("");
  const [productNameErrMessage, setProductNameErrMessage] = useState("");
  const [productNameIsValid, setProductNameIsValid] = useState(false);
  const [productNameIsTouched, setProductNameIsTouched] = useState(false);

  const [productDesc, setProductDesc] = useState("");
  const [productDescErrMessage, setProductDescErrMessage] = useState("");
  const [productDescIsValid, setProductDescIsValid] = useState(false);
  const [productDescIsTouched, setProductDescIsTouched] = useState(false);

  const [price, setPrice] = useState("");
  const [priceIsValid, setPriceIsValid] = useState(false);
  const [priceErrMessage, setPriceErrMessage] = useState("");
  const [priceIsTouched, setPriceIsTouched] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [quantityIsValid, setQuantityIsValid] = useState(false);
  const [quantityErrMessage, setQuantityErrMessage] = useState("");
  const [quantityIsTouched, setQuantityIsTouched] = useState(false);

  const [curTag, setCurTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [tagErrMsg, setTagErrMsg] = useState("");
  const [selCategories, setSelCategories] = useState([]);

  const [modal, setModal] = useState(false);
  const [similarItems, setSimilarItems] = useState([]);

  const Categories = [
    "Electronics",
    "Fashion",
    "Furniture",
    "Daily Use",
    "Medicines",
    "Snacks",
    "Home Decor",
  ];

  const checkProductNameIsValid = (name) => {
    if (name.trim() === "") {
      setProductNameIsValid(false);
      setProductNameErrMessage("Product Name cannot be empty");
      return;
    }

    if (name.trim().split(" ").length > 4) {
      setProductNameIsValid(false);
      setProductNameErrMessage(
        "Product Name should be less than or equal to 4 words"
      );
      return;
    }

    if (!productNameIsValid) setProductNameIsValid(true);

    return;
  };

  const onChangeProductName = (event) => {
    setProductName(event.target.value);
    checkProductNameIsValid(event.target.value);
  };

  const checkProductDescIsValid = (desc) => {
    if (desc.trim().length < 50) {
      setProductDescIsValid(false);
      setProductDescErrMessage(
        "Product Description must be of atleast 50 characters"
      );
      return;
    }

    if (desc.trim().length > 200) {
      setProductDescIsValid(false);
      setProductDescErrMessage(
        "Product Description must be of atmost 200 characters"
      );
      return;
    }

    if (!productDescIsValid) setProductDescIsValid(true);

    return;
  };

  const onChangeProductDesc = (event) => {
    setProductDesc(event.target.value);
    checkProductDescIsValid(event.target.value);
  };

  const checkPriceIsValid = (pr) => {
    if (isNaN(Number(pr))) {
      setPriceIsValid(false);
      setPriceErrMessage("Price must be a valid Number");
      return;
    }

    if (Number(pr) <= 0) {
      setPriceIsValid(false);
      setPriceErrMessage("Price must be a positive number greater than 0");
      return;
    }

    if (!priceIsValid) setPriceIsValid(true);

    return;
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    checkPriceIsValid(event.target.value);
  };

  const checkQuantityIsValid = (qty) => {
    if (isNaN(Number(qty))) {
      setQuantityIsValid(false);
      setQuantityErrMessage("Quantity must be a valid number");
      return;
    }

    if (Number(qty) <= 0 || !Number.isInteger(Number(qty))) {
      setQuantityIsValid(false);
      setQuantityErrMessage("Quantity must be a positive whole number");
      return;
    }

    if (!quantityIsValid) setQuantityIsValid(true);

    return;
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    checkQuantityIsValid(event.target.value);
  };

  const onChangeCurTag = (event) => {
    setCurTag(event.target.value);
    if (tagErrMsg !== "" && event.target.value !== "") {
      setTagErrMsg("");
    }
  };

  const handleAddTag = () => {
    if (curTag === "") {
      setTagErrMsg("Please provide a tag to add");
      return;
    }
    const temp = allTags;
    temp.push(curTag);
    setAllTags([...temp]);
    setCurTag("");
  };

  const handleTagDelete = (tag) => {
    const temp = allTags;
    temp.splice(temp.indexOf(tag), 1);
    setAllTags([...temp]);
  };

  const handleCategoryChange = (event) => {
    setSelCategories(event.target.value);
  };

  const ValidateForm = () => {
    if (!productNameIsValid) {
      alert(productNameErrMessage);
      return false;
    }

    if (!productDescIsValid) {
      alert(productDescErrMessage);
      return false;
    }

    if (!quantityIsValid) {
      alert(quantityErrMessage);
      return false;
    }

    if (!priceIsValid) {
      alert(priceErrMessage);
      return false;
    }

    return true;
  };

  const ClearForm = () => {
    setProductName("");
    setProductDesc("");
    setQuantity("");
    setPrice("");
    setCurTag("");
    setAllTags("");
    setSelCategories("");
  };

  const additem = () => {
    if (modal) setModal(false);

    const imageRef = ref(storage, `Inventory/${productName}`);
    uploadBytes(imageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          addDoc(collectionRef, {
            name: productName,
            description: productDesc,
            category: selCategories,
            tag: allTags,
            image: downloadURL,
            quantity: quantity,
            price: price,
          })
            .then(() => {
              ClearForm();
              alert("Product Added Successfully");
            })
            .catch((err) => {
              alert("Could not Add Product");
            });
        });
      })
      .catch((err) => {
        alert("Could not Add Product");
      });
  };

  const getSimilarItems = async () => {
    const data = await getDocs(collectionRef);
    const Inventory = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(Inventory);
    const fuse = new Fuse(Inventory, {
      keys: ["name"],
    });
    const pattern = productName;
    const simlrItems = fuse.search(pattern);
    return simlrItems;
  };

  const createitem = async () => {
    if (ValidateForm()) {
      const simlrItems = await getSimilarItems();

      if (simlrItems.length > 0) {
        console.log(simlrItems);
        setSimilarItems(simlrItems);
        setModal(true);
      } else {
        additem();
      }
    }
  };

  const handleCloseDialog = () => {
    setModal(false);
  };

  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);

  const handleChange = (e) => {
    setFile(null);
    setPhotoURL(null);

    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPhotoURL(URL.createObjectURL(file));
      setOpenCrop(true);
    }
  };

  return (
    <>
      <Container maxWidth="xl" style={{ paddingBottom: "2%" }}>
        <CssBaseline />
        <Typography variant="h4" align="center" gutterBottom>
          Add Product
        </Typography>

        <Grid container spacing={10}>
          <Grid item xs={12} md={4}>
            <div>
              <Box marginBottom="2%">
                <Typography>Image Upload:</Typography>
                <Button variant="contained" component="label">
                  <PublishIcon />
                  {/* Choose Image */}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleChange}
                  />
                </Button>
              </Box>
              { openCrop ? <CropEasy {...{ photoURL, setOpenCrop, setPhotoURL, setFile }} /> : <></>}
              {/* { !openCrop && file ? <img src={photoURL} alt="preview" style={{ width: "100%" }} /> : <></>} */}
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box marginBottom="2%">
              <Typography>Product Name:</Typography>
              <TextField
                fullWidth
                required
                label="Product Name"
                value={productName}
                onChange={onChangeProductName}
                onBlur={() => {
                  setProductNameIsTouched(true);
                }}
                error={productNameIsTouched && !productNameIsValid}
                margin="normal"
              ></TextField>
              {productNameIsTouched && !productNameIsValid && (
                <Typography color="red" variant="body1">
                  {productNameErrMessage}
                </Typography>
              )}
              {productNameIsValid && <WordStrength productName={productName} />}
            </Box>
            <Box marginBottom="2%">
              <Typography>Product Description:</Typography>
              <TextField
                multiline
                label="Product Description"
                fullWidth
                required
                rows={4}
                margin="normal"
                value={productDesc}
                onChange={onChangeProductDesc}
                onBlur={() => {
                  setProductDescIsTouched(true);
                }}
                error={productDescIsTouched && !productDescIsValid}
              ></TextField>
              <Typography variant="body1">
                Current Character Count: {productDesc.length}
              </Typography>
              {productDescIsTouched && !productDescIsValid && (
                <div>
                  <Typography color="red" variant="body1">
                    {productDescErrMessage}
                  </Typography>
                </div>
              )}
            </Box>
            <Box marginBottom="2%">
              <Typography>Quantity:</Typography>
              <TextField
                fullWidth
                required
                label="Quantity"
                value={quantity}
                error={quantityIsTouched && !quantityIsValid}
                onBlur={() => {
                  setQuantityIsTouched(true);
                }}
                onChange={handleQuantityChange}
                margin="normal"
              ></TextField>
              {quantityIsTouched && !quantityIsValid && (
                <Typography color="red" variant="body1">
                  {quantityErrMessage}
                </Typography>
              )}
            </Box>
            <Box marginBottom="2%">
              <Typography>Price:</Typography>
              <TextField
                fullWidth
                required
                label="Price"
                value={price}
                error={priceIsTouched && !priceIsValid}
                onChange={handlePriceChange}
                onBlur={() => {
                  setPriceIsTouched(true);
                }}
                margin="normal"
              ></TextField>
              {priceIsTouched && !priceIsValid && (
                <Typography color="red" variant="body1">
                  {priceErrMessage}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box marginBottom="2%">
              <Typography>Add Tags:</Typography>
              <Box display="flex" alignItems="center">
                <TextField
                  margin="normal"
                  value={curTag}
                  onChange={onChangeCurTag}
                  error={tagErrMsg.length > 0}
                  label="Product Tags"
                ></TextField>
                <Tooltip title="Add Tag">
                  <IconButton
                    margin="normal"
                    color="success"
                    onClick={handleAddTag}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box marginBottom="2%">
              {tagErrMsg !== "" && (
                <Typography color="red" variant="body1">
                  {tagErrMsg}
                </Typography>
              )}
              {allTags.length > 0 && (
                <Typography>
                  Current Tags:{" "}
                  {allTags.map((tag) => {
                    return (
                      <Chip
                        style={{ margin: "1%" }}
                        label={tag}
                        onDelete={() => {
                          handleTagDelete(tag);
                        }}
                      />
                    );
                  })}
                </Typography>
              )}
            </Box>
            <Box marginBottom="2%">
              <Typography gutterBottom>Category:</Typography>
              <Select
                fullWidth
                multiple
                label="Category"
                value={selCategories}
                renderValue={(selected) => selected.join(", ")}
                onChange={handleCategoryChange}
              >
                {Categories.map((category) => {
                  return (
                    <MenuItem value={category}>
                      <Checkbox
                        checked={selCategories.indexOf(category) > -1}
                      />
                      <ListItemText primary={category} />
                    </MenuItem>
                  );
                })}
              </Select>
              {selCategories.length > 0 && (
                <>
                  <Typography>
                    Selected Categories:
                    <ul>
                      {selCategories.map((ctgr) => {
                        return <li>{ctgr}</li>;
                      })}
                    </ul>
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
        <Typography align="center">
          <Button variant="contained" onClick={createitem}>
            Submit
          </Button>
        </Typography>
        <Dialog open={modal} maxWidth="lg">
          <Box padding="2%">
            <Typography align="left" variant="h4">
              Found the following Similar Items already in Inventory:
            </Typography>

            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {similarItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item.name}</TableCell>
                      <TableCell>{item.item.price}</TableCell>
                      <TableCell>{item.item.quantity}</TableCell>
                      <TableCell>{item.item.description}</TableCell>
                      <TableCell>{item.item.category.join(", ")}</TableCell>
                      <TableCell>{item.item.tag.join(",")}</TableCell>
                      <TableCell>
                        <img
                          src={item.item.image}
                          alt="product"
                          width="100"
                          height="100"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <Typography variant="h4" align="left">
              Do you still want to add the following product?
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{productName}</TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>{productDesc}</TableCell>
                    <TableCell>{selCategories.join(", ")}</TableCell>
                    <TableCell>{allTags.join(",")}</TableCell>
                    <TableCell>
                      <img
                        src={photoURL}
                        alt="product"
                        width="100"
                        height="100"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
              </Typography>
              <Typography align="right">
                <Button variant="contained" color="info" onClick={additem}>
                  Add
                </Button>
              </Typography>
            </div>
          </Box>
        </Dialog>
      </Container>
    </>
  );
};

export default AddProduct;

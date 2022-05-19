import './AddProduct.css'

import { Checkbox, Chip, Container, FormControl, IconButton, InputLabel, ListItemText, MenuItem, Select, TextField, Tooltip, Typography, Button } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from "@mui/system";
import { useState } from "react";
import WordStrength from "./WordStrength";
import AddIcon from '@mui/icons-material/Add';

import { db, storage } from "../../FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddProduct = () => {
    const collectionRef = collection(db, "Inventory");
    

    const [productName, setProductName] = useState('');
    const [productNameIsTouched, setProductNameIsTouched] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [productNameIsValid, setProductNameIsValid] = useState(false);
    const [productDesc, setProductDesc] = useState('');
    const [curTag, setCurTag] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [tagErrMsg, setTagErrMsg] = useState('');
    const [selCategories, setSelCategories] = useState([]);
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const Categories = [
        "Electronics",
        "Fashion",
        "Furniture",
        "Daily Use",
        "Medicines",
        "Snacks",
        "Home Decor"
    ]

    const checkProductNameIsValid = (name) => {
        setProductNameIsTouched(true);
        if (name.trim() !== '' &&
            name.trim().split(' ').length <= 4
        ) {
            setProductNameIsValid(false);
        }
        else {
            setProductNameIsValid(true);
            if (name.trim(' ') === '') {
                setErrMessage("Product Name cannot be empty");
            }
            else {
                setErrMessage("Product Name should be less than or equal to 4 words");
            }
        }
    }

    const onChangeProductName = (event) => {
        setProductName(event.target.value);
        if (productNameIsTouched) {
            checkProductNameIsValid(event.target.value);
        }
    }

    const onChangeProductDesc = (event) => {
        setProductDesc(event.target.value);
    }


    const onChangeCurTag = (event) => {
        setCurTag(event.target.value);
        if (tagErrMsg != '' && event.target.value != '') {
            setTagErrMsg('');
        }
    }

    const handleAddTag = () => {
        if (curTag == '') {
            setTagErrMsg("Please provide a tag to add");
            return;
        }
        const temp = allTags;
        temp.push(curTag);
        setAllTags([...temp]);
        setCurTag('');
    }

    const handleTagDelete = (tag) => {
        const temp = allTags;
        temp.splice(temp.indexOf(tag), 1);
        setAllTags([...temp]);
    }

    const handleCategoryChange = (event) => {
        setSelCategories(event.target.value);
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    }

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
            setImagePreview(URL.createObjectURL(event.target.files[0]));
        }
    }

    const createitem = async () => {
        await addDoc(collectionRef, {
            name: productName,
            description: productDesc,
            category: selCategories,
            tag: allTags,
            image: "Building",
            quantity: quantity,
            price: price}
        );
    }

    return (
        <>
            <Container maxWidth="xs">
                <CssBaseline />
                {/* <Typography
                    variant="h2"
                    align="center"
                    gutterBottom
                >
                    Add Product
                </Typography> */}

                <Box
                    marginBottom="2%"
                >
                    <Typography>
                        Product Name:
                    </Typography>
                    <TextField
                        fullWidth
                        required
                        label="Product Name"
                        value={productName}
                        onChange={onChangeProductName}
                        onBlur={() => { checkProductNameIsValid(productName) }}
                        error={productNameIsValid}
                        margin="normal"
                    >
                    </TextField>
                    {productNameIsValid && <Typography
                        color="red"
                        variant="body1"
                    >{errMessage}</Typography>}
                    {!productNameIsValid && productName !== '' &&
                        <WordStrength productName={productName} />
                    }
                </Box>
                <Box
                    marginBottom="2%"
                >
                    <Typography>
                        Product Description:
                    </Typography>
                    <TextField
                        multiline
                        label="Product Description"
                        fullWidth
                        required
                        rows={4}
                        margin="normal"
                        value={productDesc}
                        onChange={onChangeProductDesc}
                    >
                    </TextField>
                </Box>
                <Box
                    marginBottom="2%"
                >
                    <Typography>
                        Add Tags:
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        value={curTag}
                        onChange={onChangeCurTag}
                        error={tagErrMsg.length > 0}
                        label="Product Tags"
                    >
                    </TextField>
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
                <Box
                    marginBottom="2%"
                >
                    {tagErrMsg != '' && <Typography
                        color="red"
                        variant="body1"
                    >{tagErrMsg}</Typography>}
                    {allTags.length > 0 &&
                        <Typography>
                            Current Tags: {allTags.map(tag => {
                                return (
                                    <Chip style={{ margin: "1%" }} label={tag} onDelete={() => { handleTagDelete(tag) }} />
                                )
                            })}
                        </Typography>
                    }
                </Box>
                <Box
                    marginBottom="2%"
                >
                    <Typography
                        gutterBottom
                    >
                        Category:
                    </Typography>
                    <Select
                        fullWidth
                        multiple
                        label="Category"
                        value={selCategories}
                        renderValue={(selected) => selected.join(', ')}
                        onChange={handleCategoryChange}
                    >
                        {Categories.map(category => {
                            return (
                                <MenuItem value={category}>
                                    <Checkbox checked={selCategories.indexOf(category) > -1} />
                                    <ListItemText primary={category} />
                                </MenuItem>
                            )
                        })}
                    </Select>
                    {selCategories.length > 0 && <>
                        <Typography>
                            Selected Categories:
                            <ul>
                                {selCategories.map(ctgr => {
                                    return (
                                        <li>{ctgr}</li>
                                    )
                                })}
                            </ul>
                        </Typography>
                    </>}
                </Box>
                <Box
                    marginBottom="2%"
                >
                    <Typography>
                        Quantity:
                    </Typography>
                    <TextField
                        fullWidth
                        required
                        value={quantity}
                        // onChange={(event) => { setQuantity(event.target.value) }}
                        margin="normal"
                    >
                    </TextField>
                </Box>
                <Box
                    marginBottom="2%"
                >
                    <Typography>
                        Price:
                    </Typography>
                    <TextField
                        fullWidth
                        required
                        value={price}
                        // onChange={(event) => { setPrice(event.target.value) }}
                        margin="normal"
                    >
                    </TextField>
                </Box>
                <Box 
                    marginBottom="2%"
                >
                    <Typography>
                        Image:
                    </Typography>
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(event) => { handleImageChange(event) }}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                            Upload
                        </Button>
                    </label>
                </Box>
                <Box
                    marginBottom="2%"
                >
                    {imagePreview && <img src={imagePreview} alt="Product Image" width="100%" />}
                </Box>
                <Box
                    marginBottom="5%"
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        // onClick={createitem}
                    >
                        Create
                    </Button>
                </Box>
            </Container>
        </>
    )

}

export default AddProduct;
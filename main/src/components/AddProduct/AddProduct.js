import { Container, TextField, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from "@mui/system";
import { useState } from "react";
import './AddProduct.css'

const getProductNameStrength = (name) => {
    if (name === '')
        return 0;
    let size = name.trim().split(' ').length;
    return size;
}

const getStrengthLabel = (value) => {

    switch (value) {
        case 1:
            return 'Weak';
        case 2:
            return 'Fair';
        case 3:
            return 'Good';
        case 4:
            return 'Strong';
        default:
            return 'Weak';
    }

}

const AddProduct = () => {

    const [productName, setProductName] = useState('');
    const [productNameIsTouched, setProductNameIsTouched] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [productDesc, setProductDesc] = useState('');

    const checkProductNameIsValid = (name) => {
        setProductNameIsTouched(true);
        if (name.trim() !== '' &&
            name.trim().split(' ').length <= 4
        ) {
            setShowError(false);
        }
        else {
            setShowError(true);
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

    return (
        <>
            <Container maxWidth="xs">
                <CssBaseline />
                <Typography
                    variant="h2"
                    align="center"
                    gutterBottom
                >
                    Add Product
                </Typography>

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
                        error={showError}
                        margin="normal"
                    >
                    </TextField>
                    {showError && <Typography
                        color="red"
                        variant="body1"
                    >{errMessage}</Typography>}
                    {!showError && productName !== '' &&
                        <>
                            <progress
                                value={getProductNameStrength(productName)}
                                max="4"
                                className={`productName-strength-meter-progress strength-${getStrengthLabel(getProductNameStrength(productName))}`}
                                style={{ width: "100%" }}
                            />
                            <Typography
                                variant="body1"
                            >
                                Word Strength: {getStrengthLabel(getProductNameStrength(productName))}
                            </Typography>
                        </>
                    }
                    <hr />
                </Box>
                <Typography>
                    Product Description:
                </Typography>
                <TextField
                    multiline
                    label="Product Description"
                    fullWidth
                    rows={4}
                    margin="normal"
                    value={productDesc}
                    onChange={onChangeProductDesc}
                >
                </TextField>
            </Container>
        </>
    )

}

export default AddProduct;
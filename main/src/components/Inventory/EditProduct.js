import {
  Dialog,
  Grid,
  TextField,
  Typography,
  Button,
  Chip,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Categories } from "../../common/category";
import CropEasy from "../AddProduct/CropEasy";

import { db, storage } from "../../FirebaseConfig";
import { doc, updateDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { refFromURL } from "firebase/storage";

function EditDialog(props) {
  const open = props.open;
  const item = props.item;

  const [file, setFile] = useState(item.image);
  const [photoURL, setPhotoURL] = useState(item.image);
  const [photoURL0, setPhotoURL0] = useState(item.image);
  const [openCrop, setOpenCrop] = useState(false);
  const [modal, setModal] = useState(props.open);
  const [editProductName, setEditProductName] = useState(item.name);
  const [editProductDesc, setEditProductDesc] = useState(item.description);
  const [editProductQty, setEditProductQty] = useState(item.quantity);
  const [editProductPrice, setEditProductPrice] = useState(item.price);
  const [editProductTags, setEditProductTags] = useState([]);
  const [curTag, setCurTag] = useState("");
  const [editProductCategories, setEditProductCategories] = useState([]);

  const collectionRefInventory = collection(db, "Inventory");

  useEffect(() => {
    if (item.tag !== undefined) setEditProductTags(item.tag);
    if (item.category !== undefined) setEditProductCategories(item.category);
  }, []);

  const onChangeEditProductName = (event) => {
    setEditProductName(event.target.value);
  };

  const onChangeEditProductDesc = (event) => {
    setEditProductDesc(event.target.value);
  };

  const onChangeEditProductQty = (event) => {
    setEditProductQty(event.target.value);
  };

  const onChangeEditProductPrice = (event) => {
    setEditProductPrice(event.target.value);
  };

  const handleTagDelete = (tag) => {
    const temp = editProductTags;
    temp.splice(temp.indexOf(tag), 1);
    setEditProductTags([...temp]);
  };

  const handleAddTag = () => {
    if (curTag === "") {
      //setTagErrMsg("Please provide a tag to add");
      return;
    }
    const temp = editProductTags;
    temp.push(curTag);
    setEditProductTags([...temp]);
    setCurTag("");
  };

  const handleCategoryChange = (event) => {
    setEditProductCategories(event.target.value);
  };

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

  const handleSubmit = () => {
    // if( fileURL !== photoURL )
    // {
    //     const fileRef = refFromURL(fileURL);
    //     fileRef.delete()
    //     .then(function () {
    //     console.log("File deleted successfully");
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }
    const docRef = doc(collectionRefInventory, item.id);
    if (photoURL !== photoURL0) {
      const imageRef = ref(storage, `Inventory/${editProductName}`);
      uploadBytes(imageRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            updateDoc(docRef, {
              name: editProductName,
              description: editProductDesc,
              quantity: editProductQty,
              price: editProductPrice,
              tag: editProductTags,
              category: editProductCategories,
              image: downloadURL,
            })
              .then(() => {
                alert("Product Updated Successfully");
                window.location.reload();
              })
              .catch((err) => {
                alert("Could not edit Product");
              });
          });
        })
        .catch((err) => {
          alert("Could not edit Product");
        });
    }
    else{
        updateDoc(docRef, {
            name: editProductName,
            description: editProductDesc,
            quantity: editProductQty,
            price: editProductPrice,
            tag: editProductTags,
            category: editProductCategories,
          })
            .then(() => {
              alert("Product Updated Successfully");
              window.location.reload();
            })
            .catch((err) => {
              alert("Could not edit Product");
            });
    }

    setModal(false);
  };

  return (
    <div key={open}>
      <Dialog open={modal} maxWidth="lg">
        <Box margin="5%" width="90%">
          <Typography variant="h4" align="center" gutterBottom>
            Edit Product
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <Typography align="center">
                {openCrop ? (
                  <CropEasy
                    {...{ photoURL, setOpenCrop, setPhotoURL, setFile }}
                  />
                ) : (
                  <></>
                )}
                {!openCrop && file ? (
                  <img src={photoURL} alt="preview" style={{ width: "100%" }} />
                ) : (
                  <></>
                )}
                <Button variant="contained" component="label">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleChange}
                  />
                  Edit Image
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Product Name:</Typography>
              <TextField
                fullWidth
                value={editProductName}
                onChange={onChangeEditProductName}
              ></TextField>
              <Typography>Product Description:</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editProductDesc}
                onChange={onChangeEditProductDesc}
              ></TextField>
              <Typography>Product Quantity:</Typography>
              <TextField
                value={editProductQty}
                onChange={onChangeEditProductQty}
              ></TextField>
              <Typography>Product Price:</Typography>
              <TextField
                value={editProductPrice}
                onChange={onChangeEditProductPrice}
              ></TextField>
            </Grid>
            <Grid item xs={4}>
              <Typography>Current Tags:</Typography>
              {editProductTags.map((tag) => {
                return (
                  <Chip
                    label={tag}
                    sx={{ margin: "1%" }}
                    onDelete={() => {
                      handleTagDelete(tag);
                    }}
                  ></Chip>
                );
              })}
              <Typography>Add Tag:</Typography>
              <TextField
                value={curTag}
                onChange={(event) => {
                  setCurTag(event.target.value);
                }}
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
              <Typography>Current Categories:</Typography>
              {editProductCategories.map((cat) => {
                return <Chip variant="outlined" label={cat} />;
              })}
              <Typography>Add Category:</Typography>
              <Select
                fullWidth
                multiple
                label="Category"
                value={editProductCategories}
                renderValue={(selected) => selected.join(", ")}
                onChange={handleCategoryChange}
              >
                {Categories.map((category) => {
                  return (
                    <MenuItem value={category}>
                      <Checkbox
                        checked={editProductCategories.indexOf(category) > -1}
                      />
                      <ListItemText primary={category} />
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="space-evenly">
              <Button
                variant="contained"
                onClick={() => {
                  setModal(false);
                }}
              >
                CLOSE
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}

export default EditDialog;

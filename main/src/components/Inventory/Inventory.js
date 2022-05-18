import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";

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
            <h1>Inventory</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th> Description</th>
                        <th>Category</th>
                        <th>Tags</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.description}</td>
                            <td>{item.category.map = (c) => (
                                <li key={c}>{c}</li>
                            )}</td>
                            <td>{item.tag.map = (tag) => (
                                <li key={tag}>{tag}</li>
                            )}</td>
                            <td>{item.image}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default Inventory;
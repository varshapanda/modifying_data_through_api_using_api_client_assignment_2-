const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const MenuItems = require('./schema.js');
dotenv.config();

const app = express();
app.use(express.json());

mongoose
.connect(process.env.ATLAS_URL)
.then(()=>console.log('Connected to MongoDB Atlas'))
.catch((error)=>console.error('Error while connecting to MongoDB Atlas',error))

app.put('/menu/:id', async(req,res)=>{
  try{
    const {name,description,price} = req.body;
    if(!name || !price){
      return res.status(400).json({message :'name and price cannot be empty'})
    }
    const updatedMenuItems = await MenuItems.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true, runValidators: true }
    );
    if(!updatedMenuItems){
      return res.status(404).json({
        message : 'menu item not found'});
    }
    res.status(200).json({
      message: 'Menu item updated successfully',
      data: updatedMenuItems,
    });
  }
  catch (error) {
    res.status(500).json({
      message: 'Error updating menu item',
      error: error.message,
    });
  } 
})
app.delete('/menu/:id',async(req,res)=>{
  try{
    const deletedMenuItems = await MenuItems.findByIdAndDelete(req.params.id);
    if (!deletedMenuItems) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }
    res.status(200).json({
      message: 'Menu item deleted successfully',
    });
  }
  catch (error) {
    res.status(500).json({
      message: 'Error deleting menu item',
      error: error.message,
    });
  }   
})

const port = process.env.PORT||3010;
app.listen(port, () => {
  console.log(`Your server is running on port at http://localhost:${port}`);
});

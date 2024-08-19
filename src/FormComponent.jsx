import { collection } from 'firebase/firestore';
import React from 'react'
import {useState} from 'react';
import { addDoc } from "firebase/firestore"; 
import { db } from './config/Firebase';

const FormComponent =  () => {
    const [formData, setFormData] = useState({name: "",contentURL: "",duration: "",poster:"",description:"",narrator:[]});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert(`Name: ${formData.name}, ContentURL: ${formData.contentURL}, Duration: ${formData.duration}, Poster: ${formData.poster}, Description: ${formData.description}, Narator: ${formData.narrator}`
    );
    try {
        const docRef = await addDoc(collection(db, "Story Collection"), {
            ...formData
        });
      
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

};

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Story</h1>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}/>

      <label htmlFor="contentURL">ContentURL:</label>
      <input type="text" id="contentURL" name="contentURL" value={formData.contentURL} onChange={handleChange}/>

      <label htmlFor="duration">Duration:</label>
      <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange}/>
      
      <label htmlFor="poster">Poster:</label>
      <input type="text" id="poster" name="poster" value={formData.poster} onChange={handleChange}/>
      
      <label htmlFor="description">Description:</label>
      <textarea id="description" name="description" value={formData.description} onChange={handleChange}/>

      <label htmlFor="narrator">Narator:</label>
      <input type="narrator" id="narrator" name="narrator" value={formData.narrator} onChange={handleChange}/>

      <button type="submit">Submit</button>
    </form>

    )
};

export default FormComponent
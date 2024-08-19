import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import FormStoryAdd from './FormStoryAdd'
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../config/Firebase'

const Dashboard = ({ setIsAuthenticated }) => {
  const [stories, setStories] = useState();
  const [selectedStory, setSelectedStory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getStories = async () => {
    const querySnapshot = await getDocs(collection(db, "Story Collection"));
    const stories = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
    setStories(stories)
  }

  useEffect(() => {
    getStories()
  }, []);

  const handleEdit = id => {
    const [story] = stories.filter(story => story.id === id);

    setSelectedStory(story);
    setIsEditing(true);
  };

  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        const [story] = stories.filter(story => story.id === id);

        deleteDoc(doc(db, "Story Collection", id));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${story.name}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const storiesCopy = stories.filter(story => story.id !== id);
        setStories(storiesCopy);
      }
    });
  };

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Table
            stories={stories}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
      {isAdding && (
        <FormStoryAdd
          stories={stories}
          setStories={setStories}
          setIsAdding={setIsAdding}
          getStories={getStories}
          setSelectedStory = {setSelectedStory}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      {isEditing && (
        <Edit
          stories={stories}
          selectedStory={selectedStory}
          setStories={setStories}
          setIsEditing={setIsEditing}
          getStories={getStories}
        />
      )}
    </div>
  );
};

export default Dashboard;
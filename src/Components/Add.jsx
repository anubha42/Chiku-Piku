import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { collection, addDoc, updateDoc, setDoc } from "firebase/firestore"; 
import { db } from '../config/Firebase'

import{getDocs, getDoc, doc, arrayUnion} from 'firebase/firestore'

import { uploadBytes } from 'firebase/storage';
import { getStorage, ref, getDownloadURL} from "firebase/storage";



const Add = ({ stories, setStories, setIsAdding, getStories}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [poster, setPoster] = useState('');
  const [description, setDescription] = useState('');
  const [narrator, setNarrator] = useState('');
  const [narrators, setNarrators] = useState([]);
  const [posterfile, setPosterFile] = useState({file: null, state: ''});
  const [audiofile, setAudioFile] = useState({file: null, state: ''});
 
  const [upload, setUpload] = useState(false);

  const [options, setOptions] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "playlists"));
        const optionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setOptions(optionsList);
        console.log(options)
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchOptions();
  }, []);
  
  useEffect(()=>{
                    console.log('state :', posterfile.state,  audiofile.state)
                    if (upload){
                        setPoster(`/posters/${posterfile.file.name}`)
                        setContentURL(`/audios/${audiofile.file.name}`)
                    }

                }, [upload]) 

  const handleSelect = async () => {
      if (selectedDocId) {
        console.log(selectedDocId)
        try {
          const docRef = doc(db, "playlists", selectedDocId);
          await updateDoc(docRef, {
              stories: arrayUnion(name)  // Change "newField" to whatever field name you want to add
          });
          const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
               console.log("Document data:", docSnap.data());
           } else {
               console.log("Document does not exist!");
           }
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      } else {
        alert("Story not uploaded");
    }
  };

  const handleUpload = async() => {
    try {
        const storage = getStorage();
        const posterRef = ref(storage, `/posters/${posterfile.file.name}`);
        const postersnap = await uploadBytes(posterRef, posterfile.file)
    
        const posterdownloadUrl = await getDownloadURL(ref(storage, postersnap.ref.fullPath))
        setPosterFile((prevFormData) => ({...prevFormData, state: posterdownloadUrl}))
    
        const audioRef = ref(storage, `/audios/${audiofile.file.name}`);
        const audiosnap = await uploadBytes(audioRef, posterfile.file)
    
        const audiodownloadUrl = await getDownloadURL(ref(storage, audiosnap.ref.fullPath))
        setAudioFile((prevFormData) => ({...prevFormData, state: audiodownloadUrl}))
    
        setUpload(true)
    } catch (error) {
        return Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error,
            showConfirmButton: true,
          });
    }

    if(upload == true){Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `data has been uploaded.`,
        showConfirmButton: false,
        timer: 1500,
      });}
  }

  const handleAdd = async (e) => {
    e.preventDefault();


    if (!name || !duration  || !description || !posterfile || !audiofile || !narrators) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    
    
    
    
    

    const newStory = {
      name,
      contentURL,
      duration,
      poster,
      description,
      narrators,
    };

    

    stories.push(newStory);

    
    try {
        const querySnapshot = await getDocs(collection(db, "Story Collection"));
        const data = querySnapshot.docs.map((doc) => ({
        id: newStory.name, // Get the document ID
            ...doc.data(), // Get the document data
        }));
        const docRef = doc(collection(db, "Story Collection"), newStory.name);
        setDoc(docRef,{...newStory});
    } catch (error) {
        console.error("Error fetching documents:", error);
    }
  

    /*{try {
      await getDocs(collection(db, "Story Collection")).doc(`${newStory.name}`).set({
        ...newStory
      });
    } catch (error) {
      console.log(error)
    }*/

    setStories(stories);
    setIsAdding(false);
    getStories()


  


    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${name}'s data has been Added.`,
      showConfirmButton: false,
      timer: 1500,
    });

  };

  const addNarrator = () => {
    setNarrators([
      ...narrators,
      {name: narrator }
    ]);
    setNarrator(''); // Clear the input field after adding
  };



  

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <p className= 'small'>
        <h1>Add Employee</h1>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
        /><br/>
        </p>

        {/*<label htmlFor="contentURL">contentURL</label>
        <input
          id="contentURL"
          type="text"
          name="contentURL"
          value={contentURL}
          onChange={e => setContentURL(e.target.value)}
        />*/}

        <p className= 'small'>
        <label htmlFor="duration">Duration</label>
        <input
          id="duration"
          type="text"
          name="duration"
          value={duration}
          onChange={e => setDuration(e.target.value)}
        /><br/>
        </p>
       
        {/* <label htmlFor="poster">Poster</label>
        <input
          id="poster"
          type="text"
          name="poster"
          value={poster}
          onChange={e => setPoster(e.target.value)}
        />*/}
        <p className='big'>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          type="text"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        /><br/>
        </p>

        <p className= 'small'>
        <label htmlFor="narrator">Narrator</label>
        <input
          id="narrator"
          type="text"
          name="narrator"
          value={narrator}
          onChange={e => setNarrator(e.target.value)}
        />
        <input 
        style={{ marginRight: '12px' }}
        className="muted-button"
        type="button"
        value="add narrator"
        onClick={addNarrator}/>
        {narrators.map(narrator => (
          <li key={narrator.name}>{narrator.name}</li>
        ))}
        <br/>
        </p>

        <p className='small'>
        <label htmlFor="posterfile">Poster Image</label>
        <input
          id="posterfile"
          type="file"
          name="posterfile"
          onChange={e => setPosterFile((prevFormData) => ({...prevFormData, file: e.target.files[0]}))}
        /><br/>
        </p>

        <p className='small'>
        <label htmlFor="audiofile">Audio file</label>
        <input
          id="audiofile"
          type="file"
          name="audiofile"
          onChange={e => setAudioFile((prevFormData) => ({...prevFormData, file: e.target.files[0]}))}
        /><br/>
        </p>
        <select onChange={(e) => setSelectedDocId(e.target.value)}>
            <option value= '' >Select an option</option>
            {options.map((option) => (
            <option value={option.id}>
            {option.id}
            </option>))}
        </select>
        <input 
        style={{ marginRight: '12px' }}
        type='button' 
        value= 'set playlist' 
        onClick={handleSelect} />
        <div style={{ marginTop: '30px' }}>
          <input
            style={{ marginRight: '12px' }}
            className="muted-button"
            type="button"
            value="upload"
            onClick={handleUpload} />
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
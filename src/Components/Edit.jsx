import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../config/Firebase'

import { uploadBytes } from 'firebase/storage';
import { getStorage, ref, getDownloadURL} from "firebase/storage";
 

const Edit = ({ stories, selectedStory, setStories, setIsEditing, getStories }) => {
  const id = selectedStory.id;

  const [name, setName] = useState(selectedStory.name);
  const [duration, setDuration] = useState(selectedStory.duration);
  const [poster, setPoster] = useState(selectedStory.poster);
  const [description, setDescription] = useState(selectedStory.description);
  const [narrator, setNarrator] = useState(selectedStory.narrator);
  const [contentURL, setContentURL] = useState(selectedStory.contentURL);
  const [posterfile, setPosterFile] = useState({file: selectedStory.posterfile , state: selectedStory.posterfile});
  const [audiofile, setAudioFile] = useState({file: selectedStory.audiofile, state: selectedStory.audiofile})
  const [upload, setUpload] = useState(false);

  useEffect(()=>{
    console.log('state :', posterfile.state,  audiofile.state)
    if (upload){
        setPoster(`/posters/${posterfile.file.name}`)
        setContentURL(`/audios/${audiofile.file.name}`)
    }

    }, [upload])

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name || !duration || !poster || !description || !narrator || !contentURL) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const story = {
      id,
      name,
      contentURL,
      duration,
      poster,
      description,
      narrator,
    };

    await setDoc(doc(db, "Story Collection", id), {
      ...story
    });

    setStories(stories);
    setIsEditing(false);
    getStories()

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${story.name}'s data has been updated.`,
      showConfirmButton: false,
      timer: 1500,
    });
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

        if(upload){Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: `data has been uploaded.`,
            showConfirmButton: false,
            timer: 1500,
          });}
    } catch (error) {
        return Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: errorS,
            showConfirmButton: true,
        });
        
    }


  }

  return (
    <div className="small-container">
    <form onSubmit={handleUpdate}>
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
        type="list"
        name="narrator"
        value={narrator}
        onChange={e => setNarrator(e.target.value)}
      /><br/>
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

      <div style={{ marginTop: '30px' }}>
        <input
          style={{ marginRight: '12px' }}
          className="muted-button"
          type="button"
          value="upload"
          onClick={handleUpload} />
        <input type="submit" value="update" />
        <input
          style={{ marginLeft: '12px' }}
          className="muted-button"
          type="button"
          value="Cancel"
          onClick={() => setIsEditing(false)}
        />
      </div>
    </form>
  </div>
  );
};

export default Edit;
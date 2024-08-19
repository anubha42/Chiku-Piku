import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { collection, addDoc, updateDoc, setDoc, getDocs, getDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/Firebase';
import { uploadBytes, getDownloadURL, ref, getStorage } from 'firebase/storage';

const Add = ({ stories, setStories, setIsAdding, getStories }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [poster, setPoster] = useState('');
  const [description, setDescription] = useState('');
  const [narrator, setNarrator] = useState('');
  const [narrators, setNarrators] = useState([]);
  const [posterFile, setPosterFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [options, setOptions] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'playlists'));
        const playlists = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOptions(playlists);
      } catch (error) {
        console.error('Error fetching playlists: ', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSelectPlaylist = async () => {
    if (!selectedDocId) {
      return Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please select a playlist before proceeding.',
        showConfirmButton: true,
      });
    }

    try {
      const playlistRef = doc(db, 'playlists', selectedDocId);
      await updateDoc(playlistRef, {
        stories: arrayUnion(name),
      });

      const updatedDoc = await getDoc(playlistRef);
      if (updatedDoc.exists()) {
        console.log('Updated playlist data:', updatedDoc.data());
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleUploadFiles = async () => {
    if (!posterFile || !audioFile) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please upload both poster and audio files.',
        showConfirmButton: true,
      });
    }

    setUploading(true);

    try {
      const storage = getStorage();

      // Upload Poster
      const posterRef = ref(storage, `/posters/${posterFile.name}`);
      await uploadBytes(posterRef, posterFile);
      const posterDownloadURL = await getDownloadURL(posterRef);
      setPoster(`/posters/${posterFile.name}`);

      // Upload Audio
      const audioRef = ref(storage, `/audios/${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      const audioDownloadURL = await getDownloadURL(audioRef);
      setContentURL(`/audios/${audioFile.name}`);

      setUploading(false);

      Swal.fire({
        icon: 'success',
        title: 'Files Uploaded!',
        text: 'Poster and audio files have been uploaded successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setUploading(false);
      console.error('File upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed!',
        text: `Failed to upload files: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };

  const handleAddStory = async (e) => {
    e.preventDefault();

    if (!name || !duration || !description || !posterFile || !audioFile || narrators.length === 0) {
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

    try {
      await setDoc(doc(db, 'Story Collection', newStory.name), newStory);
      setStories((prevStories) => [...prevStories, newStory]);

      setIsAdding(false);
      getStories();

      Swal.fire({
        icon: 'success',
        title: 'Story Added!',
        text: `${name}'s data has been added successfully.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error adding story:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to add story.',
        showConfirmButton: true,
      });
    }
  };

  const addNarrator = () => {
    if (narrator.trim()) {
      setNarrators((prevNarrators) => [...prevNarrators, { name: narrator }]);
      setNarrator('');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleAddStory} className="story-form">
        <h1 className="form-title">Add Story</h1>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration</label>
          <input
            id="duration"
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="narrator">Narrator</label>
          <div className="narrator-input">
            <input
              id="narrator"
              type="text"
              value={narrator}
              onChange={(e) => setNarrator(e.target.value)}
            />
            <button type="button" className="add-narrator-btn" onClick={addNarrator}>
              Add
            </button>
          </div>
          <ul className="narrator-list">
            {narrators.map((narrator, index) => (
              <li key={index}>{narrator.name}</li>
            ))}
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="posterfile">Poster Image</label>
          <input
            id="posterfile"
            type="file"
            accept="image/*"
            onChange={(e) => setPosterFile(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="audiofile">Audio File</label>
          <input
            id="audiofile"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="playlist">Add to Playlist</label>
          <select onChange={(e) => setSelectedDocId(e.target.value)} required>
            <option value="">Select a Playlist</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </select>
          <button type="button" className="set-playlist-btn" onClick={handleSelectPlaylist}>
            Set Playlist
          </button>
        </div>

        <div className="button-group">
          <button
            type="button"
            className={`upload-button ${uploading ? 'loading' : ''}`}
            onClick={handleUploadFiles}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
          <button type="submit" className="primary-button">
            Add Story
          </button>
          <button type="button" className="muted-button" onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;

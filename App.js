import React, { useState, useEffect } from 'react';

const API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    const cachedPhotos = localStorage.getItem('cachedPhotos');
    if (cachedPhotos) {
      setCachedData(JSON.parse(cachedPhotos));
    }
  }, []);

  useEffect(() => {
    if (cachedData === null) {
      fetchData();
    } else {
      setPhotos(cachedData.photos);
    }
  }, [cachedData]);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const fetchedPhotos = json.photos.photo;
      
      // Check if API response has changed
      if (!cachedData || JSON.stringify(fetchedPhotos) !== JSON.stringify(cachedData.photos)) {
        setPhotos(fetchedPhotos);
        // Cache fetched photos
        localStorage.setItem('cachedPhotos', JSON.stringify({ photos: fetchedPhotos, timestamp: Date.now() }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ 
      backgroundImage: 'url(https://hougumlaw.com/wp-content/uploads/2016/05/light-website-backgrounds-light-color-background-images-light-color-background-images-for-website-1024x640.jpg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      textAlign: 'center',
      minHeight: '100vh' // Ensuring the background covers the entire viewport height
    }}>
      <nav style={{ textAlign: 'left', padding: '20px', position: 'absolute', top: '0', left: '0', background: '#f2f2f2', width: '200px', height: '100%' }}>
        <ul>
          <li><a href="#" onClick={fetchData} style={homeButtonStyle}>Home</a></li>
        </ul>
      </nav>
      <div style={{ marginLeft: '220px', padding: '20px' }}> {/* Adjust the left margin to accommodate the navbar width */}
        <h1>Recent Images from Flickr</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {photos && photos.map(photo => (
            <div key={photo.id} style={{ textAlign: 'center', margin: '10px' }}>
              <img src={photo.url_s} alt={photo.title} />
              <p>{photo.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const homeButtonStyle = {
  backgroundColor: '#4CAF50', /* Green background */
  border: 'none', /* Remove borders */
  color: 'white', /* White text */
  padding: '15px 32px', /* Some padding */
  textAlign: 'center', /* Centered text */
  textDecoration: 'none', /* Remove underline */
  display: 'inline-block', /* Make the button a block element */
  fontSize: '16px', /* Increase font size */
  margin: '4px 2px', /* Add some margin */
  cursor: 'pointer', /* Cursor pointer on hover */
  borderRadius: '12px', /* Rounded corners */
  boxShadow: '0 9px #999' /* Add a shadow */
};

export default App;

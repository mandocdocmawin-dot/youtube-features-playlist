import { useState } from 'react';
import './SongList.css';
import Divider from "../../Divider"; 

function SongList() {
    // Core playback state - now stores the Spotify ID instead of YouTube
    const [activeTrackId, setActiveTrackId] = useState(null);
    const [activeTrackType, setActiveTrackType] = useState('track'); // can be track, album, etc.
    
    // State for the input field
    const [spotifyUrl, setSpotifyUrl] = useState('');

    // Dynamic state array with images, replacing the hardcoded files
    const [tracks, setTracks] = useState([
        { 
            id: '4cOdK2wGLETKBW3PvgPWqT', // Example Spotify ID
            type: 'track',
            title: 'What if I miss you for the rest of my life?', 
            artist: 'Janine Berdin',
            imageUrl: 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14',
            extra: '9 plays across 3 devices' 
        },
        { 
            id: '719TCAK0i7K4V5j6X00mRk', 
            type: 'track',
            title: 'Paninindigan Kita', 
            artist: 'Ben&Ben',
            imageUrl: 'https://i.scdn.co/image/ab67616d0000b27341adbfb992b18f8d67c51921'
        },
        { 
            id: '2T523YMzbCSM86LYZDCZLI', // From your screenshot
            type: 'album',
            title: 'Pag-Ibig ay Kanibalismo II', 
            artist: 'fitterkarma',
            imageUrl: 'https://i.scdn.co/image/ab67616d0000b273a216dbbbd1ec8efd93ebc6c3'
        },
    ]);

    const handleTrackSelect = (trackId, type) => {
        if (activeTrackId === trackId) {
            setActiveTrackId(null); // Pause/hide player if clicked again
        } else {
            setActiveTrackId(trackId);
            setActiveTrackType(type);
        }
    };

    const handleAddTrack = (e) => {
        e.preventDefault(); 
        if (!spotifyUrl.trim()) return;

        // Basic logic to extract the ID and type from a Spotify link
        // Example: https://open.spotify.com/album/2T523YMzbCSM86LYZDCZLI
        try {
            const urlObj = new URL(spotifyUrl);
            const pathParts = urlObj.pathname.split('/'); 
            
            if (pathParts.length >= 3) {
                const type = pathParts[1]; // 'track', 'album', or 'playlist'
                const id = pathParts[2];   // The actual ID string

                const newTrack = {
                    id: id,
                    type: type,
                    title: 'New Added Track', // In a real app, you'd fetch this from Spotify's API
                    artist: 'Unknown Artist',
                    imageUrl: 'https://placehold.co/100x100/1db954/white?text=Music', // Placeholder image
                };

                setTracks([...tracks, newTrack]);
                setSpotifyUrl(''); // Clear input
            } else {
                alert("Please enter a valid Spotify link.");
            }
        } catch (error) {
            alert("Invalid URL format.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Input Form */}
            <form onSubmit={handleAddTrack} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                <input 
                    type="text" 
                    value={spotifyUrl} 
                    onChange={(e) => setSpotifyUrl(e.target.value)} 
                    placeholder="Paste Spotify track or album link..." 
                    style={{
                        flex: 1, 
                        padding: '12px 16px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#f4f4f5',
                        outline: 'none'
                    }}
                />
                <button 
                    type="submit" 
                    style={{
                        padding: '12px 24px', 
                        borderRadius: '12px',
                        border: 'none',
                        background: '#1db954', // Spotify Green
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Add Link
                </button>
            </form>

            {/* Dynamic Song List */}
            <section>
                {tracks.map((track, index) => {
                    const isActive = activeTrackId === track.id;

                    return (
                        <div key={track.id}>
                            <div 
                                className={`song-card ${isActive ? 'active' : ''}`}
                                onClick={() => handleTrackSelect(track.id, track.type)}
                                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}
                            >
                                {/* New Image Element */}
                                <img 
                                    src={track.imageUrl} 
                                    alt={track.title} 
                                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                                
                                {/* Text Details */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{track.title}</p>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#8b92a5' }}>
                                        Spotify {track.type === 'album' ? 'Album' : 'Artist'}: {track.artist}
                                    </p>
                                    {track.extra && (
                                        <p style={{ margin: 0, fontSize: '12px', color: '#e4e4e7' }}>
                                            {track.extra}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {index < tracks.length - 1 && <Divider />}
                        </div>
                    );
                })}
            </section>
            
            {/* Visible Spotify Player */}
            {activeTrackId && (
                <div style={{ marginTop: '20px' }}>
                    <iframe 
                        style={{ borderRadius: '12px' }}
                        src={`https://open.spotify.com/embed/${activeTrackType}/${activeTrackId}?utm_source=generator`} 
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allowFullScreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        title="Spotify Player"
                    ></iframe>
                </div>
            )}
        </div>
    );
}

export default SongList;
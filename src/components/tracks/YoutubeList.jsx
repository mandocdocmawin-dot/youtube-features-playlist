import { useState } from 'react';
import './YoutubeList.css';
import Divider from "../../Divider";

function YoutubeList() {
    // Core playback state - stores the YouTube video/playlist ID
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [activeVideoType, setActiveVideoType] = useState('video'); // 'video' or 'playlist'

    // State for the input field
    const [youtubeUrl, setYoutubeUrl] = useState('');

    // Dynamic state array with thumbnails, replacing the hardcoded files
    const [videos, setVideos] = useState([
        {
            id: 'dQw4w9WgXcQ', // Example YouTube video ID
            type: 'video',
            title: 'Never Gonna Give You Up',
            channel: 'Rick Astley',
            imageUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            extra: '9 plays across 3 devices'
        },
        {
            id: 'M7lc1UVf-VE',
            type: 'video',
            title: 'YouTube Developers Live',
            channel: 'Google Developers',
            imageUrl: 'https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg'
        },
        {
            id: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI', // Example playlist ID
            type: 'playlist',
            title: 'Lo-fi Study Mix',
            channel: 'Chillhop Music',
            imageUrl: 'https://placehold.co/100x100/ff0000/white?text=Playlist',
        },
    ]);

    const handleVideoSelect = (videoId, type) => {
        if (activeVideoId === videoId) {
            setActiveVideoId(null); // Pause/hide player if clicked again
        } else {
            setActiveVideoId(videoId);
            setActiveVideoType(type);
        }
    };

    // Extracts a YouTube video or playlist ID from common URL formats:
    // https://www.youtube.com/watch?v=ID
    // https://youtu.be/ID
    // https://www.youtube.com/embed/ID
    // https://www.youtube.com/playlist?list=ID
    // https://www.youtube.com/watch?v=ID&list=LIST_ID
    const parseYoutubeUrl = (url) => {
        const urlObj = new URL(url);
        const host = urlObj.hostname.replace('www.', '');

        if (host === 'youtu.be') {
            const id = urlObj.pathname.split('/')[1];
            if (id) return { id, type: 'video' };
        }

        if (host === 'youtube.com' || host === 'm.youtube.com') {
            const params = urlObj.searchParams;
            const videoId = params.get('v');
            const listId = params.get('list');

            if (videoId) return { id: videoId, type: 'video' };

            if (urlObj.pathname.startsWith('/playlist') && listId) {
                return { id: listId, type: 'playlist' };
            }

            if (urlObj.pathname.startsWith('/embed/')) {
                const id = urlObj.pathname.split('/')[2];
                if (id) return { id, type: 'video' };
            }

            if (listId) return { id: listId, type: 'playlist' };
        }

        return null;
    };

    const handleAddVideo = (e) => {
        e.preventDefault();
        if (!youtubeUrl.trim()) return;

        try {
            const parsed = parseYoutubeUrl(youtubeUrl);

            if (parsed) {
                const { id, type } = parsed;

                const newVideo = {
                    id,
                    type,
                    title: 'New Added Video', // In a real app, you'd fetch this from the YouTube Data API
                    channel: 'Unknown Channel',
                    imageUrl: type === 'video'
                        ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                        : 'https://placehold.co/100x100/ff0000/white?text=Playlist',
                };

                setVideos([...videos, newVideo]);
                setYoutubeUrl(''); // Clear input
            } else {
                alert("Please enter a valid YouTube link.");
            }
        } catch (error) {
            alert("Invalid URL format.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Input Form */}
            <form onSubmit={handleAddVideo} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Paste YouTube video or playlist link..."
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
                        background: '#ff0000', // YouTube Red
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Add Link
                </button>
            </form>

            {/* Dynamic Video List */}
            <section>
                {videos.map((video, index) => {
                    const isActive = activeVideoId === video.id;

                    return (
                        <div key={video.id}>
                            <div
                                className={`yt-card ${isActive ? 'active' : ''}`}
                                onClick={() => handleVideoSelect(video.id, video.type)}
                                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}
                            >
                                {/* Thumbnail Image - grows a bit while this one is playing,
                                    since there's no visible video box anymore to show that */}
                                <img
                                    src={video.imageUrl}
                                    alt={video.title}
                                    className={`yt-thumb ${isActive ? 'active' : ''}`}
                                />

                                {/* Text Details */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{video.title}</p>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#8b92a5' }}>
                                        YouTube {video.type === 'playlist' ? 'Playlist' : 'Channel'}: {video.channel}
                                    </p>
                                    {video.extra && (
                                        <p style={{ margin: 0, fontSize: '12px', color: '#e4e4e7' }}>
                                            {video.extra}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {index < videos.length - 1 && <Divider />}
                        </div>
                    );
                })}
            </section>

            {/* Hidden audio-only player - plays right here on the page without
                showing YouTube's video box. Only the card above (glow + note icon
                + bigger cover art) shows what's currently playing. */}
            {activeVideoId && (
                <iframe
                    className="hidden-audio-player"
                    src={
                        activeVideoType === 'playlist'
                            ? `https://www.youtube.com/embed/videoseries?list=${activeVideoId}&autoplay=1`
                            : `https://www.youtube.com/embed/${activeVideoId}?autoplay=1`
                    }
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    title="YouTube Audio Player"
                ></iframe>
            )}
        </div>
    );
}

export default YoutubeList;
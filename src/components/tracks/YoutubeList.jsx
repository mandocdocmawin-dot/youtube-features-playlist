import { useState } from 'react';
import './YoutubeList.css';
import Divider from "../../Divider";

const ITEMS_PER_PAGE = 3;

function YoutubeList() {
    // Core playback state - stores the YouTube video/playlist ID
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [activeVideoType, setActiveVideoType] = useState('video'); // 'video' or 'playlist'

    // State for the input field
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Dynamic state array - starts empty, populated only from links the user pastes
    const [videos, setVideos] = useState([]);

    // Modal shown when the user tries to add a video/playlist that's already in the list
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(videos.length / ITEMS_PER_PAGE));
    const paginatedVideos = videos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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

    // Pulls the real title, channel/author name, and thumbnail straight from
    // YouTube's oEmbed endpoint using the link the user pasted - no API key needed.
    const fetchYoutubeMetadata = async (url, id, type) => {
        try {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const response = await fetch(oembedUrl);

            if (!response.ok) throw new Error('oEmbed request failed');

            const data = await response.json();

            return {
                title: data.title || 'Untitled',
                channel: data.author_name || 'Unknown Channel',
                imageUrl: data.thumbnail_url || (
                    type === 'video'
                        ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                        : 'https://placehold.co/100x100/ff0000/white?text=Playlist'
                ),
            };
        } catch (error) {
            // Fallback if oEmbed fails (e.g. some playlist links don't support it)
            return {
                title: type === 'playlist' ? 'YouTube Playlist' : 'YouTube Video',
                channel: 'Unknown Channel',
                imageUrl: type === 'video'
                    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                    : 'https://placehold.co/100x100/ff0000/white?text=Playlist',
            };
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        if (!youtubeUrl.trim() || isAdding) return;

        try {
            const parsed = parseYoutubeUrl(youtubeUrl);

            if (!parsed) {
                alert("Please enter a valid YouTube link.");
                return;
            }

            const { id, type } = parsed;

            // Block duplicates - same video/playlist ID + type already in the list
            const isDuplicate = videos.some((v) => v.id === id && v.type === type);
            if (isDuplicate) {
                setShowDuplicateModal(true);
                return;
            }

            setIsAdding(true);

            const metadata = await fetchYoutubeMetadata(youtubeUrl, id, type);

            const newVideo = {
                id,
                type,
                ...metadata,
            };

            const updatedVideos = [...videos, newVideo];
            setVideos(updatedVideos);
            setYoutubeUrl(''); // Clear input

            // Jump to the page that now contains the newly added video
            setCurrentPage(Math.ceil(updatedVideos.length / ITEMS_PER_PAGE));
        } catch (error) {
            alert("Invalid URL format.");
        } finally {
            setIsAdding(false);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
        setActiveVideoId(null); // Auto-pause whatever's playing when the page changes
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
                    disabled={isAdding}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#ff0000', // YouTube Red
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: isAdding ? 'default' : 'pointer',
                        opacity: isAdding ? 0.7 : 1,
                    }}
                >
                    {isAdding ? 'Adding...' : 'Add Link'}
                </button>
            </form>

            {/* Dynamic Video List */}
            <section>
                {videos.length === 0 && (
                    <p style={{ color: '#8b92a5', textAlign: 'center', margin: '30px 0' }}>
                        No videos yet. Paste a YouTube link above to get started.
                    </p>
                )}

                {paginatedVideos.map((video, index) => {
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
                            {index < paginatedVideos.length - 1 && <Divider />}
                        </div>
                    );
                })}
            </section>

            {/* Pagination controls - only shown once there's more than one page */}
            {videos.length > ITEMS_PER_PAGE && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '20px 0'
                }}>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: currentPage === 1 ? '#5a5f6b' : '#f4f4f5',
                            cursor: currentPage === 1 ? 'default' : 'pointer',
                        }}
                    >
                        Prev
                    </button>

                    <span style={{ color: '#8b92a5', fontSize: '14px' }}>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: currentPage === totalPages ? '#5a5f6b' : '#f4f4f5',
                            cursor: currentPage === totalPages ? 'default' : 'pointer',
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Duplicate warning modal */}
            {showDuplicateModal && (
                <div
                    className="yt-modal-overlay"
                    onClick={() => setShowDuplicateModal(false)}
                >
                    <div
                        className="yt-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="yt-modal-title">Already Added</p>
                        <p className="yt-modal-text">
                            This video or playlist is already in your list.
                        </p>
                        <button
                            className="yt-modal-btn"
                            onClick={() => setShowDuplicateModal(false)}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

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
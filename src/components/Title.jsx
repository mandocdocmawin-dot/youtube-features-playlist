import {PLAYLIST_NAME, CURATOR} from '../constants' 

function Title() {
    function hype (text) {
        return text.toUpperCase() + '⭐'
    }
    return (
        <>

            <h1 className="title">Spotify  Playlist</h1>
            <p>Music for every moment</p>
            <p>{`${PLAYLIST_NAME} by ${CURATOR}`}</p>
            <p>{hype("now playing")}</p>
        </>
    )
}

export default Title
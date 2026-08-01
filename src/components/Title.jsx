import {PLAYLIST_NAME, CURATOR} from '../constants' 

function Title() {
    function hype (text) {
        return text.toUpperCase() + '⭐'
    }
    return (
        <>

            <h1 className="title">YouTube  Playlist</h1>
            <p>Broadcast Yourself</p>
            <p>{`${PLAYLIST_NAME} by ${CURATOR}`}</p>
            <p>{hype("now playing")}</p>
        </>
    )
}

export default Title
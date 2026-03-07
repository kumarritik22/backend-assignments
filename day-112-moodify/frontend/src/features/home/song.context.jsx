import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({children}) => {
    const [song, setSong] = useState({    
        "url": "https://ik.imagekit.io/dxx6gjzju/cohort-2/moodify/songs/Rab_Ne_Kiya_Faisala__DOWNLOAD_MING__rq6OhFwqz.mp3",
        "posterUrl": "https://ik.imagekit.io/dxx6gjzju/cohort-2/moodify/posters/Rab_Ne_Kiya_Faisala__DOWNLOAD_MING__k17aVbZ3-.jpeg",
        "title": "Rab Ne Kiya Faisala [DOWNLOAD MING]",
        "mood": "sad"
    })

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{loading, setLoading, song, setSong}} >
            {children}
        </SongContext.Provider>
    )
}
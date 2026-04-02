import { useEffect, useRef, useState } from "react"
import { useAudio } from "../hooks/useAudio"

export function Playerslot({ player_number, character, total_slots, selected }) {
    const [currentSkin, setCurrentSkin] = useState(0)
    const [isSelectingSkin, setIsSelectingSkin] = useState(false)

    const character_image_ref = useRef(null)
    const slot_container_ref = useRef(null)

    const play_narrator_audio = useAudio(100)


    useEffect(() => { // Set skins
        if (character) {
            setCurrentSkin(0)
        }

        setIsSelectingSkin(false)
    }, [character])

    useEffect(() => { // Set selected animation

        if (!selected) {
            return
        }

        character_image_ref.current.classList.add("final-selected")

        slot_container_ref.current.classList.remove("slot-final-selected")

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                slot_container_ref.current.classList.add("slot-final-selected")
            })

        })

        play_narrator_audio(`${import.meta.env.VITE_ASSETS_SOURCE}audios/en/${character.audio}`)

    }, [selected])


    function get_skin(index) { // Return skin based on index
        if (!character) {
            return
        }
        let image_name = character.image.split("_0")

        let final_skin = `${image_name[0]}_${String(index).padStart(2, "0")}.png`

        return final_skin
    }


    function handle_wheel(e) { // Select screen with scroll wheel
        let new_skin = currentSkin

        if (e.deltaY > 0) {

            new_skin += 1

            if (new_skin > 7) {

                new_skin = 0
            }
        }
        else {
            new_skin -= 1

            if (new_skin < 0) {

                new_skin = 7
            }
        }

        setCurrentSkin(new_skin)
    }

    const character_sizes = {
        5: 1.20,
        6: 1.15,
        7: 1.10,
        8: 1.0
    }

    const background_size = {
        5: "115%",
        6: "120%",
        7: "125%",
        8: "130%"

    }

    return (
        <>
            <div ref={slot_container_ref} className="player-slot-container">

                {isSelectingSkin &&
                    <div className="player-slot-skin-selector" >

                        <img className="player-slot-skin-selector-image"
                            src={`${import.meta.env.VITE_ASSETS_SOURCE}characters/${get_skin(currentSkin)}`}></img>

                        <div className="player-slot-skin-selector-grid">

                            {Array(8).fill().map((item, index) => (

                                <img className={`${currentSkin == index ? "player-slot-skin-selector-selected" : ""}`} onMouseEnter={() => setCurrentSkin(index)} onClick={() => setIsSelectingSkin(false)} src={`${import.meta.env.VITE_ASSETS_SOURCE}miniicons/${get_skin(index)}`}></img>
                            ))}

                        </div>

                        <p>{`Appareance ${currentSkin + 1}`}</p>

                    </div>

                }

                <div className='player-slot-corner-border' ></div>
                <div className="player-slot">


                    <div style={{ backgroundSize: background_size[total_slots] ?? '' }} className="player-slot-background"></div>

                    <img ref={character_image_ref} key={character?.image} style={{ scale: character_sizes[total_slots] }}
                        onWheel={handle_wheel} onClick={() => setIsSelectingSkin(!isSelectingSkin)} draggable={false}
                        src={`${import.meta.env.VITE_ASSETS_SOURCE}characters/${get_skin(currentSkin)}`} >

                    </img>

                    <a className="player-character-name" >{character?.name}</a>

                    <div className="player-name">

                        <p contentEditable spellCheck={false} suppressContentEditableWarning >
                            {`Player ${player_number}`}
                        </p>

                    </div>

                    <div style={{ width: total_slots == 8 ? '103%' : '' }} className="player-status-border"> </div>
                    <div style={{ width: total_slots == 8 ? '100%' : '' }} className="player-status">

                        <p className="player-status-number">
                            {`P${player_number}`}
                        </p>

                    </div>

                </div>
            </div>
        </>
    )
}
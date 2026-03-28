import { useEffect, useRef, useState } from "react"

export function Playerslot({ player_number, character, total_slots, selected}) {
    const [currentSkin, setCurrentSkin] = useState(null)
    const character_image_ref = useRef(null)

    function toggle_skin(e) {
        let character = currentSkin.split("_0")
        let skin_number = Number(character[1].split(".")[0])

        let new_number = 0


        if (skin_number <= 6) {
            new_number = skin_number + 1
        }

        let final_skin = `${character[0]}_${String(new_number).padStart(2, "0")}.png`

        setCurrentSkin(final_skin)
    }

    function toggle_skin_back(e) {
        e.preventDefault()
        let character = currentSkin.split("_0")
        let skin_number = Number(character[1].split(".")[0])

        let new_number = 7


        if (skin_number >= 1) {
            new_number = skin_number - 1
        }

        let final_skin = `${character[0]}_${String(new_number).padStart(2, "0")}.png`

        setCurrentSkin(final_skin)
    }

    useEffect(() => {
        if (character) {
            setCurrentSkin(character.image)
        }
    }, [character])

    useEffect(()=>{

        if(!selected){
            return
        }

        character_image_ref.current.classList.add("final-selected")

    },[selected])

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
            <div className="player-slot-container">
                <div className='player-slot-corner-border' ></div>
                <div className="player-slot">
                    <div style={{backgroundSize: background_size[total_slots] ?? ''}} className="player-slot-background"></div>



                    {currentSkin &&
                        <img ref={character_image_ref} style={{ scale: character_sizes[total_slots] }} onContextMenu={toggle_skin_back} onClick={toggle_skin} draggable={false} key={character?.image} 
                        src={`${import.meta.env.VITE_ASSETS_SOURCE}characters/${currentSkin}`} >
                            
                        </img>

                    }

                    <a className="player-character-name" >{character?.name}</a>

                    <div className="player-name">
                        <p contentEditable spellCheck={false} suppressContentEditableWarning >
                            {`Player ${player_number}`}
                        </p>
                    </div>

                    <div style={{width: total_slots == 8 ? '103%' : ''}} className="player-status-border"> </div>

                    <div style={{width: total_slots == 8 ? '100%' : ''}} className="player-status">
                        <p className="player-status-number">
                            {`P${player_number}`}
                        </p>

                    </div>


                </div>
            </div>

        </>
    )
}
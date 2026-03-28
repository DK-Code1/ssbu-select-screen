import { useEffect, useState, useRef } from "react"

export function Character({ character_name, icon, character_number, selected_characters}) {

    const character_cell_ref = useRef(null)

    const player_colors = {
        0: "red",
        1: "blue",
        2: "yellow",
        3: "green",
        4: "orange",
        5: "cyan",
        6: "pink",
        7: "purple",
    }

    useEffect(()=>{
        if (!character_cell_ref){
            return
        }

        character_cell_ref.current.className = `character-cell`

        if (selected_characters.some(selected => selected == character_number))
        {
            let color = player_colors[selected_characters.indexOf(character_number)]
            character_cell_ref.current.classList.add(`selected`, color)

        }
    },[selected_characters])

    return (
        <div ref={character_cell_ref} id={character_number} className={`character-cell`}>
            <img src={`${import.meta.env.VITE_ASSETS_SOURCE}iconscompressed/${icon}`} ></img>
            <p>{character_name.toUpperCase()}</p>
        </div>
    )
}
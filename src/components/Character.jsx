import { useEffect, useState, useRef } from "react"

export function Character({ character_name, icon, character_number, selected_color}) {

    const character_cell_ref = useRef(null)

    const player_colors = { // Selected character cell colors
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

        if (selected_color < 0){
            character_cell_ref.current.className = `character-cell`
            return
        }

        character_cell_ref.current.classList.add(`selected`, player_colors[selected_color])

    },[selected_color])

    return (
        <div ref={character_cell_ref} id={character_number} className={`character-cell`}>
            <img src={`${import.meta.env.VITE_ASSETS_SOURCE}iconscompressed/${icon}`} ></img>
            <p>{character_name.toUpperCase()}</p>
        </div>
    )
}
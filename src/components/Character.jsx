import { useState } from "react"

export function Character({character_name, icon}){


    return(
        <span className="character-cell">
            <img src={`${import.meta.env.VITE_ASSETS_SOURCE}iconscompressed/${icon}`} ></img>
            <p>{character_name.toUpperCase()}</p>
        </span>
    )
}
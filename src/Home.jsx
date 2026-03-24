import { useEffect, useRef, useState } from 'react'
import { Character } from './components/Character.jsx'
import { Playerslot } from './components/Playerslot.jsx'
import { useAudio } from './hooks/useAudio.jsx'
import { Modal } from './components/Modal.jsx'

function Home() {
    const [playerSlots, setPlayersSlots] = useState(4)
    const [characters, setCharacters] = useState([])
    const [isSelecting, setIsSelecting] = useState(true)
    const [selectedCharacters, setSelectedCharacters] = useState([1, 8, 1, 10, 11, 31, 64, 73])
    // const [selectedCharacters, setSelectedCharacters] = useState([84, 84, 84, 84, 84, 84, 84, 84]) //DEBUG

    const [helpModalOpen, setHelpModalOpen] = useState(false)

    const play_hover_audio = useAudio("/hover.mp3")

    const slots_grid_ref = useRef(null)

    const add_slot_button = useRef(null)
    const remove_slot_button = useRef(null)


    useEffect(() => { // Fetch data first
        const fetchEpisode = async () => {
            const file = await (await fetch(`/character_list.json`))
            const fileobject = await file.json();
            setCharacters(fileobject)
        };

        fetchEpisode();
    }, [])

    useEffect(() => { // Slots number logic

        if (playerSlots == 2) {
            remove_slot_button.current.disabled = true;
        }
        else {
            remove_slot_button.current.disabled = "";
        }

        if (playerSlots == 8) {
            add_slot_button.current.disabled = true
        }
        else {
            add_slot_button.current.disabled = ""
        }

    }, [playerSlots])


    function handle_cursor(e) {

        if (!isSelecting) {
            return
        }

        let selected_index = Array.prototype.indexOf.call(e.currentTarget.children, e.target.parentElement)

        if (selected_index == -1) { // Not a character cell
            return
        }

        if (selected_index != selectedCharacters[0]) { // Not the already selected character cell
            //setSelectedCharacter(selected_index)

            setSelectedCharacters(selectedCharacters.map((item, index) => index == 0 ? selected_index : item))
            play_hover_audio()
        }

    }

    function handle_cursor_down(e) { // Toggle selecting
        setIsSelecting(!isSelecting)

        e.preventDefault()
    }

    function increase_player_slot(e) {
        let current_slots = playerSlots

        if (current_slots == 8) {
            add_slot_button.current.disabled = true
            return
        }

        if (playerSlots + 1 == 8) {
            slots_grid_ref.current.style.gap = "0"
        }

        setPlayersSlots(playerSlots + 1)
        slots_grid_ref.current.style.gridTemplateColumns = `repeat(${current_slots + 1},1fr)`


    }

    function decrease_player_slot(e) {


        let current_slots = playerSlots

        if (current_slots == 2) {
            return
        }

        if (playerSlots - 1 <= 7) {
            slots_grid_ref.current.style.gap = ""
        }

        setPlayersSlots(playerSlots - 1)
        slots_grid_ref.current.style.gridTemplateColumns = `repeat(${current_slots - 1},1fr)`

    }

    function sleep(ms) { // timer
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function randomize_slot(slot_number) {

        for (const item in Array(10).fill()) { // We change the slot to a random character 10 times for a better effect
            await sleep(50 + slot_number * 2)
            let new_number = Math.floor(Math.random() * 83)

            play_hover_audio()
            setSelectedCharacters(prev => prev.map((item, index) => index == slot_number ? new_number : item))
        }



    }

    function randomize_characters(e) { // Trigger randomizer in a separate thread for each slot
        Array(playerSlots).fill().forEach((item, index) => {

            randomize_slot(index)
        })

    }


    async function showModal() {
        setHelpModalOpen(true)
    }

    async function closeModal() {
        setHelpModalOpen(false)
    }

    return (
        <>
            <div className='screen screen-background'>

                <div className='top-bar'>

                    <div className='top-bar-red'>
                        <button onClick={showModal} className='top-bar-button1' >
                            <img src='help.png'></img>
                        </button>
                        <div className='top-bar-button1-border'></div>

                        <button className='paralel2' ></button>
                        <div className='paralel2-border'></div>

                        <div className='top-bar-combatmode'>Solo Battle</div>
                        <div className='top-bar-combatmode-border'></div>

                        <button onClick={randomize_characters} className='top-bar-randomize'>Randomize</button>
                        <div className='top-bar-randomize-border'></div>

                    </div>
                </div>


                <div className='character-grid' onPointerDown={handle_cursor_down} onPointerMove={handle_cursor} >

                    {characters.map((item) => (
                        <Character key={item.character_name} character_name={item.name} icon={item.icon} >

                        </Character>

                    ))}

                </div>


                <div className='player-bar'>



                    <div ref={slots_grid_ref} className='player-slot-grid'>

                        {[...Array(playerSlots).keys()].map((number) => (
                            <Playerslot key={number} player_number={number + 1} character={characters[selectedCharacters[number]]} total_slots={playerSlots}>

                            </Playerslot>
                        ))}

                    </div>

                    <div className='player-bar-add-players'>

                        <button ref={add_slot_button} className='button-plus' onClick={increase_player_slot} >

                            <img src='/add.png'></img>
                        </button>
                        <div className='button-plus-border' ></div>

                        <button ref={remove_slot_button} className='button-minus' onClick={decrease_player_slot}>
                            <img src='/remove.png'></img>
                        </button>
                        <div className='button-minus-border' ></div>
                    </div>

                </div>

            </div>

            <Modal isOpen={helpModalOpen} close={closeModal}  >
                <div className='help-message'>
                <h1>Work in progress!</h1>
                <h2>Soon more languages, quality modes, sounds and fixes.</h2>
                </div>
                </Modal>

        </>
    )
}

export default Home

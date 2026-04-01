import { useEffect, useRef, useState } from 'react'
import { Character } from './components/Character.jsx'
import { Playerslot } from './components/Playerslot.jsx'
import { useAudio } from './hooks/useAudio.jsx'
import { Modal } from './components/Modal.jsx'

function Home() {
    const [playerSlots, setPlayersSlots] = useState(4)
    const [characters, setCharacters] = useState([])
    const [isSelecting, setIsSelecting] = useState(true)
    const [selectedCharacters, setSelectedCharacters] = useState([0, 8, 1, 10, 11, 31, 64, 73])

    const [selectDone, setSelectDone] = useState([0, 0, 0, 0, 0, 0, 0, 0]) // If slot finished selecting character. 0 no, 1 yes.

    // const [selectedCharacters, setSelectedCharacters] = useState([84, 84, 84, 84, 84, 84, 84, 84]) //DEBUG

    const [helpModalOpen, setHelpModalOpen] = useState(false)

    const selectedCharacters_ref = useRef(null)

    const play_hover_audio = useAudio()
    const play_select_audio = useAudio(50)


    const characters_grid_ref = useRef(null)
    const slots_grid_ref = useRef(null)

    const add_slot_button_ref = useRef(null)
    const remove_slot_button_ref = useRef(null)

    const cursor_ref = useRef(null)
    const cursor2_ref = useRef(null)


    useEffect(() => { // Fetch data first
        const fetchData = async () => {
            const file = await (await fetch(`character_list.json`))
            const data = await file.json();
            setCharacters(data)
        };

        fetchData();
    }, [])

    useEffect(() => {
        if (!selectedCharacters) {
            return
        }
        selectedCharacters_ref.current = selectedCharacters
        //update_character_cell_color()
        resetAnimation()

    }, [selectedCharacters])

    function resetAnimation() {
        let animations = document.getAnimations("selected")
        let last_frame = Math.trunc(animations[0].currentTime)

        animations.forEach((animation, index) => {
            if (animation.animationName == "border-glow") {
                animation.currentTime = last_frame
            }
        })
    }


    useEffect(() => { // Slots number logic

        if (playerSlots == 2) {
            remove_slot_button_ref.current.disabled = true;
        }
        else {
            remove_slot_button_ref.current.disabled = "";
        }

        if (playerSlots == 8) {
            add_slot_button_ref.current.disabled = true
        }
        else {
            add_slot_button_ref.current.disabled = ""
        }

    }, [playerSlots])

    // const player_colors = {
    //     0: "red",
    //     1: "blue",
    //     2: "yellow",
    //     3: "green",
    //     4: "orange",
    //     5: "cyan",
    //     6: "pink",
    //     7: "purple",
    // }


    async function select_character(player_slot, character) { // Select a character for a slot
        console.log(player_slot, character)
        console.log(player_slot - 1)

        //let character_cell = characters_grid_ref.current.children[character]

        //character_cell.classList.add("selected")

        setSelectDone(selectDone.map((item, index) => index == player_slot - 1 ? 0 : item)) // Re trigger select animation

        await sleep(0)

        setSelectDone(selectDone.map((item, index) => index == player_slot - 1 ? 1 : item))
        play_select_audio("select.mp3")
        console.log(selectDone)
    }

    function check_hand_selection() { // Check hand character selection
        let cursor_x = cursor2_ref.current.x
        let cursor_y = cursor2_ref.current.y
        let selected_element = document.elementFromPoint(cursor_x, cursor_y)

        if (characters_grid_ref.current.contains(selected_element)) {

            let selected_index = selected_element.parentElement.id

            if (!selected_index) { // not the selected grid
                return
            }

            if (Number(selected_index) != selectedCharacters_ref.current[1]) { // Not the already selected character cell

                setSelectedCharacters(selectedCharacters_ref.current.map((item, index) => index == 1 ? Number(selected_index) : item))
                play_hover_audio("hover.mp3")
            }
        }
    }

    let movement = {
        up: false,
        right: false,
        down: false,
        left: false
    }
    let is_moving = false

    function move_hand() {

        if (!movement.up && !movement.right && !movement.down && !movement.left) {
            is_moving = false
            return
        }

        let move_x = 0
        let move_y = 0

        if (movement.right) {
            move_x += 15
        }
        if (movement.left) {
            move_x -= 15
        }

        if (movement.up) {
            move_y -= 15
        }
        if (movement.down) {
            move_y += 15
        }

        let current_x_position = cursor2_ref.current.x
        let current_y_position = cursor2_ref.current.y

        let new_x_position = current_x_position + move_x
        let new_y_position = current_y_position + move_y

        if (new_y_position >= 0) { // Don't go outside page
            cursor2_ref.current.style.top = `${new_y_position}px`
        }

        if (new_y_position > window.innerHeight - 40) {
            cursor2_ref.current.style.top = `${window.innerHeight - 40}px`
        }

        if (new_x_position >= 0) {
            cursor2_ref.current.style.left = `${new_x_position}px`
        }

        if (new_x_position > window.innerWidth - 40) {
            cursor2_ref.current.style.left = `${window.innerWidth - 40}px`
        }

        check_hand_selection()

        requestAnimationFrame(move_hand)
    }

    function start_movement() { // Start movement loop
        if (is_moving) {
            return
        }
        is_moving = true
        requestAnimationFrame(move_hand)
    }

    function check_hand_cursor_character() {
        select_character(2, selectedCharacters[1])
    }

    function handle_key_down(e) {
        if (e.key == "a") {
            movement.left = true
        }

        if (e.key == "d") {
            movement.right = true
        }


        if (e.key == "w") {
            movement.up = true
        }

        if (e.key == "s") {
            movement.down = true
        }

        if (e.key == " ") {
            e.preventDefault()
            check_hand_cursor_character()
        }

        start_movement()

    }

    function handle_key_up(e) {

        if (e.key == "d") {
            movement.right = false
        }


        if (e.key == "w") {
            movement.up = false
        }

        if (e.key == "a") {
            movement.left = false
        }

        if (e.key == "s") {
            movement.down = false
        }

    }

    useEffect(() => {
        if (cursor_ref && cursor2_ref) {
            window.addEventListener("mousemove", handle_mouse_hand)
            window.addEventListener("keydown", handle_key_down)
            window.addEventListener("keyup", handle_key_up)
        }
    }, [cursor_ref])


    function handle_mouse(e) { // Mouse logic

        if (!isSelecting) {
            return
        }
        let selected_index = e.target.parentElement.id

        if (!selected_index) { // Not a character cell
            return
        }

        if (selected_index != selectedCharacters[0]) { // Not the already selected character cell

            setSelectedCharacters(selectedCharacters.map((item, index) => index == 0 ? Number(selected_index) : item))
            play_hover_audio("hover.mp3")
        }

    }

    function handle_cursor_down(e) { // Toggle selecting

        let selected = e.target.parentElement.id

        if (!selected) {
            return
        }

        setSelectedCharacters(selectedCharacters_ref.current.map((item, index) => index == 0 ? Number(selected) : item))

        select_character(1, Number(selected))

        // setIsSelecting(!isSelecting)

        e.preventDefault()
    }


    function handle_mouse_hand(e) { // Player 1 cursor
        if (cursor_ref.current) {
            cursor_ref.current.style.left = `${e.clientX}px`
            cursor_ref.current.style.top = `${e.clientY}px`
        }

    }

    function increase_player_slot(e) {
        let current_slots = playerSlots

        if (current_slots == 8) {
            add_slot_button_ref.current.disabled = true
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

            play_hover_audio("hover.mp3")
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

                        <button onClick={randomize_characters} className='top-bar-randomize'>
                            <img src='random.png'></img>
                        </button>
                        <div className='top-bar-randomize-border'></div>

                    </div>
                </div>


                <div ref={characters_grid_ref} className='character-grid' onPointerDown={handle_cursor_down} onPointerMove={handle_mouse} >

                    {characters.map((item, index) => (
                        <Character key={item.character_name} character_number={index} character_name={item.name} icon={item.icon} 
                        selected_characters={selectedCharacters.slice(0, playerSlots)} >

                        </Character>

                    ))}

                </div>


                <div className='player-bar'>

                    <img ref={cursor_ref} className='hand-cursor' src='cursor.png' ></img>
                    <img ref={cursor2_ref} className='hand-cursor' src='cursor.png' ></img>

                    <div ref={slots_grid_ref} className='player-slot-grid'>

                        {[...Array(playerSlots).keys()].map((number) => (
                            <Playerslot key={number} selected={selectDone[number]} player_number={number + 1} character={characters[selectedCharacters[number]]} total_slots={playerSlots}>

                            </Playerslot>
                        ))}

                    </div>

                    <div className='player-bar-add-players'>

                        <button ref={add_slot_button_ref} className='button-plus' onClick={increase_player_slot} >

                            <img src='add.png'></img>
                        </button>
                        <div className='button-plus-border' ></div>

                        <button ref={remove_slot_button_ref} className='button-minus' onClick={decrease_player_slot}>
                            <img src='remove.png'></img>
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

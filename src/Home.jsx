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

    const [selectDone, setSelectDone] = useState([0,0,0,0,0,0,0,0]) // If slot finished selecting character. 0 no, 1 yes.

    // const [selectedCharacters, setSelectedCharacters] = useState([84, 84, 84, 84, 84, 84, 84, 84]) //DEBUG

    const [helpModalOpen, setHelpModalOpen] = useState(false)

    const selectedCharacters_ref = useRef(null)



    const play_hover_audio = useAudio("hover.mp3")

    const characters_grid_ref = useRef(null)
    const slots_grid_ref = useRef(null)

    const add_slot_button = useRef(null)
    const remove_slot_button = useRef(null)

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

    useEffect(()=>{
        if (!selectedCharacters){
            return
        }
        selectedCharacters_ref.current = selectedCharacters
        //update_character_cell_color()
        resetAnimation()

    },[selectedCharacters])

    function resetAnimation() {
        let animations = document.getAnimations("selected")
        let last_frame = animations[0].currentTime
        animations.forEach((animation, index) => {
            if (animation.animationName == "border-glow") {
                animation.currentTime = last_frame
            }
        })
    }


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

    // function update_character_cell_color(){
    //     console.log(characters_grid_ref.current)
    //     if (!characters_grid_ref.current.childNodes.length){
    //         return
    //     }

    //     let cell_list = characters_grid_ref.current.childNodes
    //     console.log(cell_list)

    //     selectedCharacters.forEach((entry, index)=>{
    //         console.log(entry, index)
    //         cell_list[entry].classList.add(`selected`, player_colors[index])
    //     })
    // }

    function handle_mouse(e) {
        if(cursor2_ref.current){
        cursor_ref.current.style.left = `${e.clientX}px`
        cursor_ref.current.style.top = `${e.clientY}px`
        }

    }

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


    async function select_character(player_slot, character){
        console.log(player_slot,character )
        console.log(player_slot -1)
        let character_cell = characters_grid_ref.current.children[character]

        character_cell.classList.add("selected")
        setSelectDone([0,0,0,0,0,0,0,0])
        await sleep(0)
        setSelectDone(selectDone.map((item,index) => index == player_slot-1 ? 1 : item))
        console.log(selectDone)
    }

    function check_hand_selection() {
        let cursor_x = cursor2_ref.current.x
        let cursor_y = cursor2_ref.current.y
        let selected_element = document.elementFromPoint(cursor_x, cursor_y)

        if (characters_grid_ref.current.contains(selected_element)) {

            let selected_index = selected_element.parentElement.id

            if (!selected_index){ // not the selected grid
                return
            }
            
            if (Number(selected_index) != selectedCharacters_ref.current[1]) { // Not the already selected character cell

            setSelectedCharacters(selectedCharacters_ref.current.map((item, index) => index == 1 ? Number(selected_index) : item))
            play_hover_audio()
        }
        }
    }

    let move_right_loop = true
    let moving_right = false

    let move_up_loop = true
    let moving_up = false

    let move_left_loop = true
    let moving_left = false

    let move_down_loop = true
    let moving_down = false


    function move_right() {

        if (!move_right_loop) {
            return
        }
        moving_right = true

        let current_x_position = cursor2_ref.current.x
        cursor2_ref.current.style.left = `${current_x_position + 15}px`
        requestAnimationFrame(move_right)
        check_hand_selection()

    }

    function move_up() {
        if (!move_up_loop) {
            return
        }

        moving_up = true

        let current_y_position = cursor2_ref.current.y
        cursor2_ref.current.style.top = `${current_y_position - 15}px`
        requestAnimationFrame(move_up)
                check_hand_selection()

    }

    function move_left() {
        if (!move_left_loop) {
            return
        }

        moving_left = true

        let current_x_position = cursor2_ref.current.x
        cursor2_ref.current.style.left = `${current_x_position - 15}px`
        requestAnimationFrame(move_left)
                check_hand_selection()

    }

    function move_down() {
        if (!move_down_loop) {
            return
        }

        moving_down = true

        let current_y_position = cursor2_ref.current.y
        cursor2_ref.current.style.top = `${current_y_position + 15}px`
        requestAnimationFrame(move_down)
                check_hand_selection()

    }

    function handle_key_down(e) {

        if (e.key == "a" && !moving_left) {
            move_left_loop = true
            requestAnimationFrame(move_left)
        }

        if (e.key == "d" && !moving_right) {
            move_right_loop = true
            requestAnimationFrame(move_right)
        }


        if (e.key == "w" && !moving_up) {
            move_up_loop = true
            requestAnimationFrame(move_up)
        }

        if (e.key == "s" && !moving_down) {
            move_down_loop = true
            requestAnimationFrame(move_down)
        }

    }

    function handle_key_up(e) {

        if (e.key == "d") {
            move_right_loop = false
            moving_right = false
        }


        if (e.key == "w") {
            move_up_loop = false
            moving_up = false
        }

        if (e.key == "a") {
            move_left_loop = false
            moving_left = false
        }

        if (e.key == "s") {
            move_down_loop = false
            moving_down = false
        }

    }

    useEffect(() => {
        if (cursor_ref && cursor2_ref) {
            window.addEventListener("mousemove", handle_mouse)
            window.addEventListener("keydown", handle_key_down)
            window.addEventListener("keyup", handle_key_up)
        }
    }, [cursor_ref])


    function handle_cursor(e) {

        if (!isSelecting) {
            return
        }
        let selected_index = e.target.parentElement.id
        
        if (!selected_index) { // Not a character cell
            return
        }

        if (selected_index != selectedCharacters[0]) { // Not the already selected character cell

            setSelectedCharacters(selectedCharacters.map((item, index) => index == 0 ? Number(selected_index) : item))
            play_hover_audio()
        }

    }

    function handle_cursor_down(e) { // Toggle selecting

        let selected = e.target.parentElement.id

        if (!selected){
            return
        }

        select_character(1, Number(selected))

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

                        <button onClick={randomize_characters} className='top-bar-randomize'>
                            <img src='random.png'></img>
                        </button>
                        <div className='top-bar-randomize-border'></div>

                    </div>
                </div>


                <div ref={characters_grid_ref} className='character-grid' onPointerDown={handle_cursor_down} onPointerMove={handle_cursor} >

                    {characters.map((item, index) => (
                        <Character key={item.character_name} character_number={index} character_name={item.name} icon={item.icon} selected_characters={selectedCharacters.slice(0, playerSlots)} >

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

                        <button ref={add_slot_button} className='button-plus' onClick={increase_player_slot} >

                            <img src='add.png'></img>
                        </button>
                        <div className='button-plus-border' ></div>

                        <button ref={remove_slot_button} className='button-minus' onClick={decrease_player_slot}>
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

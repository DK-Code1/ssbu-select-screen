import { useAudio } from "./useAudio"

export function useCursor(cursor_ref, selectedCharacters_ref, characters_grid_ref, setSelectedCharacters, select_character, play_hover_audio) {


    function check_hand_selection() { // Check hand character selection
        let cursor_x = cursor_ref.current.x
        let cursor_y = cursor_ref.current.y
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

        let current_x_position = cursor_ref.current.x
        let current_y_position = cursor_ref.current.y

        let new_x_position = current_x_position + move_x
        let new_y_position = current_y_position + move_y

        if (new_y_position >= 0) { // Don't go outside page
            cursor_ref.current.style.top = `${new_y_position}px`
        }

        if (new_y_position > window.innerHeight - 40) {
            cursor_ref.current.style.top = `${window.innerHeight - 40}px`
        }

        if (new_x_position >= 0) {
            cursor_ref.current.style.left = `${new_x_position}px`
        }

        if (new_x_position > window.innerWidth - 40) {
            cursor_ref.current.style.left = `${window.innerWidth - 40}px`
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

    function select_character_hand() {
        select_character(2, selectedCharacters_ref[1])
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
            select_character_hand()
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

    return [handle_key_down, handle_key_up]

} 
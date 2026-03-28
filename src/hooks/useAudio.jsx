import { useRef } from "react"

export function useAudio(audio_path, max_intervale=100) {


    const last_play = useRef(Date.now()) // Timer for audio
    

    async function play_audio() {

        let audio = new Audio(audio_path)
        audio.autoplay = false
        audio.volume = 0.25
        audio.play()
    }

    function play_audio_timer() {

        let last_timer = last_play.current

        let current_time = Date.now()

        if (current_time - last_timer > max_intervale) {
            last_play.current = current_time
            play_audio()
        }

    }

    return play_audio_timer
}
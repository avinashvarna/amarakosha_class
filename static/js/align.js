/* ************************************************************************* */
// Styling of Active Text
/* ************************************************************************* */

// Keeping track of which line is highlighted.
let highlighted = null;
let highlighted_sentence = null;

// Making this a function so that this crude styling can be changed later. :-)
function highlight(text_element) {
	const active_text_classes = [
    ];
    const active_sentence_classes = [
        'd-block',                              // Block Display
		'mark'
    ];

    if (highlighted) {
        for (const active_class of active_text_classes) {
            highlighted.classList.remove(active_class);
        }
    }
    if (highlighted_sentence) {
        for (const active_class of active_sentence_classes) {
            highlighted_sentence.classList.remove(active_class);
        }
    }

    for (const active_class of active_text_classes) {
        text_element.classList.add(active_class);
    }
    for (const active_class of active_sentence_classes) {
        text_element.parentNode.classList.add(active_class);
    }

    text_element.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
    highlighted = text_element;
    highlighted_sentence = text_element.parentNode;
}

function human_time(seconds) {
    var seconds = parseFloat(seconds);
    var iso_time = new Date(seconds * 1000).toISOString();
    return (seconds > 3600) ? iso_time.substr(11, 8) : iso_time.substr(14, 5);
}

/* ************************************************************************* */
// Main

{
    let active_element = null;

    // Local Storage
    const storage = window.localStorage;

    // Element Selectors
    const audio_element = document.getElementById("audio");
    const text_elements = document.getElementsByClassName('align-text');

	audio_element.playbackRate = 0.8;

    // Set up handlers for click on text
    for (const text_element of text_elements) {
        text_element.addEventListener('click', (event) => {
			audio_element.pause();
            audio_element.currentTime = parseFloat(text_element.dataset.begin);
        });
    }
    // Set up handlers for time change in audio.
    // Note: This event can fire several times a second, so keep this handler light.
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
    audio_element.ontimeupdate = (event) => {
        // // Don't run this more than every 100 ms.
        const whatTime = parseFloat(audio_element.currentTime.toFixed(3));
        // Find the right text. For now, O(n) loop is fine; we have at most a few hundred verses in a sarga.
        for (const text_element of text_elements) {
            const thisTextStart = parseFloat(text_element.dataset.begin);
            if (active_element == null || thisTextStart <= whatTime) {
                active_element = text_element;
            } else {
                break;
            }
        }
        if (active_element) highlight(active_element);
    }
}
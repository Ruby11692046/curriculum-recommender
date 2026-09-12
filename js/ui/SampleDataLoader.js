import { SAMPLE_TRANSCRIPT } from '../../data/sampleTranscript.js';

export function fillSampleTranscript() {
    const textarea = document.querySelector('#course-paste');
    textarea.value = SAMPLE_TRANSCRIPT;
}
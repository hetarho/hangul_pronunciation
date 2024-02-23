import { hangulPronunciation } from './hangul_pronunciation/HangulPronunciation';

const hp = new hangulPronunciation('밟 밟다 넓 넓다 넙');

console.log(hp.pronounce());

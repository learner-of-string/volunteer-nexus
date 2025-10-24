import { Howl } from "howler";

const sounds = {
    dangerZone: new Howl({
        src: ["/siren.mp3"],
        loop: false,
        volume: 2.75,
        preload: true,
        html5: false,
    }),
};

export default sounds;

import { trafficCop }       from "../router/traffic-cop.js"
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

const getNameFromFlavor = (flavor) => {
    const pattern = /<b>(.*?)<\/b>/;
    const match = flavor.match(pattern);

    // Check if a match was found
    if (match) {
        // Extract the matched text from the first bold section
        const extractedText = match[1];
        return extractedText;
    }
}

export function systemHooks() {
    console.log('dragonbane | System Ready');
    Hooks.on("createChatMessage", async (msg) => {
        console.log('dragonbane | hook called', msg);
        if (msg.user.id !== game.user.id) { return };


        console.log('dragonbane | hook called');

        let compiledData = await getRequiredData({
            // itemId: msg.rolls[0].options?.itemId,
            itemName: getNameFromFlavor(msg.data.flavor),
            flavor: msg.data.flavor,
            actorId: msg.speaker?.actor,
            tokenId: msg.speaker?.token,
            workflow: msg,
        })
        console.log('dragonbane | compiledData', compiledData);
        if (!compiledData.item) { return; }
        runA5e(compiledData)
    });
}

async function runA5e(input) {
    const handler = await AAHandler.make(input)
    trafficCop(handler);
}
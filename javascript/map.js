// export function genMap() {
//     let map = [];
//
//     for (var i = 0; i < mapLength; i += getRand(0, 50)) {
//         let randHeight = getRand(-5, 5);
//         let randInterval = getRand(20, 40);
//
//         let section = {
//             from: i,
//             to: (i = i + getRand(300, 600)),
//             curve: (_) => 0,  // Set curve to 0 to make the road straight
//             height: Math.random() > 0.8 ? (i) => Math.sin(i / randInterval) * 1000 : (_) => randHeight  // Keep the random height logic
//         };
//
//         map.push(section);
//     }
//
//     map.push({
//         from: i,
//         to: i + N,
//         curve: (_) => 0,  // Set curve to 0 to make the road straight
//         height: (_) => 0,  // Set height to 0 for the finish line section
//         special: ASSETS.IMAGE.FINISH,
//     });
//     map.push({ from: Infinity });
//     return map;
// }
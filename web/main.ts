import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord.css";
import { $remark } from "@milkdown/utils";
import remarkBreaks from 'remark-breaks';
import { remarkLineBreak } from '@milkdown/preset-commonmark'


import { commonmark } from "@milkdown/preset-commonmark";
import { emoji } from '@milkdown/plugin-emoji'
import type {RemarkEmojiOptions} from "remark-emoji";

// Editor.make().use(commonmark).use(remarkBreaksPlugin).create();

const crepe = new Crepe({
    root: "#app",
    defaultValue: "Hello\nMilkdown!",
});

crepe.editor.use(remarkLineBreak);
await crepe.create();

//
// import { Crepe } from "@milkdown/crepe";
// import "@milkdown/crepe/theme/common/style.css";
// import "@milkdown/crepe/theme/nord.css";
// import remarkBreaks from 'remark-breaks';
// import { $remark } from "@milkdown/utils";
// import { commonmark } from "@milkdown/preset-commonmark";
//
//
// const remarkBreaksPlugin = $remark('remaryykBreaks', () => remarkBreaks);
//
//
// // Editor.make().use(commonmark).use(remarkBreaksPlugin).create();
//
// const crepe = new Crepe({
//     root: "#app",
//     defaultValue: "# Hello, Milkdown!\nThis should\nbreak lines",
// });
//
// // Add plugin before creating
// await crepe.editor.remove(commonmark)
// await crepe.editor.use(commonmark).create()
// // setTimeout(() => {
// //     crepe.editor.use(remarkBreaksPlugin);
// // }, 1000);

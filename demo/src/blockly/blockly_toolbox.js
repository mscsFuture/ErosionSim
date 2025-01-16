// Tool box

/*
 * The tree structure of this is
 *   movement
 *    |- move left
 *    |- move right
 *    |- move up
 *    \- move down
 *   interaction
 *    |- interact left
 *    |- interact right
 *    |- interact up
 *    \- interact down
 */

var toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    {
      "kind": "block",
      "type": "north"
    },
    {
      "kind": "block",
      "type": "south"
    },
    {
      "kind": "block",
      "type": "east"
    },
    {
      "kind": "block",
      "type": "west"
    },
    {
      "kind": "block",
      "type": "place_object"
    },
    {
      "kind": "block",
      "type": "throw"
    },
    {
      "kind": "block",
      "type": "loop"
    }
  ]
};
// var toolbox = {
//   "kind": "categoryToolbox",
//   "contents": [
//     {
//       "kind": "category",
//       "name": "Move Blocks",
//       "colour": "150",
//       "contents": [
//         {
//           "kind": "block",
//           "type": "north"
//         },
//         {
//           "kind": "block",
//           "type": "south"
//         },
//         {
//           "kind": "block",
//           "type": "up"
//         },
//         {
//           "kind": "block",
//           "type": "down"
//         }
//       ]
//     },
//     {
//       "kind": "category",
//       "name": "Placement Blocks",
//       "colour": "10",
//       "contents": [
//         {
//           "kind": "block",
//           "type": "place_right"
//         },
//         {
//           "kind": "block",
//           "type": "place_left"
//         },
//         {
//           "kind": "block",
//           "type": "tree"
//         },
//         {
//           "kind": "block",
//           "type": "grass"
//         },
//         {
//           "kind": "block",
//           "type": "stone"
//         }
//       ]
//     },
//     {
//       "kind": "category",
//       "name": "Loop Blocks",
//       "colour": "60",
//       "contents": [
//         {
//           "kind": "block",
//           "type": "loop"
//         }
//       ]
//     }
//   ]
// };

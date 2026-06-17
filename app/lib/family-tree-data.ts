export type FamilyTreeNodeId =
  | "baba"
  | "mama"
  | "wedding"
  | "sherien-1994"
  | "sherien-with-parents"
  | "ahmed-2002"
  | "ahmed-with-parents"
  | "family-four";

export interface FamilyTreeNode {
  id: FamilyTreeNodeId;
  src: string;
  caption: string;
  subcaption: string;
  alt: string;
  isFinal?: boolean;
  isWedding?: boolean;
}

export const familyTreeNodes: Record<FamilyTreeNodeId, FamilyTreeNode> = {
  baba: {
    id: "baba",
    src: "/family-tree/father.jpg",
    caption: "Baba",
    subcaption: "Moustafa",
    alt: "Baba Moustafa — the father of the family",
  },
  mama: {
    id: "mama",
    src: "/family-tree/mother.jpg",
    caption: "Mama",
    subcaption: "Doaa",
    alt: "Mama Doaa — the mother of the family",
  },
  wedding: {
    id: "wedding",
    src: "/family-tree/wedding.jpg",
    caption: "Wedding Photo",
    subcaption: "Baba & Mama",
    alt: "Wedding photograph of Baba and Mama",
    isWedding: true,
  },
  "sherien-1994": {
    id: "sherien-1994",
    src: "/family-tree/sherien-1994.jpg",
    caption: "Sherien",
    subcaption: "1994",
    alt: "Sherien born in 1994",
  },
  "sherien-with-parents": {
    id: "sherien-with-parents",
    src: "/family-tree/sherien-with-parents.jpg",
    caption: "Sherien with Baba & Mama",
    subcaption: "Family memory",
    alt: "Sherien with her parents",
  },
  "ahmed-2002": {
    id: "ahmed-2002",
    src: "/family-tree/ahmed-2002.jpg",
    caption: "Ahmed",
    subcaption: "2002",
    alt: "Ahmed born in 2002",
  },
  "ahmed-with-parents": {
    id: "ahmed-with-parents",
    src: "/family-tree/ahmed-with-parents.jpg",
    caption: "Ahmed with Baba & Mama",
    subcaption: "Family memory",
    alt: "Ahmed with his parents",
  },
  "family-four": {
    id: "family-four",
    src: "/family-tree/family-four.jpg",
    caption: "Our Family",
    subcaption: "Beitna starts here",
    alt: "Full family photograph — Our Family, Beitna starts here",
    isFinal: true,
  },
};

export const ANIMATION_STEP_DELAY_MS = 550;
export const LINE_DRAW_DURATION_MS = 800;
export const CARD_FADE_DURATION_MS = 600;

export type AnimationStep =
  | 0 // intro start
  | 1 // baba appears
  | 2 // baba line draws
  | 3 // mama appears
  | 4 // mama line draws
  | 5 // shared center line draws
  | 6 // wedding appears
  | 7 // left branch line draws
  | 8 // sherien 1994 appears
  | 9 // sherien vertical line draws
  | 10 // sherien memory appears
  | 11 // right branch line draws
  | 12 // ahmed 2002 appears
  | 13 // ahmed vertical line draws
  | 14 // ahmed memory appears
  | 15 // lower left merge line draws
  | 16 // lower right merge line draws
  | 17 // final vertical line draws
  | 18; // final family appears + enter button

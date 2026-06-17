export type FamilyTreeNodeId =
  | "father"
  | "mother"
  | "wedding"
  | "sherien1994"
  | "sherienParents"
  | "ahmed2002"
  | "ahmedParents"
  | "familyFour";

export type FamilyTreeNodeSize = "standard" | "wide" | "final";

export interface FamilyTreeNode {
  id: FamilyTreeNodeId;
  caption: string;
  subcaption: string;
  alt: string;
  src: string;
  filePath: string;
  size: FamilyTreeNodeSize;
  desktop: {
    x: number;
    y: number;
  };
}

export const familyTreeNodes: FamilyTreeNode[] = [
  {
    id: "father",
    caption: "Baba",
    subcaption: "Moustafa",
    alt: "Baba Moustafa family tree photo",
    src: "/family-tree/father.jpg",
    filePath: "/public/family-tree/father.jpg",
    size: "standard",
    desktop: { x: 150, y: 92 },
  },
  {
    id: "mother",
    caption: "Mama",
    subcaption: "Doaa",
    alt: "Mama Doaa family tree photo",
    src: "/family-tree/mother.jpg",
    filePath: "/public/family-tree/mother.jpg",
    size: "standard",
    desktop: { x: 860, y: 92 },
  },
  {
    id: "wedding",
    caption: "Wedding Photo",
    subcaption: "Baba & Mama",
    alt: "Baba and Mama wedding photo",
    src: "/family-tree/wedding.jpg",
    filePath: "/public/family-tree/wedding.jpg",
    size: "wide",
    desktop: { x: 500, y: 430 },
  },
  {
    id: "sherien1994",
    caption: "Sherien",
    subcaption: "1994",
    alt: "Sherien 1994 family tree photo",
    src: "/family-tree/sherien-1994.jpg",
    filePath: "/public/family-tree/sherien-1994.jpg",
    size: "standard",
    desktop: { x: 205, y: 730 },
  },
  {
    id: "sherienParents",
    caption: "Sherien with Baba & Mama",
    subcaption: "Family memory",
    alt: "Sherien with Baba and Mama family memory photo",
    src: "/family-tree/sherien-with-parents.jpg",
    filePath: "/public/family-tree/sherien-with-parents.jpg",
    size: "wide",
    desktop: { x: 160, y: 1010 },
  },
  {
    id: "ahmed2002",
    caption: "Ahmed",
    subcaption: "2002",
    alt: "Ahmed 2002 family tree photo",
    src: "/family-tree/ahmed-2002.jpg",
    filePath: "/public/family-tree/ahmed-2002.jpg",
    size: "standard",
    desktop: { x: 805, y: 730 },
  },
  {
    id: "ahmedParents",
    caption: "Ahmed with Baba & Mama",
    subcaption: "Family memory",
    alt: "Ahmed with Baba and Mama family memory photo",
    src: "/family-tree/ahmed-with-parents.jpg",
    filePath: "/public/family-tree/ahmed-with-parents.jpg",
    size: "wide",
    desktop: { x: 780, y: 1010 },
  },
  {
    id: "familyFour",
    caption: "Our Family",
    subcaption: "Beitna starts here",
    alt: "Full family photo of Baba, Mama, Sherien, and Ahmed",
    src: "/family-tree/family-four.jpg",
    filePath: "/public/family-tree/family-four.jpg",
    size: "final",
    desktop: { x: 450, y: 1260 },
  },
];

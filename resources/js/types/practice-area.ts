export interface PracticeArea {
    id: number;
    name: string;
    parent_id: number | null;
    children?: PracticeArea[];
}

// type PracticeArea = {
//     id: number;
//     name: string;
//     parent_id: number | null;
//     children?: PracticeArea[];
// };

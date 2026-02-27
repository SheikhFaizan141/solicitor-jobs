export interface PracticeArea {
    id: number;
    name: string;
    parent_id: number | null;
}

export interface PracticeAreaTreeNode extends PracticeArea {
    children: PracticeAreaTreeNode[];
}

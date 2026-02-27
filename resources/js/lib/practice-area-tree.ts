import { PracticeArea, PracticeAreaTreeNode } from '@/types/practice-area';

export function buildPracticeAreaTree(practiceAreas: PracticeArea[]): PracticeAreaTreeNode[] {
    const byParent: Record<string, PracticeArea[]> = {};
    practiceAreas.forEach((pa) => {
        const key = (pa.parent_id ?? 'root').toString();
        if (!byParent[key]) byParent[key] = [];
        byParent[key].push(pa);
    });

    const build = (parentKey: string): PracticeAreaTreeNode[] =>
        (byParent[parentKey] || []).sort((a, b) => a.name.localeCompare(b.name)).map((n) => ({ ...n, children: build(n.id.toString()) }));

    return build('root');
}

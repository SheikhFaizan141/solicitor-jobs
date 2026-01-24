import { PracticeAreaTreeNode } from '@/types/practice-area';


interface PracticeAreaProps {
    nodes: PracticeAreaTreeNode[];
    selected: number[];
    onToggle: (id: number) => void;
    depth?: number;
}

export default function PracticeAreaTree({ nodes, selected, onToggle, depth = 0 }: PracticeAreaProps) {

    console.log(nodes);
    
    return (
        <ul className={depth === 0 ? 'space-y-1' : 'mt-1 ml-4 space-y-1'}>
            {nodes.map((node) => (
                <li key={node.id}>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selected.includes(node.id)}
                            onChange={() => onToggle(node.id)}
                        />
                        <span>{node.name}</span>
                    </label>
                    {node.children?.length > 0 && (
                        <PracticeAreaTree nodes={node.children} selected={selected} onToggle={onToggle} depth={depth + 1} />
                    )}
                </li>
            ))}
        </ul>
    );
}

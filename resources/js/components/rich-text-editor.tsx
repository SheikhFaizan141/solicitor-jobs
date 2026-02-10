import Link from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    error?: string;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, error, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-amber-600 underline hover:text-amber-700',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Start typing...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return <div className="min-h-[200px] animate-pulse rounded-md border border-input bg-gray-50" />;
    }

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
    };

    return (
        <div className="space-y-1">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 rounded-t-md border border-b-0 border-gray-300 bg-gray-50 p-2">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                    <strong>B</strong>
                </ToolbarButton>

                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                    <em>I</em>
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    H2
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    H3
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    • List
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    1. List
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Add Link">
                    🔗 Link
                </ToolbarButton>

                {editor.isActive('link') && (
                    <ToolbarButton onClick={removeLink} isActive={false} title="Remove Link">
                        ✕
                    </ToolbarButton>
                )}
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className={`rounded-b-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-1 ${
                    error ? 'border-red-500' : ''
                }`}
            />

            {/* Error message */}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

// Toolbar Button Component
function ToolbarButton({ onClick, isActive, title, children }: { onClick: () => void; isActive: boolean; title: string; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                isActive ? 'bg-amber-100 text-amber-800' : 'text-gray-700 hover:bg-gray-200'
            }`}
        >
            {children}
        </button>
    );
}

// Toolbar Divider
function ToolbarDivider() {
    return <div className="mx-1 h-6 w-px bg-gray-300" />;
}

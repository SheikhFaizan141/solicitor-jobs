import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading2,
    Heading3,
    Italic,
    LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo,
    Strikethrough,
    Underline,
    Undo,
    Unlink,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    error?: string;
    placeholder?: string;
    minHeight?: string;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
const modKey = isMac ? '⌘' : 'Ctrl';

export function RichTextEditor({ value, onChange, error, placeholder, minHeight = '200px' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                link: {
                    openOnClick: false,
                    HTMLAttributes: {
                        class: 'text-amber-600 underline hover:text-amber-700',
                    },
                },
                underline: {},
                strike: {},
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-amber-300 pl-4 italic text-gray-600',
                    },
                },
                horizontalRule: {},
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Start typing...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn('prose prose-sm max-w-none p-3 focus:outline-none', `min-h-[${minHeight}]`),
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
        return <div className={cn('animate-pulse rounded-md border border-input bg-muted/50', `min-h-[${minHeight}]`)} />;
    }

    return (
        <div className="space-y-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-b-0 border-input bg-muted/50 px-1.5 py-1">
                {/* Text Formatting */}
                <ToolbarToggle
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    tooltip={`Bold (${modKey}+B)`}
                    aria-label="Bold"
                >
                    <Bold className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    tooltip={`Italic (${modKey}+I)`}
                    aria-label="Italic"
                >
                    <Italic className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    tooltip={`Underline (${modKey}+U)`}
                    aria-label="Underline"
                >
                    <Underline className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    tooltip={`Strikethrough (${modKey}+Shift+S)`}
                    aria-label="Strikethrough"
                >
                    <Strikethrough className="size-4" />
                </ToolbarToggle>

                <ToolbarSeparator />

                {/* Headings */}
                <ToolbarToggle
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    tooltip="Heading 2"
                    aria-label="Heading 2"
                >
                    <Heading2 className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    tooltip="Heading 3"
                    aria-label="Heading 3"
                >
                    <Heading3 className="size-4" />
                </ToolbarToggle>

                <ToolbarSeparator />

                {/* Alignment */}
                <ToolbarToggle
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    tooltip="Align Left"
                    aria-label="Align Left"
                >
                    <AlignLeft className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    tooltip="Align Center"
                    aria-label="Align Center"
                >
                    <AlignCenter className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    tooltip="Align Right"
                    aria-label="Align Right"
                >
                    <AlignRight className="size-4" />
                </ToolbarToggle>

                <ToolbarSeparator />

                {/* Lists & Structure */}
                <ToolbarToggle
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    tooltip="Bullet List"
                    aria-label="Bullet List"
                >
                    <List className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    tooltip="Numbered List"
                    aria-label="Numbered List"
                >
                    <ListOrdered className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    tooltip="Blockquote"
                    aria-label="Blockquote"
                >
                    <Quote className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
                    tooltip="Horizontal Rule"
                    aria-label="Horizontal Rule"
                >
                    <Minus className="size-4" />
                </ToolbarToggle>

                <ToolbarSeparator />

                {/* Link */}
                <LinkButton editor={editor} />

                {editor.isActive('link') && (
                    <ToolbarToggle
                        pressed={false}
                        onPressedChange={() => editor.chain().focus().unsetLink().run()}
                        tooltip="Remove Link"
                        aria-label="Remove Link"
                    >
                        <Unlink className="size-4" />
                    </ToolbarToggle>
                )}

                <ToolbarSeparator />

                {/* History */}
                <ToolbarToggle
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    tooltip={`Undo (${modKey}+Z)`}
                    aria-label="Undo"
                >
                    <Undo className="size-4" />
                </ToolbarToggle>

                <ToolbarToggle
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    tooltip={`Redo (${modKey}+Shift+Z)`}
                    aria-label="Redo"
                >
                    <Redo className="size-4" />
                </ToolbarToggle>
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className={cn(
                    'rounded-b-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
                    error && 'border-destructive focus-within:ring-destructive/30',
                )}
            />

            {/* Error message */}
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
}

// --- Link Button with Popover ---

function LinkButton({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpen = useCallback(
        (isOpen: boolean) => {
            if (isOpen && editor) {
                const existingHref = editor.getAttributes('link').href ?? '';
                setUrl(existingHref);
            }
            setOpen(isOpen);
        },
        [editor],
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!editor) return;

            if (url.trim() === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
            } else {
                editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
            }
            setOpen(false);
        },
        [editor, url],
    );

    if (!editor) return null;

    return (
        <Popover open={open} onOpenChange={handleOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive('link')} aria-label="Insert Link" className="size-8 p-0">
                            <LinkIcon className="size-4" />
                        </Toggle>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>{`Link (${modKey}+K)`}</TooltipContent>
            </Tooltip>

            <PopoverContent className="w-80 p-3" align="start">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="rte-link-url" className="text-xs font-medium">
                            URL
                        </Label>
                        <Input
                            ref={inputRef}
                            id="rte-link-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="h-8 text-sm"
                            autoFocus
                        />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        {editor.isActive('link') && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                onClick={() => {
                                    editor.chain().focus().unsetLink().run();
                                    setOpen(false);
                                }}
                            >
                                <Unlink className="mr-1 size-3" />
                                Remove
                            </Button>
                        )}
                        <div className="ml-auto flex gap-1.5">
                            <Button type="button" variant="outline" size="sm" className="h-7 px-2.5 text-xs" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="h-7 px-2.5 text-xs">
                                Apply
                            </Button>
                        </div>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}

// --- Toolbar Toggle with Tooltip ---

interface ToolbarToggleProps {
    pressed: boolean;
    onPressedChange: () => void;
    tooltip: string;
    disabled?: boolean;
    children: React.ReactNode;
    'aria-label': string;
}

function ToolbarToggle({ pressed, onPressedChange, tooltip, disabled, children, 'aria-label': ariaLabel }: ToolbarToggleProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    pressed={pressed}
                    onPressedChange={onPressedChange}
                    disabled={disabled}
                    aria-label={ariaLabel}
                    className="size-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                >
                    {children}
                </Toggle>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

// --- Toolbar Separator ---

function ToolbarSeparator() {
    return <Separator orientation="vertical" className="mx-1 h-6" />;
}

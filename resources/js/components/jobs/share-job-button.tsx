import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Facebook, Link2, Linkedin, Share2, Twitter } from 'lucide-react';
import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

interface ShareJobButtonProps {
    title: string;
    relativePath: string;
    summary?: string | null;
    buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
    buttonSize?: VariantProps<typeof buttonVariants>['size'];
    className?: string;
}

interface ShareTarget {
    id: string;
    label: string;
    buildUrl: (encodedUrl: string, encodedText: string) => string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

type SharePayload = {
    title?: string;
    text?: string;
    url?: string;
};

type NavigatorWithShare = Navigator & {
    share?: (data?: SharePayload) => Promise<void>;
};

const shareTargets: ShareTarget[] = [
    {
        id: 'linkedin',
        label: 'Share on LinkedIn',
        buildUrl: (encodedUrl, encodedText) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`,
        icon: Linkedin,
    },
    {
        id: 'x',
        label: 'Share on X',
        buildUrl: (encodedUrl, encodedText) => `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        icon: Twitter,
    },
    {
        id: 'facebook',
        label: 'Share on Facebook',
        buildUrl: (encodedUrl, encodedText) => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
        icon: Facebook,
    },
];

export function ShareJobButton({
    title,
    relativePath,
    summary,
    buttonVariant = 'outline',
    buttonSize = 'default',
    className,
}: ShareJobButtonProps) {
    const [shareUrl, setShareUrl] = useState(relativePath);
    const [supportsNativeShare, setSupportsNativeShare] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const absoluteUrl = relativePath.startsWith('http')
            ? relativePath
            : new URL(relativePath, window.location.origin).toString();

        setShareUrl(absoluteUrl);
    }, [relativePath]);

    useEffect(() => {
        if (typeof navigator === 'undefined') {
            return;
        }

        const nav = navigator as NavigatorWithShare;

        if (typeof nav.share === 'function') {
            setSupportsNativeShare(true);
        }
    }, []);

    useEffect(() => {
        if (!copied) {
            return;
        }

        const timeout = window.setTimeout(() => setCopied(false), 2000);

        return () => window.clearTimeout(timeout);
    }, [copied]);

    const shareText = useMemo(() => {
        if (summary) {
            return `${title} – ${summary}`;
        }

        return title;
    }, [summary, title]);

    const encodedUrl = useMemo(() => encodeURIComponent(shareUrl || ''), [shareUrl]);
    const encodedText = useMemo(() => encodeURIComponent(shareText), [shareText]);

    const handleNativeShare = async () => {
        if (!supportsNativeShare || !shareUrl || typeof navigator === 'undefined') {
            return;
        }

        const nav = navigator as NavigatorWithShare;

        if (typeof nav.share !== 'function') {
            return;
        }

        try {
            await nav.share({
                title,
                text: shareText,
                url: shareUrl,
            });
        } catch (error) {
            if ((error as DOMException)?.name === 'AbortError') {
                return;
            }

            console.error('native-share-error', error);
        }
    };

    const handleCopyLink = async () => {
        if (!shareUrl) {
            return;
        }

        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl);
            } else if (typeof document !== 'undefined') {
                const tempInput = document.createElement('input');
                tempInput.value = shareUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }

            setCopied(true);
        } catch (error) {
            console.error('copy-link-error', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant={buttonVariant} size={buttonSize} className={className} aria-label="Share this job">
                    <Share2 className="size-4" />
                    <span>Share</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Share this job</DropdownMenuLabel>
                {supportsNativeShare && (
                    <DropdownMenuItem
                        onSelect={(event) => {
                            event.preventDefault();
                            handleNativeShare();
                        }}
                    >
                        <Share2 className="size-4" />
                        Share via device
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault();
                        handleCopyLink();
                    }}
                    disabled={!shareUrl}
                >
                    <Copy className="size-4" />
                    {copied ? 'Link copied' : 'Copy link'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {shareUrl ? (
                    shareTargets.map((target) => (
                        <DropdownMenuItem key={target.id} asChild>
                            <a
                                href={target.buildUrl(encodedUrl, encodedText)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center gap-2"
                            >
                                <target.icon className="size-4" />
                                {target.label}
                            </a>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>
                        <Link2 className="size-4" />
                        Preparing share links...
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

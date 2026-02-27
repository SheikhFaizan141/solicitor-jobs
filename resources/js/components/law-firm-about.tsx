interface AboutLawFirmProps {
    description: string | null;
}

export default function AboutLawFirm({ description }: AboutLawFirmProps) {
    return (
        <section>
            <div className="prose max-w-none prose-gray">
                {description ? (
                    <div className="prose max-w-none prose-gray" dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                    <p className="text-gray-500 italic">No description provided.</p>
                )}
            </div>
        </section>
    );
}

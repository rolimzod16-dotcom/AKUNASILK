type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalContentProps = {
  lastUpdated: string;
  sections: LegalSection[];
};

export default function LegalContent({ lastUpdated, sections }: LegalContentProps) {
  return (
    <section className="apple-section pb-20">
      <div className="mx-auto max-w-[780px] px-6">
        <p className="mb-10 text-xs text-apple-muted">{lastUpdated}</p>
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="silk-headline text-2xl text-silk-indigo">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-apple-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
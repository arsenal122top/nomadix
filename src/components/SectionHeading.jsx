function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--forest-primary)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl text-[var(--text-dark)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[var(--text-muted)]">{description}</p>
    </div>
  )
}

export default SectionHeading

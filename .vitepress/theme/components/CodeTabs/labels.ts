const KNOWN: Record<string, string> = {
    rust: 'Rust',
    ts: 'TypeScript',
}

export function getLangLabel(lang: string): string | null {
    return KNOWN[lang] ?? null
}

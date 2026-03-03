import path from "path";
import fs from "fs";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const DOCS_DIR = path.join(process.cwd(), "docs");
const APIS_DIR = path.join(DOCS_DIR, "apis");
const CRUZAMENTOS_DIR = path.join(DOCS_DIR, "cruzamentos");

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface CategoryMeta {
  /** Directory name of the category (e.g. "banco-central"). */
  dir: string;
  label: string;
  position: number;
}

/** Frontmatter fields present in API doc `.md` files. */
export interface ApiDocFrontmatter {
  title: string;
  slug: string;
  orgao: string;
  url_base: string;
  tipo_acesso: string;
  autenticacao: string;
  formato_dados: string | string[];
  frequencia_atualizacao: string;
  campos_chave: string[];
  tags: string[];
  cruzamento_com?: string[];
  status?: 'documentado' | 'parcial' | 'stub';
}

/** Frontmatter fields present in cruzamento `.md` files. */
export interface CruzamentoFrontmatter {
  title: string;
  sidebar_position: number;
  dificuldade: string;
  fontes_utilizadas: string[];
  campos_ponte: string[];
  tags: string[];
  notebook_path?: string;
}

/** Frontmatter fields present in standalone docs (intro, como-contribuir). */
export interface StandaloneFrontmatter {
  title: string;
  slug?: string;
  sidebar_position?: number;
  [key: string]: unknown;
}

/** A parsed Markdown document entry returned by the content helpers. */
export interface DocEntry<T = ApiDocFrontmatter> {
  /** Frontmatter data. */
  frontmatter: T;
  /** Raw Markdown body (without the frontmatter fence). */
  content: string;
  /** Category directory name (e.g. "banco-central"). Only present for API docs. */
  category?: string;
  /** The filename without the `.md` extension. */
  fileName: string;
}

/** A category together with its child doc entries, for sidebar rendering. */
export interface SidebarCategory {
  meta: CategoryMeta;
  docs: DocEntry<ApiDocFrontmatter>[];
}

/** A single heading extracted from Markdown for table-of-contents rendering. */
export interface TocEntry {
  /** Heading depth: 2 for h2, 3 for h3, 4 for h4. */
  depth: number;
  /** Slug-ified id suitable for an anchor link. */
  id: string;
  /** The raw heading text. */
  text: string;
}

/** Previous / next navigation links within a category. */
export interface PrevNext {
  prev: { slug: string; title: string; category: string } | null;
  next: { slug: string; title: string; category: string } | null;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Turn a heading text into a URL-safe slug.
 *
 * Mirrors the behaviour of rehype-slug so that TOC links line up with the
 * rendered headings.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^\w\s-]/g, "")        // remove non-word chars
    .replace(/\s+/g, "-")            // spaces to hyphens
    .replace(/-+/g, "-")             // collapse consecutive hyphens
    .replace(/^-|-$/g, "");          // trim leading/trailing hyphens
}

/**
 * Parse a single `.md` file into a `DocEntry`.
 *
 * Returns `null` when the path does not exist or is not a file.
 */
function parseMarkdownFile<T>(
  filePath: string,
  category?: string,
): DocEntry<T> | null {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fileName = path.basename(filePath, ".md");

  return {
    frontmatter: data as T,
    content,
    category,
    fileName,
  };
}

// ---------------------------------------------------------------------------
// Module-level cache (safe: during `next build` the Node process persists)
// ---------------------------------------------------------------------------

let _categoriesCache: CategoryMeta[] | null = null;
let _sidebarCache: SidebarCategory[] | null = null;
let _allApiDocsCache: DocEntry<ApiDocFrontmatter>[] | null = null;

// ---------------------------------------------------------------------------
// 1. getCategories
// ---------------------------------------------------------------------------

/**
 * Read every `category.json` inside `docs/apis/` subdirectories and return
 * them sorted ascending by `position`.
 */
export function getCategories(): CategoryMeta[] {
  if (_categoriesCache) return _categoriesCache;

  const entries = fs.readdirSync(APIS_DIR, { withFileTypes: true });

  const categories: CategoryMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const catPath = path.join(APIS_DIR, entry.name, "category.json");
    if (!fs.existsSync(catPath)) continue;

    try {
      const raw = fs.readFileSync(catPath, "utf-8");
      const data = JSON.parse(raw) as Omit<CategoryMeta, "dir">;
      categories.push({ dir: entry.name, ...data });
    } catch {
      console.error(`Failed to parse category: ${entry.name}`);
    }
  }

  _categoriesCache = categories.sort((a, b) => a.position - b.position);
  return _categoriesCache;
}

// ---------------------------------------------------------------------------
// 2. getAllApiDocs
// ---------------------------------------------------------------------------

/**
 * Read **all** `.md` files from every category directory under `docs/apis/`.
 *
 * The returned array is sorted by category position first, then by the
 * document `title` alphabetically.
 */
export function getAllApiDocs(): DocEntry<ApiDocFrontmatter>[] {
  if (_allApiDocsCache) return _allApiDocsCache;

  const categories = getCategories();
  const docs: DocEntry<ApiDocFrontmatter>[] = [];

  for (const cat of categories) {
    const catDir = path.join(APIS_DIR, cat.dir);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const entry = parseMarkdownFile<ApiDocFrontmatter>(
        path.join(catDir, file),
        cat.dir,
      );
      if (entry) docs.push(entry);
    }
  }

  _allApiDocsCache = docs;
  return _allApiDocsCache;
}

// ---------------------------------------------------------------------------
// 3. getApiDoc
// ---------------------------------------------------------------------------

/**
 * Look up a single API doc by its **category directory name** and the
 * frontmatter `slug`.
 *
 * Example: `getApiDoc("banco-central", "sgs-cambio")`
 */
export function getApiDoc(
  category: string,
  slug: string,
): DocEntry<ApiDocFrontmatter> | null {
  const catDir = path.join(APIS_DIR, category);
  if (!fs.existsSync(catDir) || !fs.statSync(catDir).isDirectory()) {
    return null;
  }

  const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const entry = parseMarkdownFile<ApiDocFrontmatter>(
      path.join(catDir, file),
      category,
    );
    if (entry && entry.frontmatter.slug === slug) {
      return entry;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// 4. getSidebar
// ---------------------------------------------------------------------------

/**
 * Build a full sidebar tree: categories (sorted by position) each containing
 * their child doc entries (sorted alphabetically by title).
 */
export function getSidebar(): SidebarCategory[] {
  if (_sidebarCache) return _sidebarCache;

  const categories = getCategories();

  _sidebarCache = categories.map((cat) => {
    const catDir = path.join(APIS_DIR, cat.dir);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".md"));

    const docs: DocEntry<ApiDocFrontmatter>[] = [];
    for (const file of files) {
      const entry = parseMarkdownFile<ApiDocFrontmatter>(
        path.join(catDir, file),
        cat.dir,
      );
      if (entry) docs.push(entry);
    }

    docs.sort((a, b) =>
      a.frontmatter.title.localeCompare(b.frontmatter.title, "pt-BR"),
    );

    return { meta: cat, docs };
  });
  return _sidebarCache;
}

// ---------------------------------------------------------------------------
// 5. getAllCruzamentos
// ---------------------------------------------------------------------------

/**
 * Read all `.md` files in `docs/cruzamentos/` **except** `intro.md` (which is
 * the section landing page, not a recipe).
 *
 * Sorted by `sidebar_position`.
 */
export function getAllCruzamentos(): DocEntry<CruzamentoFrontmatter>[] {
  const files = fs
    .readdirSync(CRUZAMENTOS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "intro.md");

  const docs: DocEntry<CruzamentoFrontmatter>[] = [];

  for (const file of files) {
    const entry = parseMarkdownFile<CruzamentoFrontmatter>(
      path.join(CRUZAMENTOS_DIR, file),
    );
    if (entry) docs.push(entry);
  }

  return docs.sort(
    (a, b) =>
      (a.frontmatter.sidebar_position ?? 999) -
      (b.frontmatter.sidebar_position ?? 999),
  );
}

// ---------------------------------------------------------------------------
// 6. getCruzamentoDoc
// ---------------------------------------------------------------------------

/**
 * Fetch a single cruzamento doc by its filename (without `.md`).
 *
 * Example: `getCruzamentoDoc("cpf-cnpj-nexus")`
 */
export function getCruzamentoDoc(
  slug: string,
): DocEntry<CruzamentoFrontmatter> | null {
  const filePath = path.join(CRUZAMENTOS_DIR, `${slug}.md`);
  return parseMarkdownFile<CruzamentoFrontmatter>(filePath);
}

// ---------------------------------------------------------------------------
// 7. getStandaloneDoc
// ---------------------------------------------------------------------------

/**
 * Read a standalone doc from the `docs/` root.
 *
 * Pass just the name without the `.md` extension.
 * Example: `getStandaloneDoc("intro")`, `getStandaloneDoc("como-contribuir")`
 */
export function getStandaloneDoc(
  name: string,
): DocEntry<StandaloneFrontmatter> | null {
  const filePath = path.join(DOCS_DIR, `${name}.md`);
  return parseMarkdownFile<StandaloneFrontmatter>(filePath);
}

// ---------------------------------------------------------------------------
// 8. getAllTags
// ---------------------------------------------------------------------------

/**
 * Collect every unique tag from all API docs and return a map of
 * `tag -> DocEntry[]` (the docs that carry that tag).
 *
 * Tags are normalised (trimmed) but otherwise preserved with their original
 * casing / diacritics so they can be displayed as-is.
 */
export function getAllTags(): Map<string, DocEntry<ApiDocFrontmatter>[]> {
  const docs = getAllApiDocs();
  const map = new Map<string, DocEntry<ApiDocFrontmatter>[]>();

  for (const doc of docs) {
    for (const tag of doc.frontmatter.tags ?? []) {
      const normalized = tag.trim();
      if (!normalized) continue;
      if (!map.has(normalized)) map.set(normalized, []);
      map.get(normalized)!.push(doc);
    }
  }

  return map;
}

// ---------------------------------------------------------------------------
// 9. extractToc
// ---------------------------------------------------------------------------

/**
 * Extract h2 through h4 headings from raw Markdown and return a flat list of
 * `TocEntry` objects.
 *
 * This intentionally skips h1 (`#`) because pages should only have one h1
 * which is rendered separately as the page title.
 *
 * The regex handles ATX-style headings only (lines starting with `##`-`####`).
 */
export function extractToc(markdown: string): TocEntry[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const depth = match[1].length as 2 | 3 | 4;
    const text = match[2].trim();
    entries.push({ depth, id: slugify(text), text });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// 10. getPrevNextInCategory
// ---------------------------------------------------------------------------

/**
 * Given a category directory name and the current document's frontmatter
 * `slug`, return the previous and next docs within that category.
 *
 * Documents are ordered alphabetically by title (matching `getSidebar`).
 * Returns `null` for prev/next when the current doc is first/last.
 */
export function getPrevNextInCategory(
  category: string,
  currentSlug: string,
): PrevNext {
  const catDir = path.join(APIS_DIR, category);

  if (!fs.existsSync(catDir) || !fs.statSync(catDir).isDirectory()) {
    return { prev: null, next: null };
  }

  const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".md"));

  const docs: DocEntry<ApiDocFrontmatter>[] = [];
  for (const file of files) {
    const entry = parseMarkdownFile<ApiDocFrontmatter>(
      path.join(catDir, file),
      category,
    );
    if (entry) docs.push(entry);
  }

  // Sort alphabetically by title to match sidebar ordering.
  docs.sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title, "pt-BR"),
  );

  const idx = docs.findIndex((d) => d.frontmatter.slug === currentSlug);

  if (idx === -1) {
    return { prev: null, next: null };
  }

  const prevDoc = idx > 0 ? docs[idx - 1] : null;
  const nextDoc = idx < docs.length - 1 ? docs[idx + 1] : null;

  return {
    prev: prevDoc
      ? {
          slug: prevDoc.frontmatter.slug,
          title: prevDoc.frontmatter.title,
          category,
        }
      : null,
    next: nextDoc
      ? {
          slug: nextDoc.frontmatter.slug,
          title: nextDoc.frontmatter.title,
          category,
        }
      : null,
  };
}

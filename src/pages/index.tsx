import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/* ── Data ──────────────────────────────────────────────────── */

interface Category {
  name: string;
  emoji: string;
  count: number;
  slug: string;
}

const categories: Category[] = [
  {name: 'Portais Centrais', emoji: '\uD83C\uDFDB\uFE0F', count: 4, slug: 'portais-centrais'},
  {name: 'Banco Central', emoji: '\uD83C\uDFE6', count: 9, slug: 'banco-central'},
  {name: 'Receita Federal', emoji: '\uD83D\uDCCB', count: 4, slug: 'receita-federal'},
  {
    name: 'Transparência / CGU',
    emoji: '\uD83D\uDD0D',
    count: 8,
    slug: 'transparencia-cgu',
  },
  {name: 'Tesouro Nacional', emoji: '\uD83D\uDCB0', count: 3, slug: 'tesouro-nacional'},
  {name: 'Saúde / DATASUS', emoji: '\uD83C\uDFE5', count: 6, slug: 'saude-datasus'},
  {name: 'Educação', emoji: '\uD83C\uDF93', count: 4, slug: 'educacao'},
  {
    name: 'Justiça Eleitoral / TSE',
    emoji: '\uD83D\uDDF3\uFE0F',
    count: 7,
    slug: 'justica-eleitoral-tse',
  },
  {name: 'Poder Judiciário / CNJ', emoji: '\u2696\uFE0F', count: 4, slug: 'poder-judiciario-cnj'},
  {name: 'Meio Ambiente', emoji: '\uD83C\uDF3F', count: 7, slug: 'meio-ambiente'},
  {name: 'Trabalho e Emprego', emoji: '\uD83D\uDC77', count: 2, slug: 'trabalho-emprego'},
  {name: 'Previdência Social', emoji: '\uD83D\uDEE1\uFE0F', count: 2, slug: 'previdencia-social'},
  {name: 'Mercado Financeiro', emoji: '\uD83D\uDCC8', count: 4, slug: 'mercado-financeiro'},
  {name: 'IBGE Estatísticas', emoji: '\uD83D\uDCCA', count: 4, slug: 'ibge-estatisticas'},
  {name: 'IPEA', emoji: '\uD83D\uDD2C', count: 1, slug: 'ipea'},
  {
    name: 'Infraestrutura e Transportes',
    emoji: '\uD83D\uDE82',
    count: 5,
    slug: 'infraestrutura-transportes',
  },
  {name: 'Agências Reguladoras', emoji: '\uD83D\uDCDC', count: 4, slug: 'agencias-reguladoras'},
  {name: 'Dados Geoespaciais', emoji: '\uD83D\uDDFA\uFE0F', count: 5, slug: 'dados-geoespaciais'},
  {name: 'Diários Oficiais', emoji: '\uD83D\uDCF0', count: 2, slug: 'diarios-oficiais'},
  {name: 'APIs Governamentais', emoji: '\uD83D\uDD17', count: 3, slug: 'apis-governamentais'},
  {name: 'Segurança Pública', emoji: '\uD83D\uDE94', count: 1, slug: 'seguranca-publica'},
  {name: 'Outros', emoji: '\uD83D\uDCE6', count: 3, slug: 'outros'},
];

const stats = [
  {number: '93+', label: 'fontes de dados'},
  {number: '21', label: 'categorias'},
  {number: '5+', label: 'receitas de cruzamento'},
];

/* ── Hero Section ──────────────────────────────────────────── */

function HeroSection(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <Link to="/docs" className={styles.heroCta}>
          Explorar o catálogo
          <span className={styles.heroCtaArrow} aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    </header>
  );
}

/* ── Stats Section ─────────────────────────────────────────── */

function StatsSection(): ReactNode {
  return (
    <section className={styles.stats}>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <div className={styles.statNumber}>{stat.number}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Category Grid Section ─────────────────────────────────── */

function CategoryCard({category}: {category: Category}): ReactNode {
  return (
    <Link
      to={`/docs/apis/${category.slug}`}
      className={styles.categoryCard}>
      <span className={styles.categoryEmoji} role="img" aria-hidden="true">
        {category.emoji}
      </span>
      <div className={styles.categoryInfo}>
        <span className={styles.categoryName}>{category.name}</span>
        <span className={styles.categoryCount}>
          {category.count} {category.count === 1 ? 'fonte' : 'fontes'}
        </span>
      </div>
    </Link>
  );
}

function CategoriesSection(): ReactNode {
  return (
    <section className={styles.categories}>
      <div className={styles.sectionInner}>
        <Heading as="h2" className={styles.sectionTitle}>
          Categorias de Dados
        </Heading>
        <p className={styles.sectionSubtitle}>
          Navegue pelas categorias cobrindo todas as esferas do governo
          federal brasileiro.
        </p>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Cross-References Section ──────────────────────────────── */

function CrossRefSection(): ReactNode {
  return (
    <section className={styles.crossRef}>
      <div className={styles.crossRefInner}>
        <Heading as="h2" className={styles.crossRefTitle}>
          Receitas de Cruzamento
        </Heading>
        <p className={styles.crossRefText}>
          O verdadeiro poder dos dados abertos aparece quando cruzamos fontes
          diferentes. Nossas receitas de cruzamento mostram como combinar dados
          de CPF/CNPJ, licitações, patrimônio de agentes públicos e muito mais
          para investigações e fiscalização cidadã.
        </p>
        <Link to="/docs/cruzamentos" className={styles.crossRefCta}>
          Ver receitas de cruzamento
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

/* ── Contribute Section ────────────────────────────────────── */

function ContributeSection(): ReactNode {
  return (
    <section className={styles.contribute}>
      <div className={styles.contributeInner}>
        <Heading as="h2" className={styles.contributeTitle}>
          Como Contribuir
        </Heading>
        <p className={styles.contributeText}>
          Brazil Visible é um projeto open-source e colaborativo. Ajude-nos a
          mapear mais fontes de dados, criar novas receitas de cruzamento ou
          melhorar a documentação existente. Toda contribuição conta!
        </p>
        <div className={styles.contributeButtons}>
          <Link to="/docs/como-contribuir" className={styles.contributeCta}>
            Guia de contribuição
          </Link>
          <a
            href="https://github.com/nferdica/brazil-visible"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contributeCtaSecondary}>
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function Home(): ReactNode {
  return (
    <Layout
      title="Catálogo de Dados Públicos Brasileiros"
      description="Catálogo aberto com 93+ fontes de dados públicos brasileiros para fiscalização governamental, incluindo APIs, portais de transparência e receitas de cruzamento.">
      <HeroSection />
      <main>
        <StatsSection />
        <CategoriesSection />
        <CrossRefSection />
        <ContributeSection />
      </main>
    </Layout>
  );
}

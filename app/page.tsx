import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Landmark,
  Building2,
  FileText,
  Search,
  Coins,
  HeartPulse,
  GraduationCap,
  Vote,
  Scale,
  Leaf,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  FlaskConical,
  TrainFront,
  ScrollText,
  Globe,
  Newspaper,
  Webhook,
  ShieldAlert,
  Package,
  ArrowRight,
} from 'lucide-react';

import { HeroBackground } from '@/components/hero-background';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getSidebar } from '@/lib/content';

/* ── SEO ──────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Catálogo de Dados Públicos Brasileiros',
  description:
    'Catálogo aberto com 93+ fontes de dados públicos brasileiros para fiscalização governamental.',
  alternates: { canonical: 'https://brazilvisible.org' },
};

/* ── Data ──────────────────────────────────────────────────── */

interface Category {
  name: string;
  icon: LucideIcon;
  slug: string;
  count: number;
}

const categoryIcons: Record<string, LucideIcon> = {
  'portais-centrais': Landmark,
  'banco-central': Building2,
  'receita-federal': FileText,
  'transparencia-cgu': Search,
  'tesouro-nacional': Coins,
  'saude-datasus': HeartPulse,
  'educacao': GraduationCap,
  'justica-eleitoral-tse': Vote,
  'poder-judiciario-cnj': Scale,
  'meio-ambiente': Leaf,
  'trabalho-emprego': Briefcase,
  'previdencia-social': ShieldCheck,
  'mercado-financeiro': TrendingUp,
  'ibge-estatisticas': BarChart3,
  'ipea': FlaskConical,
  'infraestrutura-transportes': TrainFront,
  'agencias-reguladoras': ScrollText,
  'dados-geoespaciais': Globe,
  'diarios-oficiais': Newspaper,
  'apis-governamentais': Webhook,
  'seguranca-publica': ShieldAlert,
  'outros': Package,
};

function getCategories(): Category[] {
  const sidebar = getSidebar();
  return sidebar.map((cat) => ({
    name: cat.meta.label,
    icon: categoryIcons[cat.meta.dir] ?? Package,
    slug: cat.meta.dir,
    count: cat.docs.length,
  }));
}

/* ── Hero ──────────────────────────────────────────────────── */

function HeroSection(): ReactNode {
  return (
    <header className="relative flex min-h-screen items-center overflow-hidden bg-white dark:bg-dark-bg">
      <HeroBackground />
      <div className="relative z-10 mx-auto max-w-[900px] px-6">
        <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold leading-[1.08] tracking-tight text-neutral-900 dark:text-white mb-6">
          Dados públicos{' '}
          <span className="text-brazil-blue dark:text-brazil-blue-light">
            brasileiros
          </span>{' '}
          para quem{' '}
          <span className="text-brazil-blue dark:text-brazil-blue-light">
            fiscaliza
          </span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-[560px] leading-relaxed mb-10">
          Catálogo aberto com 93+ APIs e bases de dados do governo federal,
          organizadas por órgão, com exemplos de código e receitas de cruzamento.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/docs/"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 dark:bg-white px-7 py-3.5 text-base font-semibold text-white dark:text-neutral-900 no-underline transition-all hover:no-underline hover:text-white dark:hover:text-neutral-900 hover:shadow-lg hover:-translate-y-0.5"
          >
            Explorar o catálogo
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/docs/cruzamentos/"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-7 py-3.5 text-base font-semibold text-neutral-900 dark:text-white no-underline transition-all hover:no-underline hover:text-neutral-900 dark:hover:text-white hover:border-neutral-900 dark:hover:border-white hover:shadow-md"
          >
            Ver cruzamentos
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── About ─────────────────────────────────────────────────── */

function AboutSection(): ReactNode {
  const cats = getCategories();
  const totalSources = cats.reduce((sum, c) => sum + c.count, 0);
  const totalCategories = cats.length;

  return (
    <section
      className="bg-neutral-50 dark:bg-dark-surface py-20 px-6"
      aria-label="Sobre o projeto"
    >
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — text */}
        <ScrollReveal>
          <div>
            <span className="inline-block rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-dark-bg px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-5">
              Sobre
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              O que é o Brazil Visible?
            </h2>
            <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
              Um catálogo aberto que reúne APIs e bases de dados públicas do
              governo brasileiro, documentadas com exemplos de código Python e
              receitas de cruzamento. Feito para desenvolvedores, jornalistas e
              pesquisadores que querem fiscalizar o poder público com dados.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-brazil-blue dark:text-brazil-blue-light">
                  {totalSources}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  fontes de dados
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-brazil-blue dark:text-brazil-blue-light">
                  {totalCategories}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  categorias
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-brazil-blue dark:text-brazil-blue-light">
                  5
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  receitas
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Right — logo */}
        <ScrollReveal delay={100}>
          <div className="flex items-center justify-center">
            <Image
              src="/logo-light.svg"
              alt="Brazil Visible"
              width={320}
              height={213}
              className="hidden dark:block max-w-[320px] w-full h-auto opacity-80"
              priority={false}
            />
            <Image
              src="/logo-dark.svg"
              alt="Brazil Visible"
              width={320}
              height={213}
              className="block dark:hidden max-w-[320px] w-full h-auto opacity-80"
              priority={false}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── Categories ────────────────────────────────────────────── */

function CategoryCard({ category, index }: { category: Category; index: number }): ReactNode {
  const Icon = category.icon;

  return (
    <ScrollReveal delay={index * 20}>
      <Link
        href={`/docs/apis/${category.slug}/`}
        className="group flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-dark-bg px-4 py-3 no-underline text-neutral-900 dark:text-white transition-all hover:no-underline hover:text-neutral-900 dark:hover:text-white hover:border-brazil-blue dark:hover:border-brazil-blue hover:shadow-sm"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brazil-blue/10 text-brazil-blue">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <span className="text-sm font-medium leading-tight truncate min-w-0">
          {category.name}
        </span>
        <span className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {category.count}
          </span>
          <ArrowRight size={14} className="text-neutral-300 dark:text-neutral-700 transition-colors group-hover:text-brazil-blue" />
        </span>
      </Link>
    </ScrollReveal>
  );
}

function CategoriesSection(): ReactNode {
  const cats = getCategories();

  return (
    <section className="py-20 px-6" aria-label="Categorias de dados">
      <ScrollReveal>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Categorias de Dados
          </h2>
          <p className="text-center text-base md:text-lg text-neutral-500 dark:text-neutral-400 mb-10 max-w-[540px] mx-auto leading-relaxed">
            Navegue pelas categorias cobrindo todas as esferas do governo federal
            brasileiro.
          </p>
        </div>
      </ScrollReveal>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cats.map((cat, i) => (
          <CategoryCard key={cat.slug} category={cat} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Cross-References ──────────────────────────────────────── */

function CrossRefSection(): ReactNode {
  return (
    <section className="bg-neutral-50 dark:bg-dark-surface py-20 px-6" aria-label="Receitas de cruzamento">
      <ScrollReveal>
        <div className="max-w-[680px] mx-auto text-center">
          <span className="inline-block rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-dark-bg px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-5">
            Destaque
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Receitas de Cruzamento
          </h2>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
            O verdadeiro poder dos dados abertos aparece quando cruzamos fontes
            diferentes. Nossas receitas mostram como combinar dados de CPF/CNPJ,
            licitações, patrimônio de agentes públicos e muito mais.
          </p>
          <Link
            href="/docs/cruzamentos/"
            className="inline-flex items-center gap-2 rounded-full bg-brazil-blue hover:bg-brazil-blue-dark px-7 py-3 text-base font-semibold text-white no-underline transition-all hover:no-underline hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
          >
            Ver receitas de cruzamento
            <ArrowRight size={18} />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ── Donate ────────────────────────────────────────────────── */

function DonateSection(): ReactNode {
  return (
    <section className="bg-neutral-950 py-20 px-6" aria-label="Apoie o projeto">
      <ScrollReveal>
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
            Apoie o Projeto
          </h2>
          <p className="text-base md:text-lg text-neutral-400 leading-relaxed mb-8">
            Brazil Visible é mantido de forma independente. Sua doação ajuda a
            cobrir custos de servidor, domínio e dedicação ao desenvolvimento.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/sponsors/nferdica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-semibold text-neutral-900 no-underline transition-all hover:no-underline hover:text-neutral-900 hover:-translate-y-0.5 hover:shadow-lg"
            >
              GitHub Sponsors
            </a>
            <a
              href="https://buymeacoffee.com/nferdica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-transparent px-7 py-3 text-base font-semibold text-white no-underline transition-all hover:no-underline hover:text-white hover:border-neutral-500 hover:bg-white/5"
            >
              Buy Me a Coffee
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ── Contribute ────────────────────────────────────────────── */

function ContributeSection(): ReactNode {
  return (
    <section className="py-20 px-6" aria-label="Como contribuir">
      <ScrollReveal>
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Como Contribuir
          </h2>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
            Brazil Visible é um projeto open-source e colaborativo. Ajude-nos a
            mapear mais fontes de dados, criar novas receitas de cruzamento ou
            melhorar a documentação existente.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs/como-contribuir/"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 dark:bg-white px-7 py-3 text-base font-semibold text-white dark:text-neutral-900 no-underline transition-all hover:no-underline hover:text-white dark:hover:text-neutral-900 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Guia de contribuição
            </Link>
            <a
              href="https://github.com/nferdica/brazil-visible"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-7 py-3 text-base font-semibold text-neutral-900 dark:text-white no-underline transition-all hover:no-underline hover:text-neutral-900 dark:hover:text-white hover:border-neutral-900 dark:hover:border-white hover:shadow-md"
            >
              GitHub
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Brazil Visible',
  url: 'https://brazilvisible.org',
  description:
    'Catálogo aberto com 93+ fontes de dados públicos brasileiros para fiscalização governamental.',
  inLanguage: 'pt-BR',
};

export default function Home(): ReactNode {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <main>
        <AboutSection />
        <CategoriesSection />
        <CrossRefSection />
        <DonateSection />
        <ContributeSection />
      </main>
    </>
  );
}

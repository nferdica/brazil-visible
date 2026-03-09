import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
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
  ChevronDown,
  Database,
  Code,
  GitFork,
  Users,
  Signal,
  GitPullRequest,
  MessageSquarePlus,
  BookOpen,
} from 'lucide-react';

import { ScrollReveal } from '@/components/scroll-reveal';
import { CopyCommand } from '@/components/copy-command';
import { getSidebar } from '@/lib/content';

/* ── SEO ──────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    absolute: 'Brazil Visible — Catálogo de Dados Públicos Brasileiros',
  },
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
    <header className="relative flex min-h-dvh items-center overflow-hidden bg-white dark:bg-dark-bg">
      <div className="relative z-10 mx-auto max-w-[900px] px-6 text-center">
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
        <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-[560px] mx-auto leading-relaxed mb-10">
          Catálogo aberto com 93+ APIs e bases de dados do governo federal,
          organizadas por órgão, com exemplos de código e receitas de cruzamento.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs/"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 dark:bg-white px-7 py-3.5 text-base font-semibold text-white dark:text-neutral-900 no-underline transition-all hover:no-underline hover:text-white dark:hover:text-neutral-900 hover:shadow-lg hover:-translate-y-0.5"
          >
            Começar agora
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/docs/cruzamentos/"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-7 py-3.5 text-base font-semibold text-neutral-900 dark:text-white no-underline transition-all hover:no-underline hover:text-neutral-900 dark:hover:text-white hover:border-neutral-900 dark:hover:border-white hover:shadow-md"
          >
            Ver cruzamentos
          </Link>
        </div>

        <div className="mt-8">
          <CopyCommand />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <ChevronDown size={24} className="text-neutral-300 dark:text-neutral-600 animate-bounce" />
      </div>
    </header>
  );
}

/* ── About ─────────────────────────────────────────────────── */

const features = [
  {
    icon: Database,
    title: '90+ fontes de dados',
    description: 'APIs, portais e bases de dados de órgãos federais documentados.',
  },
  {
    icon: Code,
    title: 'SDK TypeScript',
    description: 'Acesse todas as fontes via código com npm i @brazilvisible/sdk.',
  },
  {
    icon: GitFork,
    title: 'Receitas de cruzamento',
    description: 'Combine fontes diferentes para investigações e análises.',
  },
  {
    icon: Signal,
    title: 'Health check automático',
    description: 'Monitoramento de disponibilidade das APIs a cada 6 horas.',
  },
  {
    icon: Users,
    title: 'Open-source',
    description: 'Código aberto, colaborativo e mantido pela comunidade.',
  },
  {
    icon: Globe,
    title: '22 categorias',
    description: 'De saúde e educação a finanças públicas e meio ambiente.',
  },
];

function AboutSection(): ReactNode {
  return (
    <section
      className="bg-neutral-50 dark:bg-dark-surface py-20 px-6"
      aria-label="Sobre o projeto"
    >
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <div className="max-w-[680px] mx-auto text-center mb-14">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-5 block">
              Sobre
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              O que é o Brazil Visible?
            </h2>
            <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Um catálogo aberto e colaborativo que centraliza APIs, bases de
              dados e portais de transparência do governo brasileiro — tudo
              documentado com exemplos de código, campos disponíveis e receitas
              de cruzamento entre fontes. Feito para desenvolvedores, jornalistas
              de dados e pesquisadores que querem fiscalizar o poder público.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-dark-bg p-5"
                >
                  <Icon size={20} strokeWidth={1.75} className="text-brazil-blue mb-3" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── Categories ────────────────────────────────────────────── */

function CategoryCard({ category }: { category: Category }): ReactNode {
  const Icon = category.icon;

  return (
    <Link
      href={`/docs/apis/${category.slug}/`}
      className="group flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-dark-bg px-4 py-3 no-underline text-neutral-900 dark:text-white transition-[border-color,box-shadow] hover:no-underline hover:text-neutral-900 dark:hover:text-white hover:border-brazil-blue dark:hover:border-brazil-blue hover:shadow-sm"
    >
      <span className="flex shrink-0 items-center justify-center text-neutral-400 dark:text-neutral-500 transition-colors group-hover:text-brazil-blue">
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
  );
}

function CategoriesSection(): ReactNode {
  const cats = getCategories();

  return (
    <section className="py-20 px-6" aria-label="Categorias de dados">
      <ScrollReveal>
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-5">
            Catálogo
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Categorias de Dados
          </h2>
          <p className="text-center text-base md:text-lg text-neutral-500 dark:text-neutral-400 mb-10 max-w-[540px] mx-auto leading-relaxed">
            Navegue pelas categorias cobrindo todas as esferas do governo federal
            brasileiro.
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cats.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ── Contribute + Support (unified) ───────────────────────── */

const contributeSteps = [
  {
    icon: GitPullRequest,
    title: 'Fork e clone',
    description: 'Faça fork do repositório e configure o ambiente local.',
  },
  {
    icon: BookOpen,
    title: 'Documente uma API',
    description: 'Escolha uma fonte de dados e siga o template de documentação.',
  },
  {
    icon: MessageSquarePlus,
    title: 'Abra um PR',
    description: 'Envie suas contribuições e receba feedback da comunidade.',
  },
];

function ContributeSection(): ReactNode {
  return (
    <section className="bg-neutral-900 py-20 px-6" aria-label="Contribua e apoie">
      <ScrollReveal>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — How to contribute */}
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-5 block">
                Comunidade
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
                Como Contribuir
              </h2>
              <p className="text-base md:text-lg text-neutral-400 leading-relaxed mb-8">
                Brazil Visible é open-source. Qualquer pessoa pode ajudar a
                documentar novas fontes de dados ou criar receitas de cruzamento.
              </p>
              <div className="space-y-5 mb-8">
                {contributeSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                        <span className="text-sm font-bold">{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Icon size={14} className="text-neutral-400" />
                          {step.title}
                        </h3>
                        <p className="text-sm text-neutral-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/docs/como-contribuir/"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 no-underline transition-all hover:no-underline hover:text-neutral-900 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Guia de contribuição
                </Link>
                <a
                  href="https://github.com/nferdica/brazil-visible"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-transparent px-6 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:no-underline hover:text-white hover:border-neutral-500 hover:bg-white/5"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Right — Support */}
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-5 block">
                Apoio
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
                Apoie o Projeto
              </h2>
              <p className="text-base md:text-lg text-neutral-400 leading-relaxed mb-8">
                Brazil Visible é mantido de forma independente. Sua doação ajuda
                a cobrir custos de servidor, domínio e dedicação ao
                desenvolvimento.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/sponsors/nferdica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 no-underline transition-all hover:no-underline hover:text-neutral-900 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  GitHub Sponsors
                </a>
                <a
                  href="https://buymeacoffee.com/nferdica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-transparent px-6 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:no-underline hover:text-white hover:border-neutral-500 hover:bg-white/5"
                >
                  Buy Me a Coffee
                </a>
              </div>
            </div>
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
        <ContributeSection />
      </main>
    </>
  );
}

import fs from 'fs';
import path from 'path';

const APIS_DIR = 'docs/apis';
const REQUIRED_FM = ['title', 'slug', 'orgao', 'url_base', 'tipo_acesso', 'status'];
const OPTIONAL_FM = ['autenticacao', 'formato_dados', 'frequencia_atualizacao', 'campos_chave', 'tags', 'cruzamento_com'];
const REQUIRED_SECTIONS = ['O que é', 'Como acessar', 'Endpoints/recursos principais', 'Exemplo de uso', 'Campos disponíveis', 'Cruzamentos possíveis', 'Limitações conhecidas'];

const results = [];

const categories = fs.readdirSync(APIS_DIR).filter(d =>
  fs.statSync(path.join(APIS_DIR, d)).isDirectory()
);

for (const cat of categories) {
  const catDir = path.join(APIS_DIR, cat);
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(catDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const fm = fmMatch ? fmMatch[1] : '';
    const body = fmMatch ? content.slice(fmMatch[0].length) : content;

    // Check required frontmatter
    const missingFm = REQUIRED_FM.filter(f => !fm.includes(f + ':'));
    const missingOptFm = OPTIONAL_FM.filter(f => !fm.includes(f + ':'));

    // Check status
    const statusMatch = fm.match(/status:\s*(\w+)/);
    const status = statusMatch ? statusMatch[1] : 'unknown';

    // Check sections
    const missingSections = REQUIRED_SECTIONS.filter(s => !body.includes('## ' + s));

    // Count code blocks
    const codeBlocks = (body.match(/```/g) || []).length / 2;

    // Count tables
    const tableRows = (body.match(/\|.*\|.*\|/g) || []).length;

    // Body length (chars)
    const bodyLen = body.trim().length;

    results.push({
      category: cat,
      file: file.replace('.md', ''),
      status,
      missingFm: missingFm.join(', ') || '-',
      missingOptFm: missingOptFm.join(', ') || '-',
      missingSections: missingSections.join(', ') || '-',
      codeBlocks: Math.floor(codeBlocks),
      tableRows,
      bodyLen,
    });
  }
}

// Summary
const stubs = results.filter(r => r.status === 'stub').length;
const parciais = results.filter(r => r.status === 'parcial').length;
const documentados = results.filter(r => r.status === 'documentado').length;
const withMissingSections = results.filter(r => r.missingSections !== '-').length;
const withMissingOptFm = results.filter(r => r.missingOptFm !== '-').length;

console.log('=== RESUMO GERAL ===');
console.log(`Total de APIs: ${results.length}`);
console.log(`Status — stub: ${stubs} | parcial: ${parciais} | documentado: ${documentados}`);
console.log(`Com seções faltando: ${withMissingSections}`);
console.log(`Com frontmatter opcional faltando: ${withMissingOptFm}`);
console.log('');

// Stubs
console.log('=== STUBS ===');
results.filter(r => r.status === 'stub').forEach(r => {
  console.log(`  ${r.category}/${r.file} | Body: ${r.bodyLen} chars | Missing sections: ${r.missingSections} | Missing opt FM: ${r.missingOptFm}`);
});

// Parciais
console.log('');
console.log('=== PARCIAIS ===');
results.filter(r => r.status === 'parcial').forEach(r => {
  console.log(`  ${r.category}/${r.file} | Body: ${r.bodyLen} chars | Missing sections: ${r.missingSections} | Missing opt FM: ${r.missingOptFm}`);
});

// Documentados with gaps
console.log('');
console.log('=== DOCUMENTADOS COM LACUNAS ===');
results.filter(r => r.status === 'documentado' && (r.missingSections !== '-' || r.missingOptFm !== '-')).forEach(r => {
  const issues = [];
  if (r.missingSections !== '-') issues.push(`Missing sections: ${r.missingSections}`);
  if (r.missingOptFm !== '-') issues.push(`Missing opt FM: ${r.missingOptFm}`);
  console.log(`  ${r.category}/${r.file} | ${issues.join(' | ')}`);
});

// Fully complete documentados
console.log('');
console.log('=== DOCUMENTADOS COMPLETOS ===');
const completos = results.filter(r => r.status === 'documentado' && r.missingSections === '-' && r.missingOptFm === '-');
console.log(`Total: ${completos.length}`);
completos.forEach(r => {
  console.log(`  ${r.category}/${r.file} | Body: ${r.bodyLen} chars | Code: ${r.codeBlocks} blocks | Tables: ${r.tableRows} rows`);
});

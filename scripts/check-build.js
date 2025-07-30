#!/usr/bin/env node

/**
 * Script para verificar problemas comunes de build antes del despliegue
 */

const fs = require('fs');
const path = require('path');

// Patrones problemáticos
const PROBLEMATIC_PATTERNS = [
  {
    name: 'Comillas no escapadas en JSX',
    pattern: />[^<]*"[^<]*</g,
    fix: 'Usar &quot; en lugar de " dentro del contenido JSX'
  },
  {
    name: 'Apostrofes no escapados en JSX',
    pattern: />[^<]*'[^<]*</g,
    fix: 'Usar &apos; en lugar de \' dentro del contenido JSX'
  }
];

// Archivos a verificar
const FILES_TO_CHECK = [
  'app/[locale]/page.tsx',
  'app/[locale]/chat-demo/page.tsx',
  'app/[locale]/login/page.tsx',
  'components/pii/pii-preview.tsx',
  'components/ui/brand.tsx'
];

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let hasIssues = false;

  PROBLEMATIC_PATTERNS.forEach(({ name, pattern, fix }) => {
    const matches = content.match(pattern);
    if (matches) {
      hasIssues = true;
      console.log(`❌ ${filePath}: ${name}`);
      console.log(`   Fix: ${fix}`);
      
      // Mostrar líneas problemáticas
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          console.log(`   Línea ${index + 1}: ${line.trim()}`);
        }
      });
      console.log('');
    }
  });

  return !hasIssues;
}

function main() {
  console.log('🔍 Verificando archivos para problemas de build...\n');
  
  let allGood = true;
  
  FILES_TO_CHECK.forEach(file => {
    const isOk = checkFile(file);
    if (isOk) {
      console.log(`✅ ${file}`);
    } else {
      allGood = false;
    }
  });

  console.log('\n' + '='.repeat(50));
  
  if (allGood) {
    console.log('🎉 Todos los archivos están listos para build!');
    process.exit(0);
  } else {
    console.log('❌ Se encontraron problemas que pueden causar errores de build.');
    console.log('Por favor, corrige los problemas antes de hacer deploy.');
    process.exit(1);
  }
}

main();

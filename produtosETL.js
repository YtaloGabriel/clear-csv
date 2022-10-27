import fs from 'fs';
import csv from 'fast-csv';

let dadosResgatados = [];

const resgatarDados = fs
  .createReadStream('./csv/produtos.csv', {})
  .pipe(csv.parse())
  .on('data', (data) => dadosResgatados.push(data));

// Limpar dados resgatados
resgatarDados.on('end', () => {
  const removerLinhasVazias = dadosResgatados.filter((linha) => {
    return linha[0] !== '';
  });
  dadosResgatados = removerLinhasVazias;

  const adicionarAspas = dadosResgatados.map((grupo) => {
    return grupo.map((item) => `"${item}"`);
  });
  dadosResgatados = adicionarAspas;

  const identificarInicioDeLinha = dadosResgatados.map(
    (linha) => (linha[0] = `\n/${linha[0]}`),
  );

  const dadosLimpos = dadosResgatados
    .toString()
    .replace('/', '')
    .replace('\n', '')
    .replaceAll(',\n/', '\n');

  //

  fs.writeFileSync(`./csv/produtos-limpos.csv`, dadosLimpos, 'utf-8');
});

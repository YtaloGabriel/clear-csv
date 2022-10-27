import fs from 'fs';
import csv from 'fast-csv';

let dadosResgatados = [];

const resgatarDados = fs
  .createReadStream('./csv/grupos.csv', {})
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
    (linha) => (linha[0] = `/${linha[0]}`),
  );

  const dadosLimpos = dadosResgatados
    .toString()
    .replace('/', '')
    .replaceAll(',/', '');

  //

  fs.writeFileSync(`./csv/grupos-limpos.csv`, dadosLimpos, 'utf8');
});
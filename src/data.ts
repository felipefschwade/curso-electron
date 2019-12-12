import * as fs from 'fs';

export default class Data {

  private static geraCaminho(nome: string): string {
    return `${__dirname}/../data/${nome}.json`;
  }

  public static salvaDadosCurso(nomeArquivo: string, conteudoArquivo: object) {
    const path = this.geraCaminho(nomeArquivo);
    const content = JSON.stringify(conteudoArquivo);
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      fs.writeFileSync(path, content);
    } else {
      if (!fs.existsSync(`${__dirname}/../data`)) {
        fs.mkdirSync(`${__dirname}/../data`);
      }
      fs.writeFileSync(path, content);
    }
  }

  public static adicionaTempoAoCurso(nomeArquivo: string, tempoEstudado: string) {
    const dados = {
      tempo: tempoEstudado,
      ultimoEstudo: new Date().toString(),
    };
    this.salvaDadosCurso(nomeArquivo, dados);
  }

  public static pegaDados(nomeArquivo: string): string {
    return fs.readFileSync(this.geraCaminho(nomeArquivo)).toString();
  }

  public static pegaNomeDosCursos(): Array<string> {
    const arquivos = fs.readdirSync(`${__dirname}/../data`);
    const cursos = arquivos.map((a) => a.substr(0, a.lastIndexOf('.')));
    return cursos;
  }

}

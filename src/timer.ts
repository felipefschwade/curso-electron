import {ipcRenderer} from 'electron';
import * as moment from 'moment';


export default class Timer {

    private static segundos: number = 0;
    private static timer: NodeJS.Timer;

  public static iniciar(el: Element): void {
    const tempo = moment.duration(el.textContent);
    this.segundos = tempo.asSeconds();
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.segundos++;
      el.textContent = this.segundosParaTempo();
    }, 1000);
  }

  public static parar(el: Element): void {
    const curso = el.textContent;
    const tempoEstudado = this.segundosParaTempo();
    clearInterval(this.timer);
    ipcRenderer.send('curso-parado', curso, tempoEstudado);
  }

  private static segundosParaTempo(): string {
    return moment().startOf('day').seconds(this.segundos).format('HH:mm:ss');
  }

}

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import {ipcRenderer, shell, Input} from 'electron';
import data from './data';
import timer from './timer';

const tempoEl: Element = document.querySelector('.tempo');
const botaoPlay: HTMLImageElement = document.querySelector('.botao-play');
const curso: Element = document.querySelector('.curso');
const botaoAdicionar: Element = document.querySelector('.botao-adicionar');
const campoAdicionar: HTMLInputElement = document.querySelector('.campo-adicionar');

let play = false;
let imgs = ['img/play-button.svg', 'img/stop-button.svg'];

window.onload = () => {
  const dadosCurso = JSON.parse(data.pegaDados(curso.textContent));
  tempoEl.textContent = dadosCurso.tempo;
};

ipcRenderer.on('curso-trocado', (event: Event, nomeCurso: string) => {
  if (play) {
    const click = new MouseEvent('click');
    botaoPlay.dispatchEvent(click);
  }
  curso.textContent = nomeCurso;
  try {
    const dadosCurso = JSON.parse(data.pegaDados(curso.textContent));
    tempoEl.textContent = dadosCurso.tempo;
  } catch (error) {
    tempoEl.textContent = '00:00:00';
  }
});

ipcRenderer.on('atalho-iniciar-parar', () => {
  const click = new MouseEvent('click');
  botaoPlay.dispatchEvent(click);
});

const linkSobre: Element = document.querySelector('#link-sobre');

linkSobre.addEventListener('click', () => {
  ipcRenderer.send('abrir-janela-sobre');
});

botaoPlay.addEventListener('click', () => {
  if (play) {
    timer.parar(curso);
    play = false;
    // tslint:disable-next-line: no-unused-expression
    new Notification('Alura Timer', {
      body: `O curso ${curso.textContent} foi parado!`,
      icon: 'img/stop-button.png',
    });
  } else {
    timer.iniciar(tempoEl);
    play = true;
    // tslint:disable-next-line: no-unused-expression
    new Notification('Alura Timer', {
      body: `O curso ${curso.textContent} foi iniciado!`,
      icon: 'img/play-button.png',
    });
  }
  imgs = imgs.reverse();
  botaoPlay.src = imgs[0];
});

botaoAdicionar.addEventListener('click', () => {
  if(campoAdicionar.value === '') {
// tslint:disable-next-line: no-unused-expression
    new Notification('Alura Timer', {
      body: 'Não posso adicionar um curso com nome vazio',
    });
    return;
  }
  const novoCurso: string = campoAdicionar.value;
  curso.textContent = novoCurso;
  tempoEl.textContent = '00:00:00';
  campoAdicionar.value = '';
  ipcRenderer.send('curso-adicionado', novoCurso);
});

